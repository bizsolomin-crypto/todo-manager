import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTodos() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    setLoading(true)
    setError(null)

    try {
      if (supabase) {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 3000)
        )
        
        const queryPromise = supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false })

        try {
          const { data, error: supabaseError } = await Promise.race([
            queryPromise,
            timeoutPromise
          ])

          if (supabaseError) {
            if (supabaseError.code === '42P01' || supabaseError.message.includes('relation') || supabaseError.message.includes('does not exist')) {
              throw new Error('Таблица todos не найдена. Выполните SQL скрипт в Supabase.')
            }
            throw supabaseError
          }
          
          const todosWithCategory = (data || []).map(todo => ({
            id: todo.id,
            text: todo.text || '',
            completed: todo.completed || false,
            created_at: todo.created_at || todo.createdAt || new Date().toISOString(),
            updated_at: todo.updated_at || todo.updatedAt,
            category: todo.category || 'none',
            task_date: todo.task_date || null
          }))
          
          setTodos(todosWithCategory)
        } catch (timeoutError) {
          throw new Error('Supabase не отвечает. Используется локальное хранилище.')
        }
      } else {
        const saved = localStorage.getItem('todos')
        setTodos(saved ? JSON.parse(saved) : [])
      }
    } catch (err) {
      console.error('Error loading todos:', err)
      setError(err.message)
      const saved = localStorage.getItem('todos')
      setTodos(saved ? JSON.parse(saved) : [])
    } finally {
      setLoading(false)
    }
  }

  const saveToLocalStorage = (updatedTodos) => {
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
  }

  const addTodo = async (text, category = 'none', taskDate = null, reward = null) => {
    const newTodo = {
      text: text.trim(),
      completed: false,
      created_at: new Date().toISOString(),
      category: category || 'none',
      task_date: taskDate || null,
      reward: reward || null
    }

    const tempTodo = {
      id: `temp-${Date.now()}`,
      ...newTodo
    }
    setTodos([tempTodo, ...todos])

    try {
      if (supabase) {
        const { data, error: supabaseError } = await supabase
          .from('todos')
          .insert([newTodo])
          .select()
          .single()

        if (supabaseError) throw supabaseError
        setTodos([data, ...todos.filter(t => t.id !== tempTodo.id)])
      } else {
        const todo = { id: Date.now(), ...newTodo }
        const updatedTodos = [todo, ...todos.filter(t => t.id !== tempTodo.id)]
        setTodos(updatedTodos)
        saveToLocalStorage(updatedTodos)
      }
    } catch (err) {
      console.error('Error adding todo:', err)
      setError(err.message)
      const todo = { id: Date.now(), ...newTodo }
      const updatedTodos = [todo, ...todos.filter(t => t.id !== tempTodo.id)]
      setTodos(updatedTodos)
      saveToLocalStorage(updatedTodos)
    }
  }

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    const updatedTodo = { ...todo, completed: !todo.completed }
    setTodos(todos.map(t => t.id === id ? updatedTodo : t))

    try {
      if (supabase) {
        const { error: supabaseError } = await supabase
          .from('todos')
          .update({ completed: updatedTodo.completed })
          .eq('id', id)

        if (supabaseError) throw supabaseError
        await loadTodos()
      } else {
        const updatedTodos = todos.map(t => t.id === id ? updatedTodo : t)
        setTodos(updatedTodos)
        saveToLocalStorage(updatedTodos)
      }
    } catch (err) {
      console.error('Error toggling todo:', err)
      setError(err.message)
      const updatedTodos = todos.map(t => t.id === id ? updatedTodo : t)
      setTodos(updatedTodos)
      saveToLocalStorage(updatedTodos)
    }
  }

  const deleteTodo = async (id) => {
    const previousTodos = todos
    setTodos(todos.filter(t => t.id !== id))

    try {
      if (supabase) {
        const { error: supabaseError } = await supabase
          .from('todos')
          .delete()
          .eq('id', id)

        if (supabaseError) throw supabaseError
        await loadTodos()
      } else {
        const updatedTodos = todos.filter(t => t.id !== id)
        setTodos(updatedTodos)
        saveToLocalStorage(updatedTodos)
      }
    } catch (err) {
      console.error('Error deleting todo:', err)
      setError(err.message)
      setTodos(previousTodos)
      const updatedTodos = previousTodos.filter(t => t.id !== id)
      setTodos(updatedTodos)
      saveToLocalStorage(updatedTodos)
    }
  }

  const clearCompleted = async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id)

    try {
      if (supabase) {
        const { error: supabaseError } = await supabase
          .from('todos')
          .delete()
          .in('id', completedIds)

        if (supabaseError) throw supabaseError
        setTodos(todos.filter(t => !t.completed))
      } else {
        const updatedTodos = todos.filter(t => !t.completed)
        setTodos(updatedTodos)
        saveToLocalStorage(updatedTodos)
      }
    } catch (err) {
      console.error('Error clearing completed:', err)
      setError(err.message)
      const updatedTodos = todos.filter(t => !t.completed)
      setTodos(updatedTodos)
      saveToLocalStorage(updatedTodos)
    }
  }

  const updateTodo = async (id, updates) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    const updatedTodo = { 
      ...todo, 
      ...updates,
      category: updates.category !== undefined ? updates.category : (todo.category || 'none'),
      task_date: updates.task_date !== undefined ? updates.task_date : (todo.task_date || null),
      reward: updates.reward !== undefined ? updates.reward : (todo.reward || null)
    }

    setTodos(todos.map(t => t.id === id ? updatedTodo : t))

    try {
      if (supabase) {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        )

        const updateData = { 
          ...updates,
          category: updates.category !== undefined ? updates.category : (todo.category || 'none'),
          task_date: updates.task_date !== undefined ? updates.task_date : (todo.task_date || null),
          reward: updates.reward !== undefined ? updates.reward : (todo.reward || null)
        }

        const updatePromise = supabase
          .from('todos')
          .update(updateData)
          .eq('id', id)

        const { data: updatedData, error: updateError } = await Promise.race([
          updatePromise,
          timeoutPromise
        ])
        
        if (updateError) throw updateError

        if (updatedData && updatedData.length > 0) {
          const updatedItem = updatedData[0]
          setTodos(todos.map(t => t.id === id ? {
            ...t,
            ...updatedItem,
            category: updatedItem.category || t.category || 'none'
          } : t))
        }
      } else {
        const updatedTodos = todos.map(t => t.id === id ? updatedTodo : t)
        setTodos(updatedTodos)
        saveToLocalStorage(updatedTodos)
      }
    } catch (err) {
      console.error('Error updating todo:', err)
      setError(err.message)
      const updatedTodos = todos.map(t => t.id === id ? updatedTodo : t)
      setTodos(updatedTodos)
      saveToLocalStorage(updatedTodos)
    }
  }

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    updateTodo,
    refresh: loadTodos
  }
}
