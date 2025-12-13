import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, View, StyleSheet, ScrollView, Animated, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Divider,
  IconButton,
  Modal,
  MD3LightTheme,
  PaperProvider,
  Portal,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import ActivityList from './src/components/ActivityList';
import Filters from './src/components/Filters';
import Login from './src/components/Login';
import { API_BASE, useActivities } from './src/hooks/useActivities';
import { actionLabelForStatus, applyActivityFilters } from './src/utils/filters';
import { darkTheme, lightTheme, palette } from './src/theme';

const initialFilters = {
  search: '',
  type: 'all',
  status: 'all',
  sort: 'soonest',
  showDueSoon: false,
};

const isDefaultFilters = (value) =>
  value.search === initialFilters.search &&
  value.type === initialFilters.type &&
  value.status === initialFilters.status &&
  value.sort === initialFilters.sort &&
  value.showDueSoon === initialFilters.showDueSoon;

export default function App() {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState(systemScheme ?? 'light');
  const theme = useMemo(
    () =>
      themeMode === 'dark'
        ? { ...MD3DarkTheme, ...darkTheme }
        : { ...MD3LightTheme, ...lightTheme },
    [themeMode]
  );
  const [filters, setFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [auth, setAuth] = useState({ token: null, user: null });
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { activities, loading, refresh, error } = useActivities({
    token: auth.token,
    enabled: Boolean(auth.token),
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  const [detail, setDetail] = useState(null);
  const numColumns = 3;

  const filteredActivities = applyActivityFilters(activities, filters);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, activities.length]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, { toValue: 1, duration: 5000, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 0, duration: 5000, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bgAnim]);

  const handleFilterChange = (key, value) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrimaryAction = (activity) => {
    setDetail({ activity, mode: 'primary' });
  };

  const handleViewDetails = (activity) => {
    setDetail({ activity, mode: 'details' });
  };

  const handleLogin = async ({ email, password }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      const data = await response.json();
      setAuth({ token: data.token, user: data.user });
    } catch (err) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async ({ email, password, name }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Signup failed');
      }
      const data = await response.json();
      setAuth({ token: data.token, user: data.user });
    } catch (err) {
      setAuthError(err.message || 'Signup failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setAuth({ token: null, user: null });
    setFilters(initialFilters);
    setAuthMode('login');
  };

  const handleApplyFilters = () => {
    setFilters(draftFilters);
    setFiltersOpen(false);
  };

  const handleOpenFilters = () => {
    setDraftFilters(filters);
    setFiltersOpen(true);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setDraftFilters(initialFilters);
    refresh();
  };

  const backgroundInterpolated = {
    backgroundColor: bgAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [palette.background, '#e8efff'],
    }),
  };

  if (!auth.token) {
    return (
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.safeArea}>
            <Login
              onSubmit={authMode === 'login' ? handleLogin : handleSignup}
              loading={authLoading}
              error={authError}
              mode={authMode}
              onModeChange={setAuthMode}
            />
          </SafeAreaView>
        </SafeAreaProvider>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={[styles.safeArea]}>
          <Animated.View style={[styles.animatedBg, backgroundInterpolated]} />
          <Portal>
            <Modal
              visible={filtersOpen}
              onDismiss={() => setFiltersOpen(false)}
              contentContainerStyle={styles.drawerContainer}
            >
              <Surface style={styles.drawerSurface} elevation={4}>
                <View style={styles.drawerHeader}>
                  <Text variant="titleMedium">Filters</Text>
                  <IconButton
                    icon="close"
                    accessibilityLabel="Close filters"
                    onPress={() => setFiltersOpen(false)}
                  />
                </View>
                <Filters
                  filters={draftFilters}
                  onChange={handleFilterChange}
                  onRefresh={refresh}
                  disabled={loading}
                />
                <View style={styles.drawerFooter}>
                  <Button mode="contained" icon="check" onPress={handleApplyFilters}>
                    Apply filters
                  </Button>
                </View>
              </Surface>
            </Modal>
            <Modal
              visible={!!detail}
              onDismiss={() => setDetail(null)}
              contentContainerStyle={styles.detailContainer}
            >
              {detail?.activity ? (
                <Surface style={styles.detailCard} elevation={4}>
                  <Text variant="titleMedium" style={styles.detailTitle}>
                    {detail.activity.title}
                  </Text>
                  <Text variant="bodyMedium" style={styles.detailBody}>
                    {detail.mode === 'primary'
                      ? detail.activity.status === 'graded'
                        ? 'View certificate and completion summary.'
                        : detail.activity.status === 'submitted'
                        ? 'Review submission status and feedback.'
                        : 'Start or continue the session and see course details.'
                      : 'Course details, instructor info, and next steps.'}
                  </Text>
                  <Button mode="contained" onPress={() => setDetail(null)}>
                    Close
                  </Button>
                </Surface>
              ) : null}
            </Modal>
          </Portal>

          <Header
            user={auth.user}
            onLogout={handleLogout}
            onOpenFilters={handleOpenFilters}
            onToggleTheme={() =>
              setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
            }
            themeMode={themeMode}
          />
          <ScrollView contentContainerStyle={styles.page}>
            <Animated.View
              style={[
                styles.pageInner,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [12, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.toolbar}>
                <Button
                  mode="text"
                  icon="filter-variant"
                  onPress={handleOpenFilters}
                >
                  Filters
                </Button>
                {!isDefaultFilters(filters) && (
                  <Button
                    mode="text"
                    icon="close"
                    onPress={handleClearFilters}
                    disabled={loading}
                  >
                    Clear filters
                  </Button>
                )}
                <Button mode="text" icon="refresh" onPress={refresh} disabled={loading}>
                  Refresh
                </Button>
              </View>
              <Divider />
              {error ? (
                <ErrorState onRetry={refresh} />
              ) : loading ? (
                <LoadingState />
              ) : (
                <ActivityList
                  activities={filteredActivities}
                  onPrimaryAction={handlePrimaryAction}
                  onViewDetails={handleViewDetails}
                  numColumns={numColumns}
                />
              )}
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

function Header({ user, onLogout, onOpenFilters, onToggleTheme, themeMode }) {
  const theme = useTheme();
  return (
    <Appbar.Header mode="center-aligned" style={{ backgroundColor: 'sky blue', elevation: 0 }}>
      <Appbar.Content
        title="Activities"
        subtitle={user ? `Welcome, ${user.name}` : 'Find, start, or review quickly'}
      />
      <Appbar.Action
        icon={themeMode === 'dark' ? 'weather-sunny' : 'weather-night'}
        accessibilityLabel="Toggle theme"
        onPress={onToggleTheme}
        color={theme.colors.primary}
      />
      <Appbar.Action
        icon="logout"
        accessibilityLabel="Log out"
        onPress={onLogout}
        color={theme.colors.primary}
      />
    </Appbar.Header>
  );
}

function LoadingState() {
  const theme = useTheme();
  return (
    <View style={styles.loader}>
      <ActivityIndicator animating color={theme.colors.primary} size="large" />
      <Text variant="bodyMedium" style={styles.loaderText}>
        Loading activities...
      </Text>
    </View>
  );
}

function ErrorState({ onRetry }) {
  const theme = useTheme();
  return (
    <View style={styles.error}>
      <Text variant="titleMedium" style={styles.errorTitle}>
        Unable to load activities
      </Text>
      <Text variant="bodyMedium" style={styles.errorBody}>
        Check your connection and try again.
      </Text>
      <Button mode="contained" onPress={onRetry} icon="refresh" style={styles.retry}>
        Retry
      </Button>
      <Text variant="bodySmall" style={[styles.helper, { color: theme.colors.outline }]}>
        Data is mocked locally; hook this up to your API when ready.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  animatedBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  page: {
    padding: 16,
    gap: 16,
    flexGrow: 1,
    backgroundColor: palette.background,
    alignItems: 'stretch',
  },
  pageInner: {
    width: '100%',
    gap: 16,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  loader: {
    marginTop: 48,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
  },
  error: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  errorTitle: {
    textAlign: 'center',
    fontWeight: '600',
  },
  errorBody: {
    textAlign: 'center',
  },
  retry: {
    marginTop: 8,
  },
  helper: {
    textAlign: 'center',
  },
  drawerContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  drawerSurface: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    width: '100%',
    maxWidth: 960,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  drawerFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detailContainer: {
    padding: 16,
    alignItems: 'center',
  },
  detailCard: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
    width: '100%',
    maxWidth: 720,
  },
  detailTitle: {
    fontWeight: '700',
  },
  detailBody: {
    color: palette.muted,
    marginBottom: 8,
  },
});
