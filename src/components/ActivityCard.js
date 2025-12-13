import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Chip, ProgressBar, Text, useTheme } from 'react-native-paper';
import { actionLabelForStatus, formatDateForDisplay, statusMeta } from '../utils/filters';
import { typeLabels, typeIcons } from '../utils/metadata';
import { palette } from '../theme';

const ActivityCard = ({
  activity,
  onPrimaryAction = () => {},
  onViewDetails = () => {},
}) => {
  const actionLabel = actionLabelForStatus(activity.status);
  const status = statusMeta[activity.status];
  const theme = useTheme();

  return (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline,
          shadowColor: theme.colors.primary,
        },
      ]}
      mode="elevated"
    >
      <Card.Title
        title={activity.title}
        subtitle={`${typeLabels[activity.type] ?? 'Activity'} • ${activity.program}`}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon={typeIcons[activity.type] ?? 'calendar'}
            style={styles.avatar}
          />
        )}
        right={() => (
          <Chip
            compact
            mode="outlined"
            style={[
              styles.statusChip,
              {
                borderColor: status?.color ?? palette.primary,
                backgroundColor: theme.colors.surface,
              },
            ]}
            textStyle={[styles.statusText, { color: status?.color ?? palette.primary }]}
          >
            {status?.label ?? 'Status'}
          </Chip>
        )}
      />
      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <Text variant="bodyMedium">Instructor</Text>
          <Text variant="bodyMedium" style={styles.bold}>
            {activity.instructor}
          </Text>
        </View>
        <View style={styles.row}>
          <Text variant="bodyMedium">Due</Text>
          <Text variant="bodyMedium" style={styles.bold}>
            {formatDateForDisplay(activity.dueDate)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text variant="bodyMedium">Duration</Text>
          <Text variant="bodyMedium" style={styles.bold}>
            {activity.durationMinutes} mins
          </Text>
        </View>
        <View style={styles.progressRow}>
          <Text variant="bodyMedium">Progress</Text>
          <Text variant="bodyMedium" style={styles.bold}>
            {activity.progress}%
          </Text>
        </View>
        <ProgressBar progress={(activity.progress || 0) / 100} style={styles.progress} />
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button mode="contained" onPress={() => onPrimaryAction(activity)}>
          {actionLabel}
        </Button>
        <Button mode="text" onPress={() => onViewDetails(activity)}>
          View details
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    shadowColor: '#2563eb',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    borderRadius: 12,
    flex: 1,
    minWidth: 0,
    marginHorizontal: 6,
  },
  avatar: {
    backgroundColor: '#e0e7ff',
  },
  content: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progress: {
    marginTop: 4,
    marginBottom: 8,
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  bold: {
    fontWeight: '600',
  },
  statusChip: {
    alignSelf: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  statusText: {
    fontWeight: '600',
  },
});

export default ActivityCard;
