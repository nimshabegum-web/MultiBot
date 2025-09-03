import { useEffect, useState } from "react";
import { getModels } from "../api/client";

export default function ModelSwitcher({ value, onChange }) {
  const [models, setModels] = useState({});
  useEffect(() => { getModels().then(setModels); }, []);
  const providers = Object.keys(models);

  // Ensure there is a model when provider changes
  useEffect(() => {
    const list = models[value.provider] || [];
    if (list.length && !list.includes(value.model)) {
      onChange({ ...value, model: list[0] });
    }
  }, [models, value.provider]);

  return (
    <div className="switcher">
      <div className="group">
        {providers.map(p => (
          <button
            key={p}
            className={`pill-btn ${value.provider===p? 'active':''}`}
            title={p}
            onClick={() => {
              const list = models[p]||[];
              onChange({ ...value, provider: p, model: (list[0] || '') });
            }}
          >{p}</button>
        ))}
      </div>
      <div className="group">
        {(models[value.provider] || []).map(m => (
          <button
            key={m}
            className={`pill-btn ${value.model===m? 'active':''}`}
            onClick={() => onChange({ ...value, model: m })}
          >{m}</button>
        ))}
      </div>
    </div>
  );
}
