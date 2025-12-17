import React, { useId } from "react";

export function DateField({ label, value, onChange }) {
  const id = useId();

  return (
    <div>
      <label
        className="block text-xs font-semibold text-slate-700"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="mt-2 relative">
        <input
          id={id}
          type="date"
          value={value}
          onChange={(e) => {
            const scrollY = window.scrollY;
            if (typeof onChange === "function") {
              onChange(e);
            }
            setTimeout(() => {
              window.scrollTo(0, scrollY);
            }, 0);
          }}
          className="input"
          placeholder="mm/dd/yyyy"
        />
        <label
          htmlFor={id}
          className="absolute right-3 top-2.5 cursor-pointer select-none text-slate-400 hover:text-slate-600"
          title="Open calendar"
          aria-label="Open calendar"
        >
          📅
        </label>
      </div>
    </div>
  );
}
