import { useState } from 'react'
import styles from './AddTaskForm.module.css'

interface AddTaskFormProps {
  onAdd: (title: string) => void
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [value, setValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Add task form">
      <label htmlFor="new-task-input" className={styles.srOnly}>
        New task title
      </label>
      <input
        id="new-task-input"
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a new task…"
        aria-required="true"
      />
      <button
        type="submit"
        className={styles.submitBtn}
        disabled={!value.trim()}
      >
        Add
      </button>
    </form>
  )
}
