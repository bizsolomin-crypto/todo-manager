import { useState } from 'react'
import { useTodos } from './hooks/useTodos'
import './App.css'

function App() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos()
  const [inputValue, setInputValue] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [filter, setFilter] = useState('all') // all, recent, old

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      addTodo(inputValue)
      setInputValue('')
      setShowInput(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
    if (e.key === 'Escape') {
      setShowInput(false)
      setInputValue('')
    }
  }

  const handlePlusClick = () => {
    setShowInput(true)
  }

  // Нормализация данных для совместимости
  const normalizedTodos = todos.map(todo => ({
    id: todo.id,
    text: todo.text || '',
    completed: todo.completed || false,
    created_at: todo.created_at || todo.createdAt || new Date().toISOString()
  })).filter(todo => todo.text) // Убираем задачи без текста

  // Функция для проверки времени создания задачи
  const getTaskAge = (createdAt) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffMinutes = (now - created) / (1000 * 60)
    return diffMinutes
  }

  // Разделяем задачи по времени создания
  const recentTodos = normalizedTodos.filter(todo => getTaskAge(todo.created_at) < 15)
  const oldTodos = normalizedTodos.filter(todo => getTaskAge(todo.created_at) >= 15)

  // Также разделяем по статусу для отображения
  const activeTodos = normalizedTodos.filter(todo => !todo.completed)
  const completedTodos = normalizedTodos.filter(todo => todo.completed)

  const recentCount = recentTodos.length
  const oldCount = oldTodos.length

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Мои задачи</h1>
          <p className="subtitle">Организуйте свою жизнь</p>
        </header>

        {error && (
          <div className="error-banner">
            Ошибка: {error}. Используется локальное хранилище.
          </div>
        )}

        {loading && todos.length === 0 && (
          <div className="loading-state">
            <p>Загрузка задач...</p>
          </div>
        )}

        {showInput ? (
          <div className="input-section">
            <div className="input-wrapper">
              <input
                type="text"
                className="todo-input"
                placeholder="Введите задачу..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                autoFocus
              />
              <button className="add-button" onClick={handleAddTodo}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button className="cancel-button" onClick={() => { setShowInput(false); setInputValue(''); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="add-button-section">
            <button className="add-button-large" onClick={handlePlusClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        )}

        {normalizedTodos.length > 0 && (
          <div className="filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Все ({normalizedTodos.length})
            </button>
            <button
              className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}
              onClick={() => setFilter('recent')}
            >
              Менее 15 минут ({recentCount})
            </button>
            <button
              className={`filter-btn ${filter === 'old' ? 'active' : ''}`}
              onClick={() => setFilter('old')}
            >
              Более 15 минут ({oldCount})
            </button>
          </div>
        )}

        {/* Блок задач менее 15 минут */}
        {(filter === 'all' || filter === 'recent') && (
          <div className="todos-section">
            {recentCount > 0 && (
              <div className="section-header">
                <h2>Менее 15 минут ({recentCount})</h2>
              </div>
            )}
            <div className="todos-list">
              {recentTodos.length === 0 && (filter === 'all' || filter === 'recent') ? (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  <p>Нет задач менее 15 минут</p>
                </div>
              ) : (
                recentTodos.map(todo => (
                  <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                    <div className="todo-content">
                      <button
                        className={`checkbox ${todo.completed ? 'checked' : ''}`}
                        onClick={() => toggleTodo(todo.id)}
                      >
                        {todo.completed && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </button>
                      <span className="todo-text">{todo.text}</span>
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => deleteTodo(todo.id)}
                      aria-label="Удалить задачу"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Блок задач более 15 минут */}
        {(filter === 'all' || filter === 'old') && oldCount > 0 && (
          <div className="todos-section completed-section">
            <div className="section-header">
              <h2>Более 15 минут ({oldCount})</h2>
            </div>
            <div className="todos-list completed-list">
              {oldTodos.map(todo => (
                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-content">
                    <button
                      className={`checkbox ${todo.completed ? 'checked' : ''}`}
                      onClick={() => toggleTodo(todo.id)}
                    >
                      {todo.completed && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </button>
                    <span className="todo-text">{todo.text}</span>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label="Удалить задачу"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Пустое состояние когда нет задач вообще */}
        {normalizedTodos.length === 0 && !loading && (
          <div className="todos-list">
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              <p>Нет задач. Добавьте новую задачу!</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App

