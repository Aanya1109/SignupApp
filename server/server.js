require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const requireDatabase = require('./middleware/requireDatabase');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

if (!MONGODB_URI || MONGODB_URI === 'your_mongodb_connection_string') {
  console.error('MONGODB_URI is missing. Create server/.env from server/.env.example and set it.');
  process.exit(1);
}

const app = express();

app.use(helmet());                          // sets safer HTTP headers
app.use(cors({ origin: CLIENT_ORIGIN }));   // only our React app may call the API from a browser
app.use(express.json({ limit: '10kb' }));   // parse JSON bodies, reject huge ones

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use('/api/auth', requireDatabase, authRoutes);

// Unknown route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// Central error handler: never leaks stack traces or database details.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body must be valid JSON.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request body is too large.' });
  }
  console.error('Unexpected error:', err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('Connected to MongoDB.');
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    console.error('Check MONGODB_URI, your password, and the Atlas "Network Access" IP list.');
    process.exit(1);
  }

  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

start();
