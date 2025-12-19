import { useState } from 'react'
import { useTodos } from './hooks/useTodos'
import './App.css'

function App() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos()
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all') // all, active, completed

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      addTodo(inputValue)
      setInputValue('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  // Нормализация данных для совместимости
  const normalizedTodos = todos.map(todo => ({
    id: todo.id,
    text: todo.text || '',
    completed: todo.completed || false
  })).filter(todo => todo.text) // Убираем задачи без текста

  const filteredTodos = normalizedTodos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = normalizedTodos.filter(todo => !todo.completed).length
  const completedCount = normalizedTodos.filter(todo => todo.completed).length

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

        <div className="input-section">
          <div className="input-wrapper">
            <input
              type="text"
              className="todo-input"
              placeholder="Добавить новую задачу..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="add-button" onClick={handleAddTodo}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>

        {normalizedTodos.length > 0 && (
          <div className="filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Все ({normalizedTodos.length})
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Активные ({activeCount})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Выполненные ({completedCount})
            </button>
            {completedCount > 0 && (
              <button className="clear-button" onClick={clearCompleted}>
                Очистить выполненные
              </button>
            )}
          </div>
        )}

        <div className="todos-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              <p>
                {filter === 'all' 
                  ? 'Нет задач. Добавьте новую задачу!'
                  : filter === 'active'
                  ? 'Нет активных задач'
                  : 'Нет выполненных задач'}
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => (
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

        {normalizedTodos.length > 0 && (
          <div className="stats">
            <span>Всего задач: {normalizedTodos.length}</span>
            <span>Активных: {activeCount}</span>
            <span>Выполнено: {completedCount}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

