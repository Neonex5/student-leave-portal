import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import ApproverDashboard from './pages/ApproverDashboard';
import './index.css';

function App() {
  const [user, setUser] = useState<{ id: number, name: string, role: string } | null>(null);

  const handleLogout = () => setUser(null);

  return (
    <BrowserRouter>
      <div className="app-container">
        {user && (
          <nav className="navbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src="/logo.png" alt="Logo" style={{ height: '32px', borderRadius: '6px' }} />
              <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>LeavePortal</h1>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Hello, {user.name}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
          </nav>
        )}
        <Routes>
          <Route path="/" element={
            !user ? <Login onLogin={setUser} /> : 
            user.role === 'STUDENT' ? <Navigate to="/student" /> : <Navigate to="/approver" />
          } />
          <Route path="/student" element={
            user?.role === 'STUDENT' ? <StudentDashboard user={user} /> : <Navigate to="/" />
          } />
          <Route path="/approver" element={
            user?.role === 'APPROVER' ? <ApproverDashboard user={user} /> : <Navigate to="/" />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
