// Client-side validation is only for convenience. The server checks everything again.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  const value = email.trim();
  if (!value) return 'Email is required.';
  if (!EMAIL_PATTERN.test(value)) return 'Please enter a valid email address.';
  return '';
}

// Passwords are never trimmed or changed.
export function validateNewPassword(password) {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return '';
}

export function validateExistingPassword(password) {
  return password ? '' : 'Password is required.';
}
