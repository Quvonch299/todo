'use client'
import React, { useState, useEffect } from 'react'
import { FaPlus, FaTrash, FaEdit, FaCheck, FaMoon, FaSun } from 'react-icons/fa'

export default function AllBox() {
  const [filter, setFilter] = useState('1')
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const [editId, setEditId] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  // Dark mode ni localStorage dan o'qish
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedMode)
  }, [])
useEffect(() => {
  const savedTodos = localStorage.getItem('todos')
  if (savedTodos) {
    setTodos(JSON.parse(savedTodos))
  }
}, [])
useEffect(() => {
  localStorage.setItem('todos', JSON.stringify(todos))
}, [todos])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const addTodo = () => {
    if (!text.trim()) return

    if (editId) {
      setTodos(todos.map(todo =>
        todo.id === editId ? { ...todo, title: text } : todo
      ))
      setEditId(null)
    } else {
      setTodos([
        { id: Date.now(), title: text, completed: false },
        ...todos,
      ])
    }
    setText('')
  }

  const removeTodo = (id) => setTodos(todos.filter(todo => todo.id !== id))

  const editTodo = (todo) => {
    setText(todo.title)
    setEditId(todo.id)
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === '2') return todo.completed
    if (filter === '3') return !todo.completed
    return true
  })

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-950' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-2xl mx-auto pt-12 pb-20 px-4 sm:px-6">
        {/* Header + Dark mode toggle */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Todo App
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:scale-110 transition-transform"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {[
            { id: '1', label: 'Barchasi' },
            { id: '2', label: 'Bajarilgan' },
            { id: '3', label: 'Bajarilmagan' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 shadow-sm
                ${filter === btn.id
                  ? 'bg-indigo-600 text-white shadow-indigo-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Input + Button */}
        <div className="flex gap-3 mb-10">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="Bugun nima qilmoqchisiz?"
            className="flex-1 px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 
                     text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
          />
          <button
            onClick={addTodo}
            className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl 
                     font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30"
          >
            <FaPlus />
            {editId ? 'Saqlash' : 'Qo‘shish'}
          </button>
        </div>

        {/* Todo list */}
        <div className="space-y-4">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`group flex items-center justify-between p-5 rounded-xl border border-gray-200 dark:border-gray-700 
                        bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200
                        ${todo.completed ? 'opacity-80' : ''}`}
            >
              <div
                onClick={() => toggleTodo(todo.id)}
                className="flex items-center gap-4 cursor-pointer flex-1"
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                  ${todo.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-400 dark:border-gray-500 group-hover:border-indigo-400'
                  }`}
                >
                  {todo.completed && <FaCheck className="w-4 h-4" />}
                </div>
                <span className={`text-lg ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                  {todo.title}
                </span>
              </div>

              <div className="flex items-center gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => editTodo(todo)}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => removeTodo(todo.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>
          ))}

          {filteredTodos.length === 0 && (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <p className="text-2xl mb-2">Hozircha vazifa yo‘q 😴</p>
              <p className="text-sm">Yangi vazifani yuqoridan qo‘shib boshlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}