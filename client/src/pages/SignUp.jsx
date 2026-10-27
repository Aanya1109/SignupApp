import { useState } from 'react';
import { Link } from 'react-router-dom';
import PasswordField from '../components/PasswordField.jsx';
import { signUp } from '../api.js';
import { validateEmail, validateNewPassword } from '../validation.js';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text }
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();          // stop the browser from reloading the page
    if (loading) return;             // ignore repeated submits

    const newErrors = {
      email: validateEmail(email),
      password: validateNewPassword(password),
    };
    setErrors(newErrors);
    setMessage(null);
    if (newErrors.email || newErrors.password) return;

    setLoading(true);
    try {
      await signUp(email.trim(), password);
      setMessage({ type: 'success', text: 'Account created. You can now log in.' });
      setEmail('');
      setPassword('');
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Sign Up</h1>
        <p className="subtext">
          Already a member? <Link to="/login">Log In</Link>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="signup-email">Email</label>
            <div className="input-row">
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'signup-email-error' : undefined}
              />
            </div>
            {errors.email && <p className="field-error" id="signup-email-error">{errors.email}</p>}
          </div>

          <PasswordField
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
            disabled={loading}
          />

          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>

          <div className="message-area" aria-live="polite">
            {message && (
              <p className={`message ${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>
                {message.text}
                {message.type === 'success' && <> <Link to="/login">Go to Log In</Link></>}
              </p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
