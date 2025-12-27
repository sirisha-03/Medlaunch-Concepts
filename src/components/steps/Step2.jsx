import React from "react";

export function Step2({ form, setField }) {
  const options = [
    "Short-Term Acute Care",
    "Long-Term Acute Care",
    "Critical Access",
    "Children's",
    "Free-Standing Psychiatric",
    "Other",
  ];

  return (
    <section className="form-fields-container">
      <h2 className="section-title">Facility and Organization Type</h2>

      <div className="facility-type-section">
        <div className="facility-type-label">
          Facility Type <span className="text-red-500">*</span>
        </div>

        <div className="facility-type-options">
          {options.map((opt) => (
            <label key={opt} className="radio-label">
              <input
                type="radio"
                name="facilityType"
                value={opt}
                checked={form.facilityType === opt}
                onChange={setField("facilityType")}
                className="radio"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
