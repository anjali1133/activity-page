import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { fetchActivities } from '../data/activities';

const DEFAULT_API_BASE =
  Platform.OS === 'web' ? 'http://localhost:4000' : 'http://localhost:4000';
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE;

export const useActivities = ({ token, enabled = true } = {}) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!enabled) {
          setLoading(false);
          return;
        }
        const response = await fetch(`${API_BASE}/activities`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const json = await response.json();
        if (!cancelled) {
          setActivities(json.data ?? []);
        }
      } catch (err) {
        // fallback to local mock if API unavailable
        try {
          const local = await fetchActivities();
          if (!cancelled) {
            setActivities(local);
          }
        } catch (inner) {
          if (!cancelled) {
            setError(err || inner);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [enabled, token, reloadKey]);

  const refresh = () => setReloadKey((key) => key + 1);

  return { activities, loading, error, refresh };
};
