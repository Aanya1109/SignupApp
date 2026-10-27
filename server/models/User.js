const mongoose = require('mongoose');

// Same rule the frontend uses (kept simple on purpose).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,        // creates a unique index in MongoDB
      lowercase: true,     // "Student@Mail.com" is saved as "student@mail.com"
      trim: true,
      maxlength: [254, 'Email is too long.'],
      match: [EMAIL_PATTERN, 'Please enter a valid email address.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      select: false,       // never returned by queries unless asked for explicitly
    },
  },
  { timestamps: true }     // adds createdAt and updatedAt automatically
);

// Safety net: even if a user document is sent as JSON, the hash is removed.
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
