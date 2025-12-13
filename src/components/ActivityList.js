import { FlatList, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import ActivityCard from './ActivityCard';

const noop = () => {};

const EmptyState = () => (
  <View style={styles.empty}>
    <Text variant="titleMedium">No activities match your filters.</Text>
    <Text variant="bodyMedium" style={styles.emptySub}>
      Try clearing filters or checking back later.
    </Text>
  </View>
);

const ActivityList = ({
  activities,
  onPrimaryAction = noop,
  onViewDetails = noop,
  numColumns = 1,
}) => {
  const remainder = activities.length % numColumns;
  const paddingItems =
    remainder === 0 ? [] : Array.from({ length: numColumns - remainder }, (_, idx) => ({
      id: `placeholder-${idx}`,
      __empty: true,
    }));
  const data = [...activities, ...paddingItems];

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      renderItem={({ item }) =>
        item.__empty ? (
          <View style={styles.placeholder} />
        ) : (
          <ActivityCard
            activity={item}
            onPrimaryAction={onPrimaryAction}
            onViewDetails={onViewDetails}
          />
        )
      }
      ListEmptyComponent={<EmptyState />}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: 32,
    paddingHorizontal: 12,
    width: '100%',
    alignSelf: 'stretch',
  },
  row: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 12,
  },
  empty: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 6,
  },
  emptySub: {
    color: '#607D8B',
  },
  placeholder: {
    flex: 1,
    marginVertical: 6,
  },
});

export default ActivityList;
