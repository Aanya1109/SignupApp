import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import SignUp from './pages/SignUp.jsx';
import Login from './pages/Login.jsx';
import Welcome from './pages/Welcome.jsx';

export default function App() {
  const [user, setUser] = useState(null); // lives only in memory (no localStorage)
  const navigate = useNavigate();

  function handleLogout() {
    setUser(null);
    navigate('/login');
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login onLogin={setUser} />} />
      <Route
        path="/welcome"
        element={user ? <Welcome user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}
