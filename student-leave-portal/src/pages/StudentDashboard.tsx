import { useState, useEffect } from 'react';
import LeaveForm from '../components/LeaveForm';
import LeaveList from '../components/LeaveList';

export default function StudentDashboard({ user }: { user: any }) {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || '';

  const fetchLeaves = () => {
    fetch(`${API_URL}/api/leaves/student/${user.id}`)
      .then(res => res.json())
      .then(data => setLeaves(data))
      .catch(() => console.log("Backend not connected yet."));
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Leave Requests</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : '+ New Request'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '2rem' }}>
          <LeaveForm user={user} onSuccess={() => { setShowForm(false); fetchLeaves(); }} />
        </div>
      )}

      <LeaveList leaves={leaves} isApprover={false} />
    </div>
  );
}
