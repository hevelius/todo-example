import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AddTaskForm } from '../AddTaskForm'

describe('AddTaskForm', () => {
  it('renders a text input', () => {
    render(<AddTaskForm onAdd={vi.fn()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders an Add button', () => {
    render(<AddTaskForm onAdd={vi.fn()} />)
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
  })

  it('Add button is disabled when input is empty', () => {
    render(<AddTaskForm onAdd={vi.fn()} />)
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
  })

  it('Add button is disabled when input contains only whitespace', async () => {
    render(<AddTaskForm onAdd={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox'), '   ')
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
  })

  it('Add button becomes enabled when input has non-whitespace text', async () => {
    render(<AddTaskForm onAdd={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox'), 'Hello')
    expect(screen.getByRole('button', { name: /add/i })).toBeEnabled()
  })

  it('calls onAdd with the trimmed input value on submit', async () => {
    const onAdd = vi.fn()
    render(<AddTaskForm onAdd={onAdd} />)
    await userEvent.type(screen.getByRole('textbox'), '  Buy milk  ')
    await userEvent.click(screen.getByRole('button', { name: /add/i }))
    expect(onAdd).toHaveBeenCalledOnce()
    expect(onAdd).toHaveBeenCalledWith('Buy milk')
  })

  it('clears the input after a successful submit', async () => {
    render(<AddTaskForm onAdd={vi.fn()} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'New task')
    await userEvent.click(screen.getByRole('button', { name: /add/i }))
    expect(input).toHaveValue('')
  })

  it('does not call onAdd when input is empty and form is submitted via Enter', async () => {
    const onAdd = vi.fn()
    render(<AddTaskForm onAdd={onAdd} />)
    await userEvent.click(screen.getByRole('textbox'))
    await userEvent.keyboard('{Enter}')
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('does not call onAdd for whitespace-only input submitted via Enter', async () => {
    const onAdd = vi.fn()
    render(<AddTaskForm onAdd={onAdd} />)
    await userEvent.type(screen.getByRole('textbox'), '   ')
    await userEvent.keyboard('{Enter}')
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('calls onAdd and clears input when form is submitted via Enter key', async () => {
    const onAdd = vi.fn()
    render(<AddTaskForm onAdd={onAdd} />)
    await userEvent.type(screen.getByRole('textbox'), 'Walk the dog')
    await userEvent.keyboard('{Enter}')
    expect(onAdd).toHaveBeenCalledWith('Walk the dog')
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('input updates as user types', async () => {
    render(<AddTaskForm onAdd={vi.fn()} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Hello world')
    expect(input).toHaveValue('Hello world')
  })

  it('Add button becomes disabled again after form is submitted', async () => {
    render(<AddTaskForm onAdd={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox'), 'Task')
    await userEvent.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
  })

  it('can submit multiple tasks sequentially', async () => {
    const onAdd = vi.fn()
    render(<AddTaskForm onAdd={onAdd} />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /add/i })

    await userEvent.type(input, 'First')
    await userEvent.click(button)
    await userEvent.type(input, 'Second')
    await userEvent.click(button)

    expect(onAdd).toHaveBeenCalledTimes(2)
    expect(onAdd).toHaveBeenNthCalledWith(1, 'First')
    expect(onAdd).toHaveBeenNthCalledWith(2, 'Second')
  })
})
