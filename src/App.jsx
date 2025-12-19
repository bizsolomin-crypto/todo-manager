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

  // Разделяем задачи на активные и выполненные
  const activeTodos = normalizedTodos.filter(todo => !todo.completed)
  const completedTodos = normalizedTodos.filter(todo => todo.completed)

  const activeCount = activeTodos.length
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

        {/* Блок активных задач */}
        {(filter === 'all' || filter === 'active') && (
          <div className="todos-section">
            {activeCount > 0 && (
              <div className="section-header">
                <h2>Активные задачи ({activeCount})</h2>
              </div>
            )}
            <div className="todos-list">
              {activeTodos.length === 0 && (filter === 'all' || filter === 'active') ? (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  <p>Нет активных задач</p>
                </div>
              ) : (
                activeTodos.map(todo => (
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
                ))
              )}
            </div>
          </div>
        )}

        {/* Блок выполненных задач */}
        {(filter === 'all' || filter === 'completed') && completedCount > 0 && (
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

