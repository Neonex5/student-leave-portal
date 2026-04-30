export default function LeaveList({ leaves, isApprover, onUpdateStatus }: { leaves: any[], isApprover: boolean, onUpdateStatus?: (id: number, status: string) => void }) {
  if (leaves.length === 0) {
    return <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No leave requests found.</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {leaves.map(leave => (
        <div key={leave.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {isApprover && <h4 style={{ marginBottom: '4px' }}>{leave.student?.name}</h4>}
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
              <span>From: {leave.startDate}</span>
              <span>To: {leave.endDate}</span>
            </div>
            <p style={{ margin: 0 }}>{leave.reason}</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <span className={`badge badge-${leave.status}`}>{leave.status}</span>
            {isApprover && leave.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => onUpdateStatus?.(leave.id, 'APPROVED')}>Approve</button>
                <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => onUpdateStatus?.(leave.id, 'REJECTED')}>Reject</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
