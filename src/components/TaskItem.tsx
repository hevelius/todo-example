import type { Task } from '../types/task'
import styles from './TaskItem.module.css'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className={styles.item}>
      <label className={styles.label}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <span className={task.completed ? styles.titleCompleted : styles.title}>
          {task.title}
        </span>
      </label>
      <button
        type="button"
        className={styles.deleteBtn}
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task "${task.title}"`}
      >
        Delete
      </button>
    </li>
  )
}
