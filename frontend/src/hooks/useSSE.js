import { useEffect, useRef } from "react";

export default function useSSE({ url, body, onDelta, onDone, onError }) {
  const esRef = useRef(null);

  useEffect(() => {
    if (!url || !body) return;

    const ctrl = new AbortController();
    fetch(url, {
      method: "POST",
      headers: { "Content-Type":"application/json", "Accept":"text/event-stream" },
      body: JSON.stringify(body),
      signal: ctrl.signal
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        for (let i = 0; i < parts.length - 1; i++) {
          const line = parts[i].trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") { onDone && onDone(); return; }
          try {
            const json = JSON.parse(payload); // payload is {"delta":"..."} | {"error":"..."} | {"info":"fallback","provider":"..."}
            if (json && typeof json === 'object') {
              if (json.delta != null) {
                onDelta && onDelta(String(json.delta));
              } else if (json.error) {
                onDelta && onDelta({ error: String(json.error) });
              } else if (json.info) {
                onDelta && onDelta({ info: String(json.info), provider: json.provider });
              }
            }
          } catch {
            // ignore malformed chunks
          }
        }
        buffer = parts[parts.length - 1];
      }
      onDone && onDone();
    }).catch(err => onError && onError(err));

    return () => ctrl.abort();
  }, [url, JSON.stringify(body)]);
}
