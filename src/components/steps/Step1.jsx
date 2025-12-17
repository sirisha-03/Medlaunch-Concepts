import React from "react";
import { Field } from "../shared/Field";

export function Step1({ form, setField }) {
  const sendVerification = () =>
    alert(`Verification email sent to: ${form.email}`);

  return (
    <div>
      <section>
        <h2 className="text-xl font-semibold text-slate-800">
          Identify Healthcare Organization
        </h2>

        <div className="mt-6 space-y-5">
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

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="checkbox"
              checked={form.sameAsLegal}
              onChange={setField("sameAsLegal")}
            />
            Same as Legal Entity Name
          </label>
        </div>
      </section>

      <hr className="my-10 border-slate-200" />

      <section>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Primary Contact Information
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Primary contact receives all DNV Healthcare official
              communications
            </p>
          </div>
        </div>

        <div className="mt-7 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

          <div className="relative">
            <Field
              label="Email"
              required
              value={form.email}
              onChange={setField("email")}
              placeholder="name@company.com"
            />
            <button
              type="button"
              className="absolute right-3 text-slate-400 hover:text-slate-400"
              style={{ top: "25%", transform: "translateY(-50%)" }}
              onClick={() => alert("Refresh / validate email (mock)")}
              aria-label="Refresh"
              title="Refresh"
            >
              ↻
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
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
        </div>
      </section>
    </div>
  );
}
