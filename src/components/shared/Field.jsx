import React from "react";

export function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
  disabled,
}) {
  return (
    <div>
      <label className="field-label">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={"input " + (disabled ? "field-disabled" : "")}
      />
    </div>
  );
}
