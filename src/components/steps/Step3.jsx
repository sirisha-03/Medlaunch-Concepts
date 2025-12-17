import React from "react";
import { Field } from "../shared/Field";
import { Select } from "../shared/Select";
import { ContactCard } from "../shared/ContactCard";
import { US_STATES } from "../../utils/constants";

export function Step3({ form, setField }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800">
        Contact Information
      </h2>

      <div className="mt-6 space-y-6">
        <ContactCard
          title="Chief Executive Officer (CEO)"
          sameChecked={form.ceo_sameAsPrimary}
          onSameChange={setField("ceo_sameAsPrimary")}
          firstNameKey="ceo_firstName"
          lastNameKey="ceo_lastName"
          phoneKey="ceo_phone"
          emailKey="ceo_email"
          form={form}
          setField={setField}
          required
        />

        <ContactCard
          title="Director of Quality"
          sameChecked={form.quality_sameAsPrimary}
          onSameChange={setField("quality_sameAsPrimary")}
          firstNameKey="quality_firstName"
          lastNameKey="quality_lastName"
          phoneKey="quality_phone"
          emailKey="quality_email"
          form={form}
          setField={setField}
        />

        <div className="card-border">
          <div className="px-6 py-5">
            <div className="text-sm font-semibold text-slate-800">
              Invoicing Contact
            </div>

            <label className="mt-3 flex items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                className="checkbox"
                checked={form.invoicing_sameAsPrimary}
                onChange={setField("invoicing_sameAsPrimary")}
              />
              Same as Primary Contact entered in Step 1
            </label>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="First Name"
                required
                value={form.invoicing_firstName}
                onChange={setField("invoicing_firstName")}
              />
              <Field
                label="Last Name"
                required
                value={form.invoicing_lastName}
                onChange={setField("invoicing_lastName")}
              />
            </div>

            <div className="mt-5">
              <Field
                label="Phone"
                required
                value={form.invoicing_phone}
                onChange={setField("invoicing_phone")}
              />
            </div>

            <div className="mt-5">
              <Field
                label="Email"
                required
                value={form.invoicing_email}
                onChange={setField("invoicing_email")}
              />
            </div>

            <div className="mt-8">
              <div className="text-sm font-semibold text-slate-800">
                Billing Address
              </div>

              <div className="mt-4">
                <Field
                  label="Street Address"
                  required
                  value={form.billing_street}
                  onChange={setField("billing_street")}
                />
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                <Field
                  label="City"
                  required
                  value={form.billing_city}
                  onChange={setField("billing_city")}
                />
                <Select
                  label="State"
                  required
                  value={form.billing_state}
                  onChange={setField("billing_state")}
                  options={US_STATES}
                />
                <Field
                  label="ZIP Code"
                  required
                  value={form.billing_zip}
                  onChange={setField("billing_zip")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

