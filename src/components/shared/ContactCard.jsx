import React from "react";
import { Field } from "./Field";

export function ContactCard({
  title,
  sameChecked,
  onSameChange,
  firstNameKey,
  lastNameKey,
  phoneKey,
  emailKey,
  form,
  setField,
  required,
}) {
  return (
    <div className="card-border">
      <div className="px-6 py-5">
        <div className="text-sm font-semibold text-slate-800">{title}</div>

        <label className="mt-3 flex items-center gap-2 text-xs text-slate-700">
          <input
            type="checkbox"
            className="checkbox"
            checked={sameChecked}
            onChange={onSameChange}
          />
          Same as Primary Contact entered in Step 1
        </label>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field
            label="First Name"
            required={!!required}
            value={String(form[firstNameKey] || "")}
            onChange={setField(firstNameKey)}
          />
          <Field
            label="Last Name"
            required={!!required}
            value={String(form[lastNameKey] || "")}
            onChange={setField(lastNameKey)}
          />
        </div>

        <div className="mt-5">
          <Field
            label="Phone"
            required={!!required}
            value={String(form[phoneKey] || "")}
            onChange={setField(phoneKey)}
          />
        </div>

        <div className="mt-5">
          <Field
            label="Email"
            required={!!required}
            value={String(form[emailKey] || "")}
            onChange={setField(emailKey)}
          />
        </div>
      </div>
    </div>
  );
}

