import { useState } from 'react';

export default function LeaveForm({ user, onSuccess }: { user: any, onSuccess: () => void }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${API_URL}/api/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student: { id: user.id }, startDate, endDate, reason })
    }).then(res => {
      setLoading(false);
      if (res.ok) onSuccess();
      else alert('Failed to submit request. (Is backend running?)');
    }).catch(() => {
      setLoading(false);
      alert('Failed to submit request. (Backend not reachable)');
    });
  };

  return (
    <form className="glass-panel" onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Submit Leave Request</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="input-group">
          <label>Start Date</label>
          <input type="date" required className="input-field" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="input-group">
          <label>End Date</label>
          <input type="date" required className="input-field" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
      </div>
      
      <div className="input-group">
        <label>Reason</label>
        <textarea required rows={3} className="input-field" value={reason} onChange={e => setReason(e.target.value)} placeholder="Explain why you need leave..."></textarea>
      </div>
      
      <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
}
