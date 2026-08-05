import { renderHook, act } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useTasks } from '../useTasks';
import type { Task } from '../../types';

afterEach(() => {
  localStorage.clear();
});

describe('useTasks', () => {
  describe('initial state', () => {
    it('starts with an empty task list when localStorage is empty', () => {
      const { result } = renderHook(() => useTasks());
      expect(result.current.tasks).toEqual([]);
    });

    it('hydrates tasks from localStorage on mount', () => {
      const saved: Task[] = [
        { id: 'abc', title: 'Existing task', completed: false, createdAt: 1000 },
      ];
      localStorage.setItem('tasks', JSON.stringify(saved));
      const { result } = renderHook(() => useTasks());
      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].title).toBe('Existing task');
    });
  });

  describe('addTask', () => {
    it('creates a task with the given title', () => {
      const { result } = renderHook(() => useTasks());
      act(() => {
        result.current.addTask('Buy milk');
      });
      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].title).toBe('Buy milk');
    });

    it('trims whitespace from the title', () => {
      const { result } = renderHook(() => useTasks());
      act(() => {
        result.current.addTask('  Trimmed title  ');
      });
      expect(result.current.tasks[0].title).toBe('Trimmed title');
    });

    it('creates the task with completed: false', () => {
      const { result } = renderHook(() => useTasks());
      act(() => {
        result.current.addTask('New task');
      });
      expect(result.current.tasks[0].completed).toBe(false);
    });

    it('assigns a unique string id', () => {
      const { result } = renderHook(() => useTasks());
      act(() => {
        result.current.addTask('Task A');
        result.current.addTask('Task B');
      });
      const [a, b] = result.current.tasks;
      expect(typeof a.id).toBe('string');
      expect(a.id).not.toBe(b.id);
    });

    it('sets createdAt as a number (timestamp)', () => {
      const before = Date.now();
      const { result } = renderHook(() => useTasks());
      act(() => {
        result.current.addTask('Timed task');
      });
      const after = Date.now();
      const { createdAt } = result.current.tasks[0];
      expect(typeof createdAt).toBe('number');
      expect(createdAt).toBeGreaterThanOrEqual(before);
      expect(createdAt).toBeLessThanOrEqual(after);
    });

    it('appends multiple tasks in order', () => {
      const { result } = renderHook(() => useTasks());
      act(() => {
        result.current.addTask('First');
        result.current.addTask('Second');
        result.current.addTask('Third');
      });
      expect(result.current.tasks.map((t) => t.title)).toEqual(['First', 'Second', 'Third']);
    });
  });

  describe('toggleTask', () => {
    it('flips completed from false to true', () => {
      const { result } = renderHook(() => useTasks());
      act(() => { result.current.addTask('Toggle me'); });
      const id = result.current.tasks[0].id;
      act(() => { result.current.toggleTask(id); });
      expect(result.current.tasks[0].completed).toBe(true);
    });

    it('flips completed from true back to false', () => {
      const { result } = renderHook(() => useTasks());
      act(() => { result.current.addTask('Toggle me'); });
      const id = result.current.tasks[0].id;
      act(() => { result.current.toggleTask(id); }); // → true
      act(() => { result.current.toggleTask(id); }); // → false
      expect(result.current.tasks[0].completed).toBe(false);
    });

    it('only toggles the targeted task, leaving others unchanged', () => {
      const { result } = renderHook(() => useTasks());
      act(() => {
        result.current.addTask('Task A');
        result.current.addTask('Task B');
      });
      const idA = result.current.tasks[0].id;
      act(() => { result.current.toggleTask(idA); });
      expect(result.current.tasks[0].completed).toBe(true);
      expect(result.current.tasks[1].completed).toBe(false);
    });

    it('does nothing when the id does not exist', () => {
      const { result } = renderHook(() => useTasks());
      act(() => { result.current.addTask('Safe task'); });
      act(() => { result.current.toggleTask('nonexistent-id'); });
      expect(result.current.tasks[0].completed).toBe(false);
    });
  });

  describe('deleteTask', () => {
    it('removes the task with the given id', () => {
      const { result } = renderHook(() => useTasks());
      act(() => { result.current.addTask('To delete'); });
      const id = result.current.tasks[0].id;
      act(() => { result.current.deleteTask(id); });
      expect(result.current.tasks).toHaveLength(0);
    });

    it('only removes the targeted task', () => {
      const { result } = renderHook(() => useTasks());
      act(() => {
        result.current.addTask('Keep');
        result.current.addTask('Delete me');
      });
      const idToDelete = result.current.tasks[1].id;
      act(() => { result.current.deleteTask(idToDelete); });
      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].title).toBe('Keep');
    });

    it('is a no-op when the id does not exist', () => {
      const { result } = renderHook(() => useTasks());
      act(() => { result.current.addTask('Stays'); });
      act(() => { result.current.deleteTask('ghost-id'); });
      expect(result.current.tasks).toHaveLength(1);
    });

    it('handles deleting from an already empty list without throwing', () => {
      const { result } = renderHook(() => useTasks());
      expect(() => {
        act(() => { result.current.deleteTask('any-id'); });
      }).not.toThrow();
      expect(result.current.tasks).toHaveLength(0);
    });
  });

  describe('editTask', () => {
    it('updates the title of the targeted task', () => {
      const { result } = renderHook(() => useTasks());
      act(() => { result.current.addTask('Old title'); });
      const id = result.current.tasks[0].id;
      act(() => { result.current.editTask(id, 'New title'); });
      expect(result.current.tasks[0].title).toBe('New title');
    });

    it('trims whitespace from the updated title', () => {
      const { result } = renderHook(() => useTasks());
      act(() => { result.current.addTask('Original'); });
      const id = result.current.tasks[0].id;
      act(() => { result.current.editTask(id, '  Padded  '); });
      expect(result.current.tasks[0].title).toBe('Padded');
    });

    it('does not change the completed status when editing', () => {
      const { result } = renderHook(() => useTasks());
      act(() => { result.current.addTask('Task'); });
      const id = result.current.tasks[0].id;
      act(() => { result.current.toggleTask(id); }); // completed → true
      act(() => { result.current.editTask(id, 'Renamed'); });
      expect(result.current.tasks[0].completed).toBe(true);
      expect(result.current.tasks[0].title).toBe('Renamed');
    });

    it('only edits the targeted task, leaving others unchanged', () => {
      const { result } = renderHook(() => useTasks());
      act(() => {
        result.current.addTask('Task A');
        result.current.addTask('Task B');
      });
      const idA = result.current.tasks[0].id;
      act(() => { result.current.editTask(idA, 'Task A Updated'); });
      expect(result.current.tasks[0].title).toBe('Task A Updated');
      expect(result.current.tasks[1].title).toBe('Task B');
    });

    it('is a no-op when the id does not exist', () => {
      const { result } = renderHook(() => useTasks());
      act(() => { result.current.addTask('Unchanged'); });
      act(() => { result.current.editTask('ghost-id', 'Should not apply'); });
      expect(result.current.tasks[0].title).toBe('Unchanged');
    });
  });
});
