import { useTasks } from './hooks/useTasks'
import { AddTaskForm } from './components/AddTaskForm'
import { TaskList } from './components/TaskList'
import './App.css'

function App() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks()

  return (
    <main id="app">
      <h1>Todo</h1>
      <AddTaskForm onAdd={addTask} />
      <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
    </main>
  )
}

export default App
