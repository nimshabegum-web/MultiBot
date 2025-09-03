import { useMemo, useState } from "react";

export default function Sidebar({ sessions, onNew, onPick, currentId }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return sessions;
    return sessions.filter(s => (s.title||"").toLowerCase().includes(term));
  }, [q, sessions]);

  const fmtDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch { return ""; }
  };

  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="avatar">EZ</div>
        <div className="profile-info">
          <div className="name">ezSCM User</div>
          <div className="subtitle">Welcome back</div>
        </div>
      </div>

      <div className="search">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search sessions..." />
      </div>

      <button className="new-chat-btn" onClick={onNew}>
        <span className="plus">＋</span>
        New Chat
      </button>

      <ul>
        {filtered.map(s => (
          <li key={s.id}>
            <button
              className={`session ${s.id===currentId ? 'active' : ''}`}
              onClick={()=>onPick(s.id)}
            >
              <span className="title">{s.title || 'Untitled'}</span>
              {s.created_at && <span className="time">{fmtDate(s.created_at)}</span>}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
