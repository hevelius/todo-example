import styles from './TaskFilter.module.css'

export type FilterValue = 'all' | 'todo' | 'completed'

interface TaskFilterProps {
  current: FilterValue
  onChange: (filter: FilterValue) => void
}

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'completed', label: 'Completed' },
]

export function TaskFilter({ current, onChange }: TaskFilterProps) {
  return (
    <div className={styles.wrapper} role="group" aria-label="Filter tasks">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={`${styles.button} ${current === value ? styles.active : ''}`}
          aria-pressed={current === value}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
