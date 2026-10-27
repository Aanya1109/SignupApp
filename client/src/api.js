// All communication with the Express server happens here, using the Fetch API.
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message);
    this.status = status;           // HTTP status (0 = server could not be reached)
    this.fieldErrors = fieldErrors; // e.g. { email: '...', password: '...' }
  }
}

async function postJson(path, body) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    // fetch only throws for network problems (server off, no internet, CORS block)
    throw new ApiError('Cannot reach the server. Check that the backend is running.', 0);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // response was not JSON
  }

  if (!response.ok) {
    throw new ApiError(data?.message || 'Something went wrong. Please try again.', response.status, data?.errors);
  }
  return data;
}

export const signUp = (email, password) => postJson('/api/auth/signup', { email, password });
export const logIn = (email, password) => postJson('/api/auth/login', { email, password });
