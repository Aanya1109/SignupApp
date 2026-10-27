const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');

const router = express.Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 10;

// bcrypt only uses the first 72 bytes of a password, so we reject longer ones.
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_BYTES = 72;

// A throw-away hash. Used so a login for an unknown email takes about as long
// as a login for a known email (makes it harder to discover which emails exist).
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', SALT_ROUNDS);

// Allow at most 30 attempts per 15 minutes per IP on these routes.
router.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts. Please wait a few minutes and try again.' },
  })
);

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// Returns an object of field errors. Empty object = input is valid.
function validateSignup({ email, password }) {
  const errors = {};

  if (typeof email !== 'string' || email.trim() === '') {
    errors.email = 'Email is required.';
  } else if (email.trim().length > 254 || !EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (typeof password !== 'string' || password === '') {
    errors.password = 'Password is required.';
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  } else if (Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES) {
    errors.password = 'Password is too long (maximum 72 bytes).';
  }

  return errors;
}

function validateLogin({ email, password }) {
  const errors = {};
  if (typeof email !== 'string' || email.trim() === '') {
    errors.email = 'Email is required.';
  }
  if (typeof password !== 'string' || password === '') {
    errors.password = 'Password is required.';
  }
  return errors;
}

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = validateSignup(body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Please fix the highlighted fields.', errors });
    }

    const email = normalizeEmail(body.email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS); // password is NOT trimmed
    const user = await User.create({ email, password: passwordHash });

    return res.status(201).json({
      message: 'Account created successfully.',
      user: { id: user._id, email: user.email, createdAt: user.createdAt },
    });
  } catch (err) {
    // 11000 = duplicate key. Happens if two requests register the same email at once.
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid input.' });
    }
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = validateLogin(body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Please fix the highlighted fields.', errors });
    }

    const email = normalizeEmail(body.email);
    const user = await User.findOne({ email }).select('+password');

    // Always run a bcrypt comparison, then give one generic error for both cases.
    const hashToCheck = user ? user.password : DUMMY_HASH;
    const passwordMatches = await bcrypt.compare(body.password, hashToCheck);

    if (!user || !passwordMatches) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    // DEMO login: no session or token is created (see README, "Security limitations").
    return res.status(200).json({
      message: 'Login successful.',
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
