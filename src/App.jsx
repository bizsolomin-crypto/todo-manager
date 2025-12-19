import { useState } from 'react'
import { useTodos } from './hooks/useTodos'
import './App.css'

function App() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos()
  const [inputValue, setInputValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('none') // none, recent, old
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all') // all, recent, old

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      addTodo(inputValue, selectedCategory)
      setInputValue('')
      setSelectedCategory('none')
      setShowModal(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddTodo()
    }
    if (e.key === 'Escape') {
      setShowModal(false)
      setInputValue('')
      setSelectedCategory('none')
    }
  }

  const handlePlusClick = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setInputValue('')
    setSelectedCategory('none')
  }

  // Нормализация данных для совместимости
  const normalizedTodos = todos.map(todo => ({
    id: todo.id,
    text: todo.text || '',
    completed: todo.completed || false,
    created_at: todo.created_at || todo.createdAt || new Date().toISOString(),
    category: todo.category || 'none' // none, recent, old
  })).filter(todo => todo.text) // Убираем задачи без текста

  // Разделяем задачи по категории (только активные)
  const activeTodos = normalizedTodos.filter(todo => !todo.completed)
  const completedTodos = normalizedTodos.filter(todo => todo.completed)
  
  const recentTodos = activeTodos.filter(todo => todo.category === 'recent')
  const oldTodos = activeTodos.filter(todo => todo.category === 'old')
  const noneCategoryTodos = activeTodos.filter(todo => todo.category === 'none' || !todo.category)

  const recentCount = recentTodos.length
  const oldCount = oldTodos.length
  const completedCount = completedTodos.length

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

        <div className="add-button-section">
          <button className="add-button-large" onClick={handlePlusClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Добавить задачу</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-input-group">
                  <label>Название задачи</label>
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="Введите название задачи..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    autoFocus
                  />
                </div>
                <div className="modal-category-group">
                  <label>Категория</label>
                  <div className="category-buttons">
                    <button
                      className={`category-btn ${selectedCategory === 'none' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('none')}
                    >
                      Без категории
                    </button>
                    <button
                      className={`category-btn ${selectedCategory === 'recent' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('recent')}
                    >
                      Менее 15 минут
                    </button>
                    <button
                      className={`category-btn ${selectedCategory === 'old' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('old')}
                    >
                      Более 15 минут
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="modal-cancel-btn" onClick={handleCloseModal}>
                  Отмена
                </button>
                <button className="modal-add-btn" onClick={handleAddTodo} disabled={!inputValue.trim()}>
                  Добавить
                </button>
              </div>
            </div>
          </div>
        )}

        {normalizedTodos.length > 0 && (
          <div className="filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Все ({activeTodos.length})
            </button>
            <button
              className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}
              onClick={() => setFilter('recent')}
              title="Менее 15 минут"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              15 мин ({recentCount})
            </button>
            <button
              className={`filter-btn ${filter === 'old' ? 'active' : ''}`}
              onClick={() => setFilter('old')}
              title="Более 15 минут"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              15 мин ({oldCount})
            </button>
          </div>
        )}

        {/* Все активные задачи в одном списке при выборе "Все" */}
        {filter === 'all' && (
          <>
            {activeTodos.length > 0 ? (
              <div className="todos-section">
                <div className="todos-list">
                  {activeTodos.map(todo => (
                    <div key={todo.id} className="todo-item">
                      <div className="todo-content">
                        <button
                          className="checkbox"
                          onClick={() => toggleTodo(todo.id)}
                        >
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
            ) : (
              !loading && normalizedTodos.length === 0 && (
                <div className="todos-section">
                  <div className="todos-list">
                    <div className="empty-state">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                      <p>Нет задач. Добавьте новую задачу!</p>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Блок выполненных задач при выборе "Все" - только если есть выполненные */}
            {completedCount > 0 && (
              <div className="todos-section completed-section">
                <div className="section-header">
                  <h2>Выполненные задачи ({completedCount})</h2>
                </div>
                <div className="todos-list completed-list">
                  {completedTodos.map(todo => (
                    <div key={todo.id} className="todo-item completed">
                      <div className="todo-content">
                        <button
                          className="checkbox checked"
                          onClick={() => toggleTodo(todo.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
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
          </>
        )}


        {/* Блок задач менее 15 минут */}
        {filter === 'recent' && recentCount > 0 && (
          <div className="todos-section">
            <div className="section-header">
              <h2>Менее 15 минут ({recentCount})</h2>
            </div>
            <div className="todos-list">
              {recentTodos.map(todo => (
                <div key={todo.id} className="todo-item">
                  <div className="todo-content">
                    <button
                      className="checkbox"
                      onClick={() => toggleTodo(todo.id)}
                    >
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

        {/* Блок задач более 15 минут */}
        {filter === 'old' && oldCount > 0 && (
          <div className="todos-section">
            <div className="section-header">
              <h2>Более 15 минут ({oldCount})</h2>
            </div>
            <div className="todos-list">
              {oldTodos.map(todo => (
                <div key={todo.id} className="todo-item">
                  <div className="todo-content">
                    <button
                      className="checkbox"
                      onClick={() => toggleTodo(todo.id)}
                    >
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

        {/* Пустое состояние при выборе конкретного фильтра */}
        {filter !== 'all' && normalizedTodos.length > 0 && (
          <>
            {filter === 'recent' && recentCount === 0 && activeTodos.length > 0 && (
              <div className="todos-list">
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  <p>Нет активных задач менее 15 минут</p>
                </div>
              </div>
            )}
            {filter === 'old' && oldCount === 0 && activeTodos.length > 0 && (
              <div className="todos-list">
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  <p>Нет активных задач более 15 минут</p>
                </div>
              </div>
            )}
          </>
        )}


      </div>
    </div>
  )
}

export default App

