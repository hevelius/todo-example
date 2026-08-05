import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskList } from '../TaskList'
import type { Task } from '../../types/task'

const makeTasks = (...titles: string[]): Task[] =>
  titles.map((title, i) => ({
    id: `task-${i}`,
    title,
    completed: false,
    createdAt: i,
  }))

describe('TaskList', () => {
  it('shows an empty-state message when given an empty task array', () => {
    render(<TaskList tasks={[]} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
  })

  it('does not render a list element when tasks are empty', () => {
    render(<TaskList tasks={[]} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('renders one list item per task', () => {
    const tasks = makeTasks('Task A', 'Task B', 'Task C')
    render(<TaskList tasks={tasks} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('renders the title of each task', () => {
    const tasks = makeTasks('First task', 'Second task')
    render(<TaskList tasks={tasks} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('First task')).toBeInTheDocument()
    expect(screen.getByText('Second task')).toBeInTheDocument()
  })

  it('does not show the empty-state message when tasks exist', () => {
    const tasks = makeTasks('Something to do')
    render(<TaskList tasks={tasks} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument()
  })

  it('passes onToggle to each TaskItem', async () => {
    const onToggle = vi.fn()
    const tasks = makeTasks('Alpha', 'Beta')
    render(<TaskList tasks={tasks} onToggle={onToggle} onDelete={vi.fn()} />)
    const checkboxes = screen.getAllByRole('checkbox')
    await userEvent.click(checkboxes[0])
    expect(onToggle).toHaveBeenCalledOnce()
    expect(onToggle).toHaveBeenCalledWith('task-0')
  })

  it('passes onDelete to each TaskItem', async () => {
    const onDelete = vi.fn()
    const tasks = makeTasks('Alpha', 'Beta')
    render(<TaskList tasks={tasks} onToggle={vi.fn()} onDelete={onDelete} />)
    const list = screen.getByRole('list')
    const items = within(list).getAllByRole('listitem')
    const deleteBtn = within(items[1]).getByRole('button', { name: /delete/i })
    await userEvent.click(deleteBtn)
    expect(onDelete).toHaveBeenCalledOnce()
    expect(onDelete).toHaveBeenCalledWith('task-1')
  })

  it('renders completed tasks with checkbox checked', () => {
    const tasks: Task[] = [
      { id: 'c1', title: 'Done task', completed: true, createdAt: 0 },
    ]
    render(<TaskList tasks={tasks} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('renders a single task without error', () => {
    const tasks = makeTasks('Solo task')
    render(<TaskList tasks={tasks} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })
})
