import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import ActivityCard from '../src/components/ActivityCard';

const activity = {
  id: 'test',
  title: 'Quiz: Intro to AI',
  type: 'quiz',
  status: 'in_progress',
  dueDate: '2025-12-15T00:00:00Z',
  durationMinutes: 30,
  instructor: 'Dr. Smith',
  program: 'AI Foundations',
  progress: 50,
};

describe('ActivityCard', () => {
  it('renders core details and action', () => {
    render(
      <PaperProvider settings={{ icon: (props) => <Text>{props?.source}</Text> }}>
        <ActivityCard activity={activity} />
      </PaperProvider>
    );

    expect(screen.getByText('Quiz: Intro to AI')).toBeTruthy();
    expect(screen.getByText(/AI Foundations/)).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();
  });
});
