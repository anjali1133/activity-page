import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import ActivityList from '../src/components/ActivityList';

const mockActivities = [
  {
    id: '1',
    title: 'Alpha Quiz',
    type: 'quiz',
    status: 'not_started',
    dueDate: '2025-12-15T00:00:00Z',
    startAt: '2025-12-01T00:00:00Z',
    durationMinutes: 20,
    instructor: 'Dr. Nova',
    program: 'AI Foundations',
    progress: 0,
    tags: [],
  },
  {
    id: '2',
    title: 'Beta Assignment',
    type: 'assignment',
    status: 'graded',
    dueDate: null,
    startAt: '2025-11-01T00:00:00Z',
    durationMinutes: 40,
    instructor: 'Prof. Lin',
    program: 'Machine Learning',
    progress: 100,
    tags: [],
  },
];

const renderWithProvider = (ui) =>
  render(
    <PaperProvider settings={{ icon: (props) => <Text>{props.name}</Text> }}>
      {ui}
    </PaperProvider>
  );

describe('ActivityList', () => {
  it('renders activities and forwards action handlers', () => {
    const onPrimaryAction = jest.fn();
    const onViewDetails = jest.fn();

    renderWithProvider(
      <ActivityList
        activities={mockActivities}
        onPrimaryAction={onPrimaryAction}
        onViewDetails={onViewDetails}
      />
    );

    expect(screen.getByText('Alpha Quiz')).toBeTruthy();
    expect(screen.getByText('Beta Assignment')).toBeTruthy();

    fireEvent.press(screen.getByText('Start'));
    expect(onPrimaryAction).toHaveBeenCalledWith(mockActivities[0]);

    fireEvent.press(screen.getAllByText('View details')[0]);
    expect(onViewDetails).toHaveBeenCalledWith(mockActivities[0]);
  });

  it('shows empty state when there are no activities', () => {
    renderWithProvider(<ActivityList activities={[]} />);
    expect(screen.getByText('No activities match your filters.')).toBeTruthy();
  });
});

