import React from "react";
import { Field } from "../shared/Field";
import { Select } from "../shared/Select";
import { ContactCard } from "../shared/ContactCard";
import { US_STATES } from "../../utils/constants";

export function Step3({ form, setField }) {
  return (
    <div>
      {/* 1. Title Container */}
      <div className="step3-title-container">
        <h2 className="section-title">Contact Information</h2>
      </div>

      {/* 2. CEO Container */}
      <div className="step3-ceo-container">
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
      </div>

      {/* 3. Director of Quality Container */}
      <div className="step3-quality-container">
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
      </div>

      {/* 4. Invoicing Contact Container */}
      <div className="step3-invoicing-container">
        <div className="card-border">
          <div className="contact-card-content">
            <div className="contact-card-title">Invoicing Contact</div>

            <label className="contact-card-checkbox">
              <input
                type="checkbox"
                className="checkbox"
                checked={form.invoicing_sameAsPrimary}
                onChange={setField("invoicing_sameAsPrimary")}
              />
              Same as Primary Contact entered in Step 1
            </label>

            <div className="contact-card-grid">
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

            <div className="contact-card-field">
              <Field
                label="Phone"
                required
                value={form.invoicing_phone}
                onChange={setField("invoicing_phone")}
              />
            </div>

            <div className="contact-card-field">
              <Field
                label="Email"
                required
                value={form.invoicing_email}
                onChange={setField("invoicing_email")}
              />
            </div>

            <div style={{ marginTop: "32px" }}>
              <div className="contact-card-title">Billing Address</div>

              <div style={{ marginTop: "16px" }}>
                <Field
                  label="Street Address"
                  required
                  value={form.billing_street}
                  onChange={setField("billing_street")}
                />
              </div>

              <div className="form-three-column" style={{ marginTop: "20px" }}>
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
