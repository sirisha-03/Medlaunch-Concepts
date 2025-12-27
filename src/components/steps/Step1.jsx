import React from "react";
import { Field } from "../shared/Field";

export function Step1({ form, setField }) {
  const sendVerification = () =>
    alert(`Verification email sent to: ${form.email}`);

  return (
    <div>
      <section className="form-fields-container">
        <h2 className="section-title">Identify Healthcare Organization</h2>

        <Field
          label="Legal Entity Name"
          required
          value={form.legalEntityName}
          onChange={setField("legalEntityName")}
        />

        <Field
          label="Doing Business As (d/b/a) Name"
          required
          value={form.dbaName}
          onChange={setField("dbaName")}
          disabled={form.sameAsLegal}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox"
            checked={form.sameAsLegal}
            onChange={setField("sameAsLegal")}
          />
          Same as Legal Entity Name
        </label>
      </section>

      <hr className="section-divider" />

      <section className="form-fields-container">
        <div>
          <h2 className="section-title">Primary Contact Information</h2>
          <p className="section-description">
            Primary contact receives all DNV Healthcare official communications
          </p>
        </div>

        <div className="form-two-column">
          <Field
            label="First Name"
            required
            value={form.firstName}
            onChange={setField("firstName")}
          />
          <Field
            label="Last Name"
            required
            value={form.lastName}
            onChange={setField("lastName")}
          />
        </div>

        <Field
          label="Title"
          required
          value={form.title}
          onChange={setField("title")}
        />

        <div className="form-two-column">
          <Field
            label="Work Phone"
            required
            value={form.workPhone}
            onChange={setField("workPhone")}
            placeholder="(###) ###-####"
          />
          <Field
            label="Cell Phone"
            value={form.cellPhone}
            onChange={setField("cellPhone")}
          />
        </div>

        <div className="relative-container">
          <Field
            label="Email"
            required
            value={form.email}
            onChange={setField("email")}
            placeholder="name@company.com"
          />
          <button
            type="button"
            className="email-refresh-button"
            onClick={() => alert("Refresh / validate email (mock)")}
            aria-label="Refresh"
            title="Refresh"
          >
            ↻
          </button>
        </div>

        <div className="action-buttons-container">
          <button
            type="button"
            className="btn btn-outline"
            onClick={sendVerification}
            disabled={!form.email}
          >
            Send Verification Email
          </button>

          <span
            className={
              "badge " +
              (form.emailVerified ? "badge-verified" : "badge-not-verified")
            }
          >
            {form.emailVerified ? "Verified" : "Not verified"}
          </span>
        </div>
      </section>
    </div>
  );
}
