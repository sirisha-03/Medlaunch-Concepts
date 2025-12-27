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
      <div className="contact-card-content">
        <div className="contact-card-title">{title}</div>

        <label className="contact-card-checkbox">
          <input
            type="checkbox"
            className="checkbox"
            checked={sameChecked}
            onChange={onSameChange}
          />
          Same as Primary Contact entered in Step 1
        </label>

        <div className="contact-card-grid">
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

        <div className="contact-card-field">
          <Field
            label="Phone"
            required={!!required}
            value={String(form[phoneKey] || "")}
            onChange={setField(phoneKey)}
          />
        </div>

        <div className="contact-card-field">
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
