import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordField from '../components/PasswordField.jsx';
import { logIn } from '../api.js';
import { validateEmail, validateExistingPassword } from '../validation.js';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    const newErrors = {
      email: validateEmail(email),
      password: validateExistingPassword(password),
    };
    setErrors(newErrors);
    setMessage(null);
    if (newErrors.email || newErrors.password) return;

    setLoading(true);
    try {
      const data = await logIn(email.trim(), password);
      onLogin(data.user);          // keep the user in React memory only
      navigate('/welcome');
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setMessage({ type: 'error', text: err.message });
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Log In</h1>
        <p className="subtext">
          New here? <Link to="/signup">Sign Up</Link>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <div className="input-row">
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
              />
            </div>
            {errors.email && <p className="field-error" id="login-email-error">{errors.email}</p>}
          </div>

          <PasswordField
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
            disabled={loading}
          />

          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>

          <div className="message-area" aria-live="polite">
            {message && <p className={`message ${message.type}`} role="alert">{message.text}</p>}
          </div>
        </form>
      </section>
    </main>
  );
}
