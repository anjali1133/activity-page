import { applyActivityFilters } from '../src/utils/filters';

const mock = [
  { id: '1', title: 'A', type: 'quiz', status: 'not_started', dueDate: '2025-12-20T00:00:00Z', startAt: '2025-12-01T00:00:00Z' },
  { id: '2', title: 'B', type: 'assignment', status: 'in_progress', dueDate: '2025-12-15T00:00:00Z', startAt: '2025-12-05T00:00:00Z' },
  { id: '3', title: 'Cloud', type: 'online_class', status: 'graded', dueDate: null, startAt: '2025-12-07T00:00:00Z', instructor: 'Alex' },
];

describe('applyActivityFilters', () => {
  it('filters by type and status', () => {
    const result = applyActivityFilters(mock, {
      search: '',
      type: 'assignment',
      status: 'in_progress',
      sort: 'soonest',
      showDueSoon: false,
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('applies search across title and instructor', () => {
    const result = applyActivityFilters(mock, {
      search: 'cloud',
      type: 'all',
      status: 'all',
      sort: 'soonest',
      showDueSoon: false,
    });
    expect(result.map((item) => item.id)).toEqual(['3']);
  });

  it('filters by due soon and sorts by due date', () => {
    const result = applyActivityFilters(mock, {
      search: '',
      type: 'all',
      status: 'all',
      sort: 'soonest',
      showDueSoon: true,
    });
    expect(result.every((item) => item.dueDate)).toBe(true);
    expect(result[0].id).toBe('2');
  });
});
