const express = require('express');
const cors = require('cors');

const { activities } = require('../src/data/activities');

const app = express();
const PORT = process.env.PORT || 4000;

const users = [
  {
    email: 'admin@example.com',
    password: 'admin@123',
    name: 'Admin',
  },
];

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    return res.json({
      token: `mock-token-${user.email}`,
      user: { name: user.name, email: user.email },
    });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/signup', (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing email, password, or name' });
  }
  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ error: 'User already exists' });
  }
  const newUser = { email, password, name };
  users.push(newUser);
  return res.status(201).json({
    token: `mock-token-${newUser.email}`,
    user: { name: newUser.name, email: newUser.email },
  });
});

app.get('/activities', (_req, res) => {
  res.json({ data: activities });
});

app.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
});

