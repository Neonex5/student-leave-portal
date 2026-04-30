import { useState } from 'react';

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isRegistering) {
        // Register flow
        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, role })
        });
        
        if (!res.ok) throw new Error('Failed to register. Please check your inputs.');
        const newUser = await res.json();
        
        setSuccessMsg(`Registration successful! Your Login ID is: ${newUser.id}. Please save this!`);
        setIsRegistering(false);
        setId(newUser.id.toString());
      } else {
        // Login flow
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: parseInt(id), name })
        });
        
        if (!res.ok) throw new Error('Invalid ID or Name. Please try again.');
        const user = await res.json();
        onLogin(user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '400px', margin: '10vh auto', padding: '2.5rem', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '1rem' }} className="gradient-text">
        {isRegistering ? 'Create Account' : 'Welcome Back'}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        {isRegistering ? 'Register to access the portal' : 'Enter your ID and Name to login'}
      </p>
      
      {error && <div style={{ color: '#ff6b6b', background: 'rgba(255,0,0,0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
      {successMsg && <div style={{ color: '#51cf66', background: 'rgba(0,255,0,0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{successMsg}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {!isRegistering && (
          <div className="input-group" style={{ textAlign: 'left' }}>
            <label>Login ID</label>
            <input type="number" required className="input-field" value={id} onChange={e => setId(e.target.value)} placeholder="e.g. 1" />
          </div>
        )}

        <div className="input-group" style={{ textAlign: 'left' }}>
          <label>Full Name</label>
          <input type="text" required className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alice" />
        </div>

        {isRegistering && (
          <div className="input-group" style={{ textAlign: 'left' }}>
            <label>Role</label>
            <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
              <option value="STUDENT">Student</option>
              <option value="APPROVER">Teacher</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
          {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
        </button>
      </form>

      <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
        <button 
          onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccessMsg(''); }} 
          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isRegistering ? 'Already have an account? Login here.' : "Don't have an account? Register here."}
        </button>
      </div>
    </div>
  );
}
