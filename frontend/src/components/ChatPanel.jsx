import { useState, useEffect } from "react";
import useSSE from "../hooks/useSSE";
import { marked } from "marked";

export default function ChatPanel({ sessionId, provider, model, history, onUserSend, onAssistantDelta, onAssistantDone }) {
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [body, setBody] = useState(null);
  const [error, setError] = useState("");

  // Reset error when sessionId changes (switching chats)
  useEffect(() => { setError(""); }, [sessionId]);

  useSSE({
    url: streaming ? `${import.meta.env.VITE_API_BASE || "http://localhost:8003"}/chat/${sessionId}/stream` : null,
    body,
    onDelta: (deltaOrError) => {
      if (typeof deltaOrError === "string") {
        onAssistantDelta(deltaOrError);
      } else if (deltaOrError && deltaOrError.error) {
        setError(deltaOrError.error);
      }
    },
    onDone: () => { setStreaming(false); onAssistantDone(); },
    onError: (err) => { setStreaming(false); setError(err?.message || "Unknown error"); }
  });

  const onSend = () => {
    if (!input.trim() || !sessionId) return;
    const msg = { role: "user", content: input, provider, model, created_at: new Date().toISOString() };
    const msgs = [...history, msg];
    onUserSend(msg);
    setBody({ messages: msgs, provider, model });
    setStreaming(true);
    setInput("");
  };

  const fmtTime = (iso) => {
    try { const d = new Date(iso); return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch { return ""; }
  };

  return (
    <div className="chat">
      <div className="messages">
        {history.map((m, idx) => (
          <div key={idx} className={`msg ${m.role}`}>
            <div className="msg-meta">
              <span className={`role-badge ${m.role}`}>{m.role === 'user' ? 'You' : 'AI'}</span>
              {m.created_at && <span className="timestamp">{fmtTime(m.created_at)}</span>}
            </div>
            <div dangerouslySetInnerHTML={{__html: marked.parse(m.content || "")}} />
          </div>
        ))}
        {error && (
          <div className="msg error">
            <div style={{ color: 'red' }}>{error}</div>
          </div>
        )}
        {streaming && <div className="cursor">▍</div>}
      </div>
      <div className="composer">
        <div className="input-wrap">
          <textarea rows={2} value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your message..." onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); onSend(); } }} />
          <div className="char-count">{input.length}</div>
        </div>
        <button className="send-btn" onClick={onSend} title="Send" disabled={streaming} aria-disabled={streaming}>
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2 .01 7z"/>
          </svg>
        </button>
        {streaming && (
          <button className="pill" onClick={()=>setStreaming(false)} title="Stop">Stop</button>
        )}
      </div>
    </div>
  );
}
