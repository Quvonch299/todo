'use client'
import React, { useState, useEffect } from 'react'
import { FaPlus, FaTrash, FaEdit, FaCheck, FaMoon, FaSun } from 'react-icons/fa'

export default function AllBox() {
  const [filter, setFilter] = useState('1')
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const [editId, setEditId] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  /* ===== Dark mode ===== */
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedMode)
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  /* ===== Todos localStorage ===== */
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) setTodos(JSON.parse(savedTodos))
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  /* ===== Functions ===== */
  const addTodo = () => {
    if (!text.trim()) return

    if (editId) {
      setTodos(todos.map(t =>
        t.id === editId ? { ...t, title: text } : t
      ))
      setEditId(null)
    } else {
      setTodos([{ id: Date.now(), title: text, completed: false }, ...todos])
    }
    setText('')
  }

  const removeTodo = id => setTodos(todos.filter(t => t.id !== id))

  const editTodo = todo => {
    setText(todo.title)
    setEditId(todo.id)
  }

  const toggleTodo = id => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }

  const filteredTodos = todos.filter(t => {
    if (filter === '2') return t.completed
    if (filter === '3') return !t.completed
    return true
  })

  /* ===== UI ===== */
  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Todo App
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:scale-110 transition"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { id: '1', label: 'Barchasi' },
            { id: '2', label: 'Bajarilgan' },
            { id: '3', label: 'Bajarilmagan' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition
                ${filter === btn.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}
              `}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="Bugun nima qilmoqchisiz?"
            className="flex-1 px-4 py-3 sm:py-4 rounded-xl border dark:border-gray-700
              bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            onClick={addTodo}
            className="px-6 py-3 sm:py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700
              text-white flex items-center justify-center gap-2 transition"
          >
            <FaPlus />
            {editId ? 'Saqlash' : 'Qo‘shish'}
          </button>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between
                p-4 sm:p-5 rounded-xl border dark:border-gray-700
                bg-white dark:bg-gray-800 transition
                ${todo.completed ? 'opacity-80' : ''}`}
            >
              <div
                onClick={() => toggleTodo(todo.id)}
                className="flex items-center gap-4 cursor-pointer flex-1"
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400'}`}
                >
                  {todo.completed && <FaCheck size={14} />}
                </div>
                <span className={`text-base sm:text-lg
                  ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.title}
                </span>
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => editTodo(todo)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => removeTodo(todo.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))}

          {filteredTodos.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-xl">Hozircha vazifa yo‘q 😴</p>
              <p className="text-sm">Yangi vazifa qo‘shing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
