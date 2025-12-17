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
    <div>
      <h2 className="text-xl font-semibold text-slate-800">
        Facility and Organization Type
      </h2>

      <div className="mt-8">
        <div className="text-sm font-semibold text-slate-700">
          Facility Type <span className="text-red-500">*</span>
        </div>

        <div className="mt-4 space-y-4">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-3 text-sm text-slate-800"
            >
              <input
                type="radio"
                name="facilityType"
                value={opt}
                checked={form.facilityType === opt}
                onChange={setField("facilityType")}
                className="radio"
              />
              <span className="font-medium">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

