import React from "react";

export function Field({ label, required, value, onChange, placeholder, disabled }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={
          "input " +
          (disabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : "")
        }
      />
    </div>
  );
}

