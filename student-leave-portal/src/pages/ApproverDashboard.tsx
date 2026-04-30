import { useState, useEffect } from 'react';
import LeaveList from '../components/LeaveList';

export default function ApproverDashboard({ user: _user }: { user: any }) {
  const [leaves, setLeaves] = useState<any[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || '';

  const fetchPendingLeaves = () => {
    fetch(`${API_URL}/api/leaves/pending`)
      .then(res => res.json())
      .then(data => setLeaves(data))
      .catch(() => console.log("Backend not connected yet."));
  };

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const handleStatusUpdate = (id: number, status: string) => {
    fetch(`${API_URL}/api/leaves/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(() => fetchPendingLeaves());
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Pending Leave Requests</h2>
      <LeaveList leaves={leaves} isApprover={true} onUpdateStatus={handleStatusUpdate} />
    </div>
  );
}
