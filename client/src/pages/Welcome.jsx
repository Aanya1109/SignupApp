export default function Welcome({ user, onLogout }) {
  return (
    <main className="page">
      <section className="card">
        <h1>Welcome</h1>
        <p className="subtext">You are logged in as <strong>{user.email}</strong>.</p>
        <p className="note">
          This is a demonstration login. The server confirmed your password, but no session or token
          is stored, so refreshing this page logs you out.
        </p>
        <button type="button" className="primary" onClick={onLogout}>Log Out</button>
      </section>
    </main>
  );
}
