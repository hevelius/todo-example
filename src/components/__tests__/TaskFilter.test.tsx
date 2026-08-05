import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskFilter } from '../TaskFilter'
import type { FilterValue } from '../TaskFilter'

describe('TaskFilter', () => {
  it('renders three buttons: All, To Do, Completed', () => {
    render(<TaskFilter current="all" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'To Do' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Completed' })).toBeInTheDocument()
  })

  it('renders a group wrapper with aria-label "Filter tasks"', () => {
    render(<TaskFilter current="all" onChange={vi.fn()} />)
    expect(screen.getByRole('group', { name: 'Filter tasks' })).toBeInTheDocument()
  })

  it('sets aria-pressed=true only on the "All" button when current is "all"', () => {
    render(<TaskFilter current="all" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'To Do' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Completed' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('sets aria-pressed=true only on the "To Do" button when current is "todo"', () => {
    render(<TaskFilter current="todo" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'To Do' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Completed' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('sets aria-pressed=true only on the "Completed" button when current is "completed"', () => {
    render(<TaskFilter current="completed" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'To Do' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Completed' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onChange with "all" when the All button is clicked', async () => {
    const onChange = vi.fn()
    render(<TaskFilter current="todo" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'All' }))
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('all')
  })

  it('calls onChange with "todo" when the To Do button is clicked', async () => {
    const onChange = vi.fn()
    render(<TaskFilter current="all" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'To Do' }))
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('todo')
  })

  it('calls onChange with "completed" when the Completed button is clicked', async () => {
    const onChange = vi.fn()
    render(<TaskFilter current="all" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Completed' }))
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('completed')
  })

  it('calls onChange when the already-active button is clicked again', async () => {
    const onChange = vi.fn()
    render(<TaskFilter current="all" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'All' }))
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('all')
  })

  it('does not call onChange for buttons that were not clicked', async () => {
    const onChange = vi.fn()
    render(<TaskFilter current="all" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'To Do' }))
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).not.toHaveBeenCalledWith('all')
    expect(onChange).not.toHaveBeenCalledWith('completed')
  })

  it('exports FilterValue type with correct values usable as props', () => {
    // Type-level check via valid prop assignments — if it compiles, it's correct
    const values: FilterValue[] = ['all', 'todo', 'completed']
    values.forEach((v) => {
      const { unmount } = render(<TaskFilter current={v} onChange={vi.fn()} />)
      const activeButton = screen.getAllByRole('button').find(
        (btn) => btn.getAttribute('aria-pressed') === 'true',
      )
      expect(activeButton).toBeInTheDocument()
      unmount()
    })
  })
})
