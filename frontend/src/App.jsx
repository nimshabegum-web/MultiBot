import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import ModelSwitcher from "./components/ModelSwitcher";
import { createSession, getSession, listSessions, saveSessionMessages } from "./api/client";

function uid() {
  let u = localStorage.getItem("user_id");
  if (!u) { u = crypto.randomUUID(); localStorage.setItem("user_id", u); }
  return u;
}

export default function App() {
  const userId = useRef(uid());
  const [sessions, setSessions] = useState([]);
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [pm, setPM] = useState(() => {
    try {
      const raw = localStorage.getItem("pm");
      if (raw) return JSON.parse(raw);
    } catch {}
    return { provider: "openai", model: "gpt-4o-mini" };
  });
  const [dark, setDark] = useState(() => (localStorage.getItem("theme") === "dark"));

  const refresh = async () => {
    try {
      const s = await listSessions(userId.current);
      setSessions(s);
      if (s.length && !current) {
        await pick(s[0].id);
      }
    } catch (e) {
      console.error("Failed to refresh sessions:", e);
    }
  };

  const pick = async (sid) => {
    try {
      setCurrent(sid);
      const msgs = await getSession(sid);
      setHistory(Array.isArray(msgs) ? msgs : []);
    } catch (e) {
      setHistory([]);
      console.error("Failed to pick session:", e);
    }
  };

  const addSession = async () => {
    try {
      const res = await createSession(userId.current, "New Chat");
      if (res && res.session_id) {
        setSessions(s => [{ id: res.session_id, user_id: userId.current, title: "New Chat", created_at: new Date().toISOString() }, ...s]);
        setCurrent(res.session_id);
        setHistory([]);
      } else {
        throw new Error("No session_id returned");
      }
    } catch (e) {
      console.error("Failed to add session:", e);
    }
  };

  useEffect(() => { refresh(); }, []);

  // Apply theme to body and persist
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const onUserSend = async (msg) => {
    setHistory(h => {
      const newHistory = [...h, msg];
      if (current) saveSessionMessages(current, newHistory);
      return newHistory;
    });
  };

  const onAssistantDelta = (delta) => {
    setHistory(h => {
      // Always create a new assistant message for Gemini (single response)
      if (pm.provider === "gemini") {
        const content = delta && delta.trim() ? delta : "No response from Gemini.";
        const newHistory = [...h, { role: "assistant", content, provider: pm.provider, model: pm.model, created_at: new Date().toISOString() }];
        if (current) saveSessionMessages(current, newHistory);
        return newHistory;
      }
      // OpenAI: append to last assistant message (streaming)
      const last = h[h.length - 1];
      let newHistory;
      if (!last || last.role !== "assistant") {
        newHistory = [...h, { role: "assistant", content: delta, provider: pm.provider, model: pm.model, created_at: new Date().toISOString() }];
      } else {
        newHistory = [...h];
        newHistory[newHistory.length - 1] = { ...last, content: (last.content || "") + delta };
      }
      if (current) saveSessionMessages(current, newHistory);
      return newHistory;
    });
  };

  const onAssistantDone = () => {};

  const exportSession = () => {
    try {
      if (!current) return;
      const payload = {
        session_id: current,
        provider: pm.provider,
        model: pm.model,
        exported_at: new Date().toISOString(),
        messages: history,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ezscm-session-${current}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  return (
    <div className="layout">
      <Sidebar sessions={sessions} currentId={current} onNew={addSession} onPick={pick} />
      <main>
        <div className="topbar">
          <div className="brand">BlueSpring</div>
          <div className="topbar-right">
            <ModelSwitcher value={pm} onChange={setPM} />
            {current && (
              <button className="pill" onClick={exportSession} title="Export session as JSON">Export</button>
            )}
            <button className="moon-btn" title={dark ? "Switch to light" : "Switch to dark"} onClick={() => setDark(d => !d)} aria-pressed={dark}>
              {dark ? "☀" : "☾"}
            </button>
          </div>
        </div>
        {current
          ? <ChatPanel sessionId={current} provider={pm.provider} model={pm.model}
                       history={history} onUserSend={onUserSend}
                       onAssistantDelta={onAssistantDelta} onAssistantDone={onAssistantDone} />
          : <div className="empty">Create a new chat to begin.</div>}
      </main>
    </div>
  );
}
