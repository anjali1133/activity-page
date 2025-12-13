import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Button, Surface, Text, TextInput } from 'react-native-paper';

const Login = ({ onSubmit, loading, error, mode = 'login', onModeChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [anim, mode]);

  const handleSubmit = () => {
    if (mode === 'signup') {
      if (!password || password.length < 8) {
        return onModeChange((prev) => prev); // no-op to keep state; we'll show inline error
      }
      const hasNumber = /\d/.test(password);
      const hasLetter = /[A-Za-z]/.test(password);
      if (!hasNumber || !hasLetter) {
        return onModeChange((prev) => prev);
      }
    }
    onSubmit({ email: email.trim(), password, name: name.trim() });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.98, 1],
              }),
            },
          ],
        }}
      >
        <Surface style={styles.card} elevation={4}>
        <Text variant="headlineSmall" style={styles.title}>
          {mode === 'login' ? 'Welcome back!' : 'Create your account'}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {mode === 'login'
            ? 'Sign in to see your activities.'
            : 'Sign up to start tracking your activities.'}
        </Text>

        {mode === 'signup' && (
          <TextInput
            label="Full name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            style={styles.input}
          />
        )}

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          style={styles.input}
        />

        {error ? (
          <Text variant="bodySmall" style={styles.error}>
            {error}
          </Text>
        ) : null}
        {mode === 'signup' && password.length > 0 && password.length < 8 ? (
          <Text variant="bodySmall" style={styles.error}>
            Password must be at least 8 characters and include letters and numbers.
          </Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          icon="login"
          style={styles.button}
        >
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </Button>
        <Text variant="bodySmall" style={styles.hint}>
          {mode === 'login' ? 'Need an account? ' : 'Already have an account? '}
          <Text
            style={styles.link}
            onPress={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </Text>
        </Text>
        </Surface>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f1f5f9',
  },
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
    gap: 10,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 4,
  },
  hint: {
    textAlign: 'center',
    marginTop: 6,
    color: '#64748b',
  },
  error: {
    color: '#b91c1c',
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
  },
});

export default Login;

