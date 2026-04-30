import { useState } from 'react';

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginId, setLoginId] = useState(''); // Used for Login (can be numeric ID or USN)
  const [name, setName] = useState('');
  const [role, setRole] = useState('STUDENT');
  
  // USN Construction parts
  const [usnYear, setUsnYear] = useState('23');
  const [usnDept, setUsnDept] = useState('CS');
  const [usnNum, setUsnNum] = useState('001');

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
        const registrationData: any = { name, role };
        
        if (role === 'STUDENT') {
          registrationData.usn = `1RI${usnYear}${usnDept}${usnNum.padStart(3, '0')}`;
        }

        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registrationData)
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to register.');
        
        const displayId = data.usn || data.id;
        setSuccessMsg(`Registration successful! Your Login ID is: ${displayId}. Please save this!`);
        setIsRegistering(false);
        setLoginId(displayId.toString());
      } else {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ loginId, name })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Invalid Login ID or Name.');
        onLogin(data);
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
        {isRegistering ? 'Register to access the portal' : 'Enter your USN/ID and Name to login'}
      </p>
      
      {error && <div style={{ color: '#ff6b6b', background: 'rgba(255,0,0,0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
      {successMsg && <div style={{ color: '#51cf66', background: 'rgba(0,255,0,0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{successMsg}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {!isRegistering && (
          <div className="input-group" style={{ textAlign: 'left' }}>
            <label>USN or Login ID</label>
            <input type="text" required className="input-field" value={loginId} onChange={e => setLoginId(e.target.value)} placeholder="e.g. 1RI23CS088 or 1" />
          </div>
        )}

        <div className="input-group" style={{ textAlign: 'left' }}>
          <label>Full Name</label>
          <input type="text" required className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alice" />
        </div>

        {isRegistering && (
          <>
            <div className="input-group" style={{ textAlign: 'left' }}>
              <label>Role</label>
              <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
                <option value="STUDENT">Student</option>
                <option value="APPROVER">Teacher</option>
              </select>
            </div>

            {role === 'STUDENT' && (
              <div className="input-group" style={{ textAlign: 'left' }}>
                <label>USN Generation (1RI + Year + Dept + Num)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input type="text" className="input-field" style={{ flex: 1 }} value={usnYear} onChange={e => setUsnYear(e.target.value.slice(0,2))} placeholder="Year (23)" />
                  <input type="text" className="input-field" style={{ flex: 1 }} value={usnDept} onChange={e => setUsnDept(e.target.value.toUpperCase().slice(0,2))} placeholder="Dept (CS)" />
                  <input type="number" className="input-field" style={{ flex: 1.5 }} min="0" max="200" value={usnNum} onChange={e => setUsnNum(e.target.value)} placeholder="000-200" />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.5rem' }}>Preview: 1RI{usnYear}{usnDept}{usnNum.padStart(3, '0')}</p>
              </div>
            )}
          </>
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
