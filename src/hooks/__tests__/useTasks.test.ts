import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useTasks } from '../useTasks'

describe('useTasks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty task list', () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([]);
  });

  it('adds a task with a trimmed title', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask('  Buy milk  ');
    });
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Buy milk');
    expect(result.current.tasks[0].completed).toBe(false);
    expect(typeof result.current.tasks[0].id).toBe('string');
    expect(typeof result.current.tasks[0].createdAt).toBe('number');
  });

  it('does not add a task with an empty or whitespace-only title', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask('   ');
    });
    expect(result.current.tasks).toHaveLength(0);
  });

  it('toggles a task completed state', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask('Task A');
    });
    const id = result.current.tasks[0].id;
    act(() => {
      result.current.toggleTask(id);
    });
    expect(result.current.tasks[0].completed).toBe(true);
    act(() => {
      result.current.toggleTask(id);
    });
    expect(result.current.tasks[0].completed).toBe(false);
  });

  it('deletes a task by id', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask('To delete');
    });
    const id = result.current.tasks[0].id;
    act(() => {
      result.current.deleteTask(id);
    });
    expect(result.current.tasks).toHaveLength(0);
  });

  it('updates a task title', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask('Old title');
    });
    const id = result.current.tasks[0].id;
    act(() => {
      result.current.updateTask(id, 'New title');
    });
    expect(result.current.tasks[0].title).toBe('New title');
  });

  it('does not update a task to an empty title', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask('Keep this');
    });
    const id = result.current.tasks[0].id;
    act(() => {
      result.current.updateTask(id, '   ');
    });
    expect(result.current.tasks[0].title).toBe('Keep this');
  });

  it('persists tasks to localStorage', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask('Persistent task');
    });
    const stored = JSON.parse(localStorage.getItem('tasks')!);
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('Persistent task');
  });

  it('loads tasks from localStorage on mount', () => {
    const existing = [
      { id: 'abc', title: 'Preloaded', completed: false, createdAt: 1000 },
    ];
    localStorage.setItem('tasks', JSON.stringify(existing));
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Preloaded');
  });

  it('only affects the targeted task when toggling', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask('Task 1');
      result.current.addTask('Task 2');
    });
    const id = result.current.tasks[0].id;
    act(() => {
      result.current.toggleTask(id);
    });
    expect(result.current.tasks[0].completed).toBe(true);
    expect(result.current.tasks[1].completed).toBe(false);
  });
});
