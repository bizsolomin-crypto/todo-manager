import { useState } from 'react'
import { useTodos } from './hooks/useTodos'
import './App.css'

function App() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, clearCompleted, updateTodo } = useTodos()
  const [inputValue, setInputValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('none') // none, recent, old
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all') // all, recent, old
  const [editingId, setEditingId] = useState(null)
  const [activeTab, setActiveTab] = useState('tasks') // tasks, calendar
  const [currentDate, setCurrentDate] = useState(new Date())

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      if (editingId) {
        // Редактирование существующей задачи
        updateTodo(editingId, {
          text: inputValue.trim(),
          category: selectedCategory
        })
        setEditingId(null)
      } else {
        // Добавление новой задачи
        addTodo(inputValue, selectedCategory)
      }
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
      setEditingId(null)
    }
  }

  const handlePlusClick = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setInputValue('')
    setSelectedCategory('none')
    setEditingId(null)
  }

  const handleEditStart = (todo) => {
    setEditingId(todo.id)
    setInputValue(todo.text)
    setSelectedCategory(todo.category || 'none')
    setShowModal(true)
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

        {/* Вкладки */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Задачи
          </button>
          <button
            className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            Календарь
          </button>
        </div>

        {/* Контент вкладки "Задачи" */}
        {activeTab === 'tasks' && (
          <div className="tab-content">
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
                <h2>{editingId ? 'Редактировать задачу' : 'Добавить задачу'}</h2>
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
                      title="Менее 15 минут"
                    >
                      <span>&lt;</span> 15 мин
                    </button>
                    <button
                      className={`category-btn ${selectedCategory === 'old' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('old')}
                      title="Более 15 минут"
                    >
                      <span>&gt;</span> 15 мин
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="modal-cancel-btn" onClick={handleCloseModal}>
                  Отмена
                </button>
                <button className="modal-add-btn" onClick={handleAddTodo} disabled={!inputValue.trim()}>
                  {editingId ? 'Сохранить' : 'Добавить'}
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
              <span>&lt;</span>
              15 мин ({recentCount})
            </button>
            <button
              className={`filter-btn ${filter === 'old' ? 'active' : ''}`}
              onClick={() => setFilter('old')}
              title="Более 15 минут"
            >
              <span>&gt;</span>
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
                        <span 
                          className="todo-text"
                          onDoubleClick={() => handleEditStart(todo)}
                          title="Двойной клик для редактирования"
                        >
                          {todo.text}
                        </span>
                        {todo.category === 'recent' && (
                          <span className="category-tag category-tag-recent" title="Менее 15 минут">
                            <span>&lt;</span>
                            <span>15 мин</span>
                          </span>
                        )}
                        {todo.category === 'old' && (
                          <span className="category-tag category-tag-old" title="Более 15 минут">
                            <span>&gt;</span>
                            <span>15 мин</span>
                          </span>
                        )}
                        <button
                          className="edit-button"
                          onClick={() => handleEditStart(todo)}
                          aria-label="Редактировать задачу"
                          title="Редактировать"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
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
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        className="edit-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleEditSave(todo.id)}
                        onKeyDown={(e) => handleEditKeyPress(e, todo.id)}
                        autoFocus
                      />
                    ) : (
                      <>
                        <span 
                          className="todo-text"
                          onDoubleClick={() => handleEditStart(todo)}
                          title="Двойной клик для редактирования"
                        >
                          {todo.text}
                        </span>
                        {todo.category === 'recent' && (
                          <span className="category-tag category-tag-recent" title="Менее 15 минут">
                            <span>&lt;</span>
                            <span>15 мин</span>
                          </span>
                        )}
                        {todo.category === 'old' && (
                          <span className="category-tag category-tag-old" title="Более 15 минут">
                            <span>&gt;</span>
                            <span>15 мин</span>
                          </span>
                        )}
                        <button
                          className="edit-button"
                          onClick={() => handleEditStart(todo)}
                          aria-label="Редактировать задачу"
                          title="Редактировать"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  {editingId !== todo.id && (
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
                  )}
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
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        className="edit-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleEditSave(todo.id)}
                        onKeyDown={(e) => handleEditKeyPress(e, todo.id)}
                        autoFocus
                      />
                    ) : (
                      <>
                        <span 
                          className="todo-text"
                          onDoubleClick={() => handleEditStart(todo)}
                          title="Двойной клик для редактирования"
                        >
                          {todo.text}
                        </span>
                        {todo.category === 'recent' && (
                          <span className="category-tag category-tag-recent" title="Менее 15 минут">
                            <span>&lt;</span>
                            <span>15 мин</span>
                          </span>
                        )}
                        {todo.category === 'old' && (
                          <span className="category-tag category-tag-old" title="Более 15 минут">
                            <span>&gt;</span>
                            <span>15 мин</span>
                          </span>
                        )}
                        <button
                          className="edit-button"
                          onClick={() => handleEditStart(todo)}
                          aria-label="Редактировать задачу"
                          title="Редактировать"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  {editingId !== todo.id && (
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
                  )}
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
        )}

        {/* Контент вкладки "Календарь" */}
        {activeTab === 'calendar' && (
          <div className="tab-content">
            <div className="calendar-section">
              <div className="calendar-header">
                <button 
                  className="calendar-nav-btn"
                  onClick={() => {
                    const newDate = new Date(currentDate)
                    newDate.setMonth(newDate.getMonth() - 1)
                    setCurrentDate(newDate)
                  }}
                  aria-label="Предыдущий месяц"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <h2 className="calendar-month-year">
                  {currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                </h2>
                <button 
                  className="calendar-nav-btn"
                  onClick={() => {
                    const newDate = new Date(currentDate)
                    newDate.setMonth(newDate.getMonth() + 1)
                    setCurrentDate(newDate)
                  }}
                  aria-label="Следующий месяц"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>

              <div className="calendar-weekdays">
                <div className="calendar-weekday">Пн</div>
                <div className="calendar-weekday">Вт</div>
                <div className="calendar-weekday">Ср</div>
                <div className="calendar-weekday">Чт</div>
                <div className="calendar-weekday">Пт</div>
                <div className="calendar-weekday weekend">Сб</div>
                <div className="calendar-weekday weekend">Вс</div>
              </div>

              <div className="calendar-days">
                {(() => {
                  const year = currentDate.getFullYear()
                  const month = currentDate.getMonth()
                  const firstDay = new Date(year, month, 1)
                  const lastDay = new Date(year, month + 1, 0)
                  const daysInMonth = lastDay.getDate()
                  const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // Понедельник = 0
                  
                  const days = []
                  
                  // Пустые ячейки до первого дня месяца
                  for (let i = 0; i < startingDayOfWeek; i++) {
                    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
                  }
                  
                  // Дни месяца
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month, day)
                    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1 // Понедельник = 0
                    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 // Суббота или воскресенье
                    const isToday = date.toDateString() === new Date().toDateString()
                    
                    days.push(
                      <div 
                        key={day} 
                        className={`calendar-day ${isWeekend ? 'weekend' : 'workday'} ${isToday ? 'today' : ''}`}
                      >
                        <span className="calendar-day-number">{day}</span>
                      </div>
                    )
                  }
                  
                  return days
                })()}
              </div>

              <div className="calendar-legend">
                <div className="legend-item">
                  <div className="legend-color workday"></div>
                  <span>Рабочий день</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color weekend"></div>
                  <span>Выходной</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color today"></div>
                  <span>Сегодня</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App

