import { StyleSheet, View } from 'react-native';
import { Button, Chip, IconButton, Searchbar, SegmentedButtons, Switch, Text } from 'react-native-paper';
import { typeLabels } from '../utils/metadata';
import { palette } from '../theme';

const typeOptions = [
  { label: 'All', value: 'all' },
  { label: typeLabels.online_class, value: 'online_class' },
  { label: typeLabels.assignment, value: 'assignment' },
  { label: typeLabels.quiz, value: 'quiz' },
  { label: typeLabels.discussion, value: 'discussion' },
];

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Not started', value: 'not_started' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Graded', value: 'graded' },
];

const sortOptions = [
  { value: 'soonest', label: 'Due soon' },
  { value: 'recent', label: 'Recently added' },
  { value: 'alphabetical', label: 'A → Z' },
];

const Filters = ({ filters, onChange, onRefresh, disabled }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Searchbar
          placeholder="Search title, instructor, program"
          value={filters.search}
          onChangeText={(text) => onChange('search', text)}
          autoCapitalize="none"
          style={styles.search}
          testID="search-input"
        />
        <IconButton
          icon="refresh"
          accessibilityLabel="Refresh"
          onPress={onRefresh}
          disabled={disabled}
        />
      </View>

      <View style={styles.section}>
        <Text variant="labelMedium" style={styles.label}>
          Type
        </Text>
        <View style={styles.chips}>
          {typeOptions.map((option) => (
            <Chip
              key={option.value}
              selected={filters.type === option.value}
              onPress={() => onChange('type', option.value)}
              compact
            >
              {option.label}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="labelMedium" style={styles.label}>
          Status
        </Text>
        <View style={styles.chips}>
          {statusOptions.map((option) => (
            <Chip
              key={option.value}
              selected={filters.status === option.value}
              onPress={() => onChange('status', option.value)}
              compact
            >
              {option.label}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="labelMedium" style={styles.label}>
          Sort
        </Text>
        <SegmentedButtons
          value={filters.sort}
          onValueChange={(value) => onChange('sort', value)}
          buttons={sortOptions}
        />
      </View>

      <View style={styles.section}>
        <Text variant="labelMedium" style={styles.label}>
          Quick filters
        </Text>
        <View style={styles.quickRow}>
          <View style={styles.switchRow}>
            <Switch
              value={filters.showDueSoon}
              onValueChange={(value) => onChange('showDueSoon', value)}
              testID="due-soon-switch"
            />
            <Text variant="bodyMedium">Due soon (next 5 days)</Text>
          </View>
          <Button mode="text" onPress={() => onChange('status', 'all')}>
            Clear status
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
    backgroundColor: palette.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: palette.border,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  search: {
    flex: 1,
  },
  section: {
    gap: 8,
  },
  label: {
    color: palette.muted,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingRight: 6,
  },
  quickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default Filters;
