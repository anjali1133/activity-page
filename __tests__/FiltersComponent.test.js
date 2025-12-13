import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import Filters from '../src/components/Filters';

const baseFilters = {
  search: '',
  type: 'all',
  status: 'all',
  sort: 'soonest',
  showDueSoon: false,
};

const renderWithProvider = (ui) =>
  render(
    <PaperProvider settings={{ icon: (props) => <Text>{props.name}</Text> }}>
      {ui}
    </PaperProvider>
  );

describe('Filters component', () => {
  it('calls onChange for search, status, and due soon', () => {
    const onChange = jest.fn();
    renderWithProvider(
      <Filters filters={baseFilters} onChange={onChange} onRefresh={() => {}} disabled={false} />
    );

    fireEvent.changeText(screen.getByTestId('search-input'), 'cloud');
    expect(onChange).toHaveBeenCalledWith('search', 'cloud');

    fireEvent.press(screen.getByText('In progress'));
    expect(onChange).toHaveBeenCalledWith('status', 'in_progress');

    fireEvent(screen.getByTestId('due-soon-switch'), 'valueChange', true);
    expect(onChange).toHaveBeenCalledWith('showDueSoon', true);
  });

  it('calls onRefresh when refresh icon is pressed', () => {
    const onRefresh = jest.fn();
    renderWithProvider(
      <Filters filters={baseFilters} onChange={() => {}} onRefresh={onRefresh} disabled={false} />
    );

    fireEvent.press(screen.getByLabelText('Refresh'));
    expect(onRefresh).toHaveBeenCalled();
  });
});

