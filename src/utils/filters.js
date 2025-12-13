import { addDays, compareAsc, parseISO, isValid } from 'date-fns';
import { typeLabels } from './metadata';

const DUE_SOON_DAYS = 5;

const normalize = (value = '') => value.toLowerCase();

const safeDate = (value) => {
  if (!value) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
};

const sorters = {
  soonest: (a, b) => {
    const aDate = safeDate(a.dueDate);
    const bDate = safeDate(b.dueDate);
    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return compareAsc(aDate, bDate);
  },
  recent: (a, b) => {
    const aDate = safeDate(a.startAt);
    const bDate = safeDate(b.startAt);
    if (!aDate || !bDate) return 0;
    return compareAsc(bDate, aDate);
  },
  alphabetical: (a, b) => a.title.localeCompare(b.title),
};

export const applyActivityFilters = (list, filters) => {
  const { search, type, status, sort, showDueSoon } = filters;
  const today = new Date();
  const query = normalize(search);

  let next = [...list];

  if (query) {
    next = next.filter((item) =>
      [item.title, item.program, item.instructor]
        .filter(Boolean)
        .some((field) => normalize(field).includes(query))
    );
  }

  if (type !== 'all') {
    next = next.filter((item) => item.type === type);
  }

  if (status !== 'all') {
    next = next.filter((item) => item.status === status);
  }

  if (showDueSoon) {
    next = next.filter((item) => {
      const due = safeDate(item.dueDate);
      if (!due) return false;
      const soon = addDays(today, DUE_SOON_DAYS);
      return due >= today && due <= soon;
    });
  }

  const sorter = sorters[sort] ?? sorters.soonest;
  next.sort(sorter);
  return next;
};

export const statusMeta = {
  not_started: { label: 'Not started', color: '#1d4ed8' },
  in_progress: { label: 'In progress', color: '#2563eb' },
  submitted: { label: 'Submitted', color: '#0ea5e9' },
  graded: { label: 'Graded', color: '#1d4ed8' },
};

export const actionLabelForStatus = (status) => {
  switch (status) {
    case 'in_progress':
      return 'Continue';
    case 'submitted':
    case 'graded':
      return 'Review';
    default:
      return 'Start';
  }
};

export const badgeForType = (type) => typeLabels[type] ?? 'Activity';

export const formatDateForDisplay = (value) => {
  const parsed = safeDate(value);
  if (!parsed) return 'No due date';
  return parsed.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};
