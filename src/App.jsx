import { useState } from 'react'
import { useTodos } from './hooks/useTodos'
import './App.css'

function App() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, updateTodo, refresh } = useTodos()
  const [inputValue, setInputValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('none')
  const [taskDate, setTaskDate] = useState('')
  const [reward, setReward] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [activeTab, setActiveTab] = useState('tasks')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [errorDismissed, setErrorDismissed] = useState(false)

  // Форматирование даты в YYYY-MM-DD без сдвига часового пояса
  const formatDateForInput = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Получение строки даты для сравнения
  const getDateString = (date) => {
    if (!date) return null
    const d = new Date(date)
    return formatDateForInput(d)
  }

  const resetModal = () => {
    setInputValue('')
    setSelectedCategory('none')
    setTaskDate('')
    setReward('')
    setEditingId(null)
  }

  const handleAddTodo = () => {
    if (!inputValue.trim()) return

    if (editingId) {
      const todo = normalizedTodos.find(t => t.id === editingId)
      updateTodo(editingId, {
        text: inputValue.trim(),
        category: selectedCategory,
        task_date: taskDate || todo?.task_date || null,
        reward: reward.trim() || null
      })
    } else {
      const finalDate = taskDate || (selectedDate ? formatDateForInput(selectedDate) : null)
      addTodo(inputValue, selectedCategory, finalDate, reward.trim() || null)
    }
    resetModal()
    setShowModal(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddTodo()
    } else if (e.key === 'Escape') {
      resetModal()
      setShowModal(false)
    }
  }

  const handlePlusClick = () => {
    resetModal()
    if (selectedDate) {
      setTaskDate(formatDateForInput(selectedDate))
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    resetModal()
    setShowModal(false)
  }

  const handleEditStart = (todo) => {
    setEditingId(todo.id)
    setInputValue(todo.text)
    setSelectedCategory(todo.category || 'none')
    setTaskDate(todo.task_date ? formatDateForInput(todo.task_date) : '')
    setReward(todo.reward || '')
    setShowModal(true)
  }

  const handleDateChange = (newDate) => {
    setTaskDate(newDate)
    if (newDate) {
      const [year, month, day] = newDate.split('-').map(Number)
      const date = new Date(year, month - 1, day)
      setSelectedDate(date)
      if (currentDate.getFullYear() !== year || currentDate.getMonth() !== month - 1) {
        setCurrentDate(date)
      }
    } else if (!editingId) {
      setSelectedDate(null)
    }
  }

  // Нормализация данных
  const normalizedTodos = todos.map(todo => ({
    id: todo.id,
    text: todo.text || '',
    completed: todo.completed || false,
    created_at: todo.created_at || todo.createdAt || new Date().toISOString(),
    category: todo.category || 'none',
    task_date: todo.task_date || null,
    reward: todo.reward || null
  })).filter(todo => todo.text)

  // Фильтрация задач
  const activeTodos = normalizedTodos.filter(todo => !todo.completed)
  const completedTodos = normalizedTodos.filter(todo => todo.completed)
  const recentTodos = activeTodos.filter(todo => todo.category === 'recent')
  const oldTodos = activeTodos.filter(todo => todo.category === 'old')

  const recentCount = recentTodos.length
  const oldCount = oldTodos.length
  const completedCount = completedTodos.length

  // Вычисление прогресса наград
  const getRewardValue = (reward) => {
    if (!reward) return 0
    const num = parseInt(reward, 10)
    return isNaN(num) ? 0 : num
  }

  const totalReward = normalizedTodos.reduce((sum, todo) => sum + getRewardValue(todo.reward), 0)
  const completedReward = completedTodos.reduce((sum, todo) => sum + getRewardValue(todo.reward), 0)
  const progressPercentage = totalReward > 0 ? Math.round((completedReward / totalReward) * 100) : 0

  // Фильтрация задач по дате для календаря
  const getTasksForDate = (date) => {
    if (!date) return []
    const dateStr = formatDateForInput(date)
    return normalizedTodos.filter(todo => {
      const todoDateStr = getDateString(todo.task_date || todo.created_at)
      return todoDateStr === dateStr
    })
  }

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  // Компонент задачи
  const TodoItem = ({ todo, showCategory = true }) => (
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
        <div className="todo-text-wrapper">
          <span 
            className="todo-text"
            onDoubleClick={() => !todo.completed && handleEditStart(todo)}
            title={todo.completed ? '' : 'Двойной клик для редактирования'}
          >
            {todo.text}
          </span>
          {!todo.completed && (showCategory || todo.reward) && (
            <div className="todo-tags">
              {showCategory && (
                <>
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
                </>
              )}
              {todo.reward && (
                <span className="reward-tag" title={`Награда: ${todo.reward}`}>
                  🏆 {todo.reward}
                </span>
              )}
            </div>
          )}
        </div>
        {!todo.completed && (
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
        )}
        {todo.completed && (
          <button
            className="restore-button"
            onClick={() => toggleTodo(todo.id)}
            aria-label="Восстановить задачу"
            title="Восстановить задачу"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M3 21v-5h5"></path>
            </svg>
          </button>
        )}
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
  )

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Мои задачи</h1>
          <p className="subtitle">Организуйте свою жизнь</p>
        </header>

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

        {activeTab === 'tasks' && (
          <div className="tab-content">
            {error && !errorDismissed && (
              <div className="error-banner">
                <span>Ошибка: {error}</span>
                <button 
                  className="error-close" 
                  onClick={() => {
                    setErrorDismissed(true)
                    refresh()
                  }}
                  aria-label="Закрыть"
                >
                  ×
                </button>
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

            {totalReward > 0 && (
              <div className="progress-section">
                <div className="progress-header">
                  <span className="progress-label">Прогресс наград</span>
                  <span className="progress-value">{completedReward} / {totalReward}</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progressPercentage}%` }}
                  >
                  </div>
                </div>
              </div>
            )}

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
                    <div className="modal-row-group">
                      <div className="modal-date-group">
                        <label>Дата задачи</label>
                        <input
                          type="date"
                          className="modal-date-input"
                          value={taskDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          onKeyDown={handleKeyPress}
                        />
                      </div>
                      <div className="modal-reward-group">
                        <label>Награда</label>
                        <input
                          type="number"
                          className="modal-input modal-reward-input"
                          placeholder="0"
                          value={reward}
                          onChange={(e) => {
                            const value = e.target.value
                            // Ограничиваем до 3 цифр
                            if (value === '' || (value.length <= 3 && /^\d+$/.test(value))) {
                              setReward(value)
                            }
                          }}
                          onKeyDown={handleKeyPress}
                          min="0"
                          max="999"
                          maxLength={3}
                        />
                      </div>
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

            {filter === 'all' && (
              <>
                {activeTodos.length > 0 ? (
                  <div className="todos-section">
                    <div className="todos-list">
                      {activeTodos.map(todo => <TodoItem key={todo.id} todo={todo} showCategory={true} />)}
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

                {completedCount > 0 && (
                  <div className="todos-section completed-section">
                    <div className="section-header">
                      <h2>Выполненные задачи ({completedCount})</h2>
                    </div>
                    <div className="todos-list completed-list">
                      {completedTodos.map(todo => <TodoItem key={todo.id} todo={todo} showCategory={false} />)}
                    </div>
                  </div>
                )}
              </>
            )}

            {filter === 'recent' && (
              recentCount > 0 ? (
                <div className="todos-section">
                  <div className="section-header">
                    <h2>Менее 15 минут ({recentCount})</h2>
                  </div>
                  <div className="todos-list">
                    {recentTodos.map(todo => <TodoItem key={todo.id} todo={todo} showCategory={true} />)}
                  </div>
                </div>
              ) : (
                activeTodos.length > 0 && (
                  <div className="todos-list">
                    <div className="empty-state">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                      <p>Нет активных задач менее 15 минут</p>
                    </div>
                  </div>
                )
              )
            )}

            {filter === 'old' && (
              oldCount > 0 ? (
                <div className="todos-section">
                  <div className="section-header">
                    <h2>Более 15 минут ({oldCount})</h2>
                  </div>
                  <div className="todos-list">
                    {oldTodos.map(todo => <TodoItem key={todo.id} todo={todo} showCategory={true} />)}
                  </div>
                </div>
              ) : (
                activeTodos.length > 0 && (
                  <div className="todos-list">
                    <div className="empty-state">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                      <p>Нет активных задач более 15 минут</p>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="tab-content">
            <div className="add-button-section">
              <button className="add-button-large" onClick={handlePlusClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
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
                  const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
                  
                  const days = []
                  
                  for (let i = 0; i < startingDayOfWeek; i++) {
                    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
                  }
                  
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month, day)
                    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
                    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6
                    const isToday = date.toDateString() === new Date().toDateString()
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
                    const dayTasks = getTasksForDate(date)
                    const hasTasks = dayTasks.length > 0
                    
                    days.push(
                      <div 
                        key={day} 
                        className={`calendar-day ${isWeekend ? 'weekend' : 'workday'} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasTasks ? 'has-tasks' : ''}`}
                        onClick={() => {
                          setSelectedDate(date)
                          if (showModal && !editingId) {
                            setTaskDate(formatDateForInput(date))
                          }
                        }}
                      >
                        <span className="calendar-day-number">{day}</span>
                        {hasTasks && (
                          <span className="calendar-day-tasks-count">{dayTasks.length}</span>
                        )}
                      </div>
                    )
                  }
                  
                  return days
                })()}
              </div>

              {selectedDate && (
                <div className="calendar-tasks">
                  <div className="calendar-tasks-header">
                    <h3>
                      {selectedDate.toLocaleDateString('ru-RU', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </h3>
                    <div className="calendar-tasks-header-actions">
                      <button 
                        className="calendar-add-task-btn"
                        onClick={() => {
                          resetModal()
                          setTaskDate(formatDateForInput(selectedDate))
                          setShowModal(true)
                        }}
                        aria-label="Добавить задачу на эту дату"
                        title="Добавить задачу на эту дату"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                      <button 
                        className="calendar-close-date"
                        onClick={() => setSelectedDate(null)}
                        aria-label="Закрыть"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                  {selectedDateTasks.length > 0 ? (
                    <div className="calendar-tasks-list">
                      {selectedDateTasks.map(todo => (
                        <div key={todo.id} className={`calendar-task-item ${todo.completed ? 'completed' : ''}`}>
                          <div className="calendar-task-content">
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
                            <div className="calendar-task-text-wrapper">
                              <span className="calendar-task-text">{todo.text}</span>
                              {!todo.completed && (todo.category === 'recent' || todo.category === 'old' || todo.reward) && (
                                <div className="todo-tags">
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
                                  {todo.reward && (
                                    <span className="reward-tag" title={`Награда: ${todo.reward}`}>
                                      🏆 {todo.reward}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
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
                  ) : (
                    <div className="calendar-tasks-empty">
                      <p>Нет задач на эту дату</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App
