import React from "react";

export function Select({ label, required, value, onChange, options }) {
  return (
    <div>
      <label className="field-label">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <select value={value} onChange={onChange} className="select">
        {options.map((o) => (
          <option key={o.value || o.label} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

