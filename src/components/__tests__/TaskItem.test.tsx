import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskItem } from '../TaskItem'
import type { Task } from '../../types/task'

const baseTask: Task = {
  id: 'task-1',
  title: 'Buy groceries',
  completed: false,
  createdAt: 1000000,
}

const completedTask: Task = { ...baseTask, completed: true }

describe('TaskItem', () => {
  it('renders the task title', () => {
    render(<TaskItem task={baseTask} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
  })

  it('renders an unchecked checkbox when task is not completed', () => {
    render(<TaskItem task={baseTask} onToggle={vi.fn()} onDelete={vi.fn()} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('renders a checked checkbox when task is completed', () => {
    render(<TaskItem task={completedTask} onToggle={vi.fn()} onDelete={vi.fn()} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('calls onToggle with the task id when checkbox is clicked', async () => {
    const onToggle = vi.fn()
    render(<TaskItem task={baseTask} onToggle={onToggle} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledOnce()
    expect(onToggle).toHaveBeenCalledWith('task-1')
  })

  it('renders a Delete button', () => {
    render(<TaskItem task={baseTask} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('calls onDelete with the task id when Delete button is clicked', async () => {
    const onDelete = vi.fn()
    render(<TaskItem task={baseTask} onToggle={vi.fn()} onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledOnce()
    expect(onDelete).toHaveBeenCalledWith('task-1')
  })

  it('checkbox aria-label reflects incomplete state', () => {
    render(<TaskItem task={baseTask} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(
      screen.getByLabelText(/mark "buy groceries" as complete/i),
    ).toBeInTheDocument()
  })

  it('checkbox aria-label reflects completed state', () => {
    render(<TaskItem task={completedTask} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(
      screen.getByLabelText(/mark "buy groceries" as incomplete/i),
    ).toBeInTheDocument()
  })

  it('does not call onDelete when checkbox is clicked', async () => {
    const onDelete = vi.fn()
    render(<TaskItem task={baseTask} onToggle={vi.fn()} onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('does not call onToggle when Delete button is clicked', async () => {
    const onToggle = vi.fn()
    render(<TaskItem task={baseTask} onToggle={onToggle} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onToggle).not.toHaveBeenCalled()
  })
})
