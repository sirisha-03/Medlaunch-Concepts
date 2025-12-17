import React from "react";
import { DateField } from "../shared/DateField";
import { ChipDateInput } from "../shared/ChipDateInput";

export function Step5({ form, setForm }) {
  const CardShell = ({ children }) => <div className="card">{children}</div>;

  const categories = [
    {
      title: "Emergency & Critical Care",
      items: [
        "Emergency Department",
        "Neonatal Intensive Care Services",
        "Pediatric Intensive Care Services",
        "Pediatric Intensive Care Services",
      ],
    },
    {
      title: "Cardiac Services",
      items: ["Cardiac Catheterization Laboratory", "Open Heart"],
    },
    {
      title: "Diagnostic Services",
      items: [
        "Magnetic Resonance Imaging (MRI)",
        "Diagnostic Radioisotope Facility",
        "Lithotripsy",
      ],
    },
  ];

  const standards = ["Action1", "Action2", "Action3", "Action4"];

  const toggleService = (svc) => {
    setForm((p) => {
      const exists = p.svc_selected.includes(svc);
      return {
        ...p,
        svc_selected: exists
          ? p.svc_selected.filter((s) => s !== svc)
          : [...p.svc_selected, svc],
      };
    });
  };

  const filteredCategories = categories
    .map((c) => ({
      ...c,
      items: c.items.filter((i) =>
        i.toLowerCase().includes(form.svc_search.toLowerCase())
      ),
    }))
    .filter((c) => c.items.length > 0);

  const addStandard = (val) => {
    if (!val) return;
    const scrollY = window.scrollY;
    setForm((p) =>
      p.std_selected.includes(val)
        ? p
        : { ...p, std_selected: [...p.std_selected, val] }
    );
    // Restore scroll position after state update
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 0);
  };

  const removeStandard = (val) => {
    const scrollY = window.scrollY;
    setForm((p) => ({
      ...p,
      std_selected: p.std_selected.filter((s) => s !== val),
    }));
    // Restore scroll position after state update
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 0);
  };

  const removeDateChip = (keyList, idx) =>
    setForm((p) => ({
      ...p,
      [keyList]: p[keyList].filter((_, i) => i !== idx),
    }));

  return (
    <div className="flex flex-col gap-16">
      <CardShell>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Service Offering
          </h2>
          <div className="mt-1 text-xs text-slate-500">
            Primary Site Service offering
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="text-xs font-semibold text-primary-blue border-b-2 border-primary-blue pb-2"
            >
              All Services
            </button>

            <div className="mt-6 relative">
              <input
                value={form.svc_search}
                onChange={(e) =>
                  setForm((p) => ({ ...p, svc_search: e.target.value }))
                }
                placeholder="Search services..."
                className="input"
              />
              <span className="absolute right-3 top-2.5 text-slate-400">⌕</span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.title}
                  className="rounded-lg border border-slate-200 bg-white p-5"
                >
                  <div className="text-sm font-semibold text-slate-800">
                    {cat.title}
                  </div>
                  <div className="mt-4 space-y-2">
                    {cat.items.map((svc) => (
                      <label
                        key={svc}
                        className="flex items-center gap-2 text-xs text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={form.svc_selected.includes(svc)}
                          onChange={() => toggleService(svc)}
                          className="checkbox"
                        />
                        {svc}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {filteredCategories.length % 2 === 1 ? <div /> : null}
            </div>

            <button
              type="button"
              className="btn btn-outline mt-6"
              onClick={() => alert("Add Other Service (mock)")}
            >
              + Add Other Service
            </button>
          </div>
        </div>
      </CardShell>

      <CardShell>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Standards to Apply
          </h2>

          <div className="mt-5">
            <select
              value=""
              onChange={(e) => addStandard(e.target.value)}
              className="select"
            >
              <option value="">Select Standard(s)</option>
              {standards.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="mt-3 flex flex-wrap gap-2">
              {form.std_selected.map((s) => (
                <span key={s} className="chip">
                  {s}
                  <button
                    type="button"
                    className="chip-remove"
                    onClick={() => removeStandard(s)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <DateField
              label="Expiration Date of Current Stroke Certification"
              value={form.std_expirationDate}
              onChange={(e) => {
                const scrollY = window.scrollY;
                setForm((p) => ({ ...p, std_expirationDate: e.target.value }));
                // Restore scroll position after state update
                setTimeout(() => {
                  window.scrollTo(0, scrollY);
                }, 0);
              }}
            />
            <DateField
              label="Date of Application"
              value={form.std_applicationDate}
              onChange={(e) => {
                const scrollY = window.scrollY;
                setForm((p) => ({ ...p, std_applicationDate: e.target.value }));
                // Restore scroll position after state update
                setTimeout(() => {
                  window.scrollTo(0, scrollY);
                }, 0);
              }}
            />
          </div>

          <div className="mt-10">
            <ChipDateInput
              label="Dates of last twenty-five thrombolytic administrations"
              placeholder="mm/dd/yyyy , mm/dd/yyyy"
              onAddDate={(picked) => {
                const scrollY = window.scrollY;
                if (!form.thrombolytic_dates.includes(picked)) {
                  if (form.thrombolytic_dates.length < 25) {
                    setForm((p) => ({
                      ...p,
                      thrombolytic_dates: [...p.thrombolytic_dates, picked],
                    }));
                    // Restore scroll position
                    setTimeout(() => {
                      window.scrollTo(0, scrollY);
                    }, 0);
                  } else {
                    alert("Maximum 25 dates allowed");
                  }
                } else {
                  alert("This date has already been added");
                }
              }}
              chips={form.thrombolytic_dates}
              onRemove={(idx) => removeDateChip("thrombolytic_dates", idx)}
              maxDates={25}
            />
          </div>

          <div className="mt-8">
            <ChipDateInput
              label="Dates of last fifteen thrombectomies"
              placeholder="mm/dd/yyyy , mm/dd/yyyy"
              onAddDate={(picked) => {
                const scrollY = window.scrollY;
                if (!form.thrombectomy_dates.includes(picked)) {
                  if (form.thrombectomy_dates.length < 15) {
                    setForm((p) => ({
                      ...p,
                      thrombectomy_dates: [...p.thrombectomy_dates, picked],
                    }));
                    // Restore scroll position
                    setTimeout(() => {
                      window.scrollTo(0, scrollY);
                    }, 0);
                  } else {
                    alert("Maximum 15 dates allowed");
                  }
                } else {
                  alert("This date has already been added");
                }
              }}
              chips={form.thrombectomy_dates}
              onRemove={(idx) => removeDateChip("thrombectomy_dates", idx)}
              maxDates={15}
            />
          </div>
        </div>
      </CardShell>
    </div>
  );
}
