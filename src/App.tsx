import { useState } from 'react'
import { useTasks } from './hooks/useTasks'
import { AddTaskForm } from './components/AddTaskForm'
import { TaskFilter } from './components/TaskFilter'
import type { FilterValue } from './components/TaskFilter'
import { TaskList } from './components/TaskList'
import './App.css'

function App() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks()
  const [filter, setFilter] = useState<FilterValue>('all')

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'todo') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  return (
    <main id="app">
      <h1>Todo</h1>
      <AddTaskForm onAdd={addTask} />
      <TaskFilter current={filter} onChange={setFilter} />
      <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={deleteTask} />
    </main>
  )
}

export default App
