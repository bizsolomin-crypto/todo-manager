import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTodos() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Загрузка задач при монтировании
  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    setLoading(true)
    setError(null)

    try {
      if (supabase) {
        // Используем Supabase с таймаутом
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        )
        
        const queryPromise = supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false })

        const { data, error: supabaseError } = await Promise.race([
          queryPromise,
          timeoutPromise
        ])

        if (supabaseError) throw supabaseError
        setTodos(data || [])
      } else {
        // Fallback на localStorage
        const saved = localStorage.getItem('todos')
        setTodos(saved ? JSON.parse(saved) : [])
      }
    } catch (err) {
      console.error('Error loading todos:', err)
      setError(err.message)
      // Fallback на localStorage при ошибке
      const saved = localStorage.getItem('todos')
      setTodos(saved ? JSON.parse(saved) : [])
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (text) => {
    const newTodo = {
      text: text.trim(),
      completed: false,
      created_at: new Date().toISOString()
    }

    // Оптимистичное обновление
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
        // Заменяем временную задачу на реальную
        setTodos([data, ...todos.filter(t => t.id !== tempTodo.id)])
      } else {
        const todo = {
          id: Date.now(),
          ...newTodo
        }
        const updatedTodos = [todo, ...todos.filter(t => t.id !== tempTodo.id)]
        setTodos(updatedTodos)
        localStorage.setItem('todos', JSON.stringify(updatedTodos))
      }
    } catch (err) {
      console.error('Error adding todo:', err)
      setError(err.message)
      // Откатываем оптимистичное обновление и используем fallback
      const todo = {
        id: Date.now(),
        ...newTodo
      }
      const updatedTodos = [todo, ...todos.filter(t => t.id !== tempTodo.id)]
      setTodos(updatedTodos)
      localStorage.setItem('todos', JSON.stringify(updatedTodos))
    }
  }

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    const updatedTodo = { ...todo, completed: !todo.completed }

    // Оптимистичное обновление
    setTodos(todos.map(t => t.id === id ? updatedTodo : t))

    try {
      if (supabase) {
        const { error: supabaseError } = await supabase
          .from('todos')
          .update({ completed: updatedTodo.completed })
          .eq('id', id)

        if (supabaseError) {
          throw supabaseError
        }
        // Перезагружаем для синхронизации
        await loadTodos()
      } else {
        const updatedTodos = todos.map(t => t.id === id ? updatedTodo : t)
        setTodos(updatedTodos)
        localStorage.setItem('todos', JSON.stringify(updatedTodos))
      }
    } catch (err) {
      console.error('Error toggling todo:', err)
      setError(err.message)
      // Откатываем изменение
      setTodos(todos.map(t => t.id === id ? todo : t))
      // Fallback
      const updatedTodos = todos.map(t => t.id === id ? updatedTodo : t)
      localStorage.setItem('todos', JSON.stringify(updatedTodos))
    }
  }

  const deleteTodo = async (id) => {
    const todoToDelete = todos.find(t => t.id === id)
    if (!todoToDelete) return

    // Оптимистичное обновление
    const previousTodos = todos
    setTodos(todos.filter(t => t.id !== id))

    try {
      if (supabase) {
        const { error: supabaseError } = await supabase
          .from('todos')
          .delete()
          .eq('id', id)

        if (supabaseError) {
          throw supabaseError
        }
        // Перезагружаем для синхронизации
        await loadTodos()
      } else {
        const updatedTodos = todos.filter(t => t.id !== id)
        setTodos(updatedTodos)
        localStorage.setItem('todos', JSON.stringify(updatedTodos))
      }
    } catch (err) {
      console.error('Error deleting todo:', err)
      setError(err.message)
      // Откатываем удаление
      setTodos(previousTodos)
      // Fallback
      const updatedTodos = previousTodos.filter(t => t.id !== id)
      localStorage.setItem('todos', JSON.stringify(updatedTodos))
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
        localStorage.setItem('todos', JSON.stringify(updatedTodos))
      }
    } catch (err) {
      console.error('Error clearing completed:', err)
      setError(err.message)
      // Fallback
      const updatedTodos = todos.filter(t => !t.completed)
      setTodos(updatedTodos)
      localStorage.setItem('todos', JSON.stringify(updatedTodos))
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
    refresh: loadTodos
  }
}

