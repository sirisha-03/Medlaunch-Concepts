import React, { useMemo, useRef } from "react";
import { DateField } from "../shared/DateField";
import { ChipDateInput } from "../shared/ChipDateInput";

export function Step5({ form, setForm }) {
  const searchInputRef = useRef(null);

  const categories = [
    {
      title: "Emergency & Critical Care",
      items: [
        "Emergency Department",
        "Neonatal Intensive Care Services",
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
      const newSelection = exists
        ? p.svc_selected.filter((s) => s !== svc)
        : [...p.svc_selected, svc];
      console.log("Step5 - Service toggled:", {
        service: svc,
        action: exists ? "removed" : "added",
        selectedServices: newSelection,
      });
      return {
        ...p,
        svc_selected: newSelection,
      };
    });
  };

  const filteredCategories = useMemo(() => {
    return categories
      .map((c) => ({
        ...c,
        items: c.items.filter((i) =>
          i.toLowerCase().includes(form.svc_search.toLowerCase())
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [form.svc_search]);

  const handleSearchChange = (e) => {
    const input = e.target;
    const searchValue = input.value;
    const cursorPosition = input.selectionStart;

    // Update state
    setForm((p) => {
      console.log("Step5 - Service search:", {
        searchTerm: searchValue,
        filteredCategories: categories
          .map((c) => ({
            ...c,
            items: c.items.filter((i) =>
              i.toLowerCase().includes(searchValue.toLowerCase())
            ),
          }))
          .filter((c) => c.items.length > 0),
      });
      return { ...p, svc_search: searchValue };
    });

    // Restore cursor position after DOM update
    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      if (searchInputRef.current) {
        const newPosition = Math.min(cursorPosition, searchValue.length);
        searchInputRef.current.setSelectionRange(newPosition, newPosition);
        searchInputRef.current.focus();
      }
    });
  };

  const addStandard = (val) => {
    if (!val) return;
    const scrollY = window.scrollY;
    setForm((p) => {
      if (p.std_selected.includes(val)) {
        return p;
      }
      const newStandards = [...p.std_selected, val];
      console.log("Step5 - Standard added:", {
        standard: val,
        selectedStandards: newStandards,
      });
      return { ...p, std_selected: newStandards };
    });
    // Restore scroll position after state update
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 0);
  };

  const removeStandard = (val) => {
    const scrollY = window.scrollY;
    setForm((p) => {
      const newStandards = p.std_selected.filter((s) => s !== val);
      console.log("Step5 - Standard removed:", {
        standard: val,
        selectedStandards: newStandards,
      });
      return {
        ...p,
        std_selected: newStandards,
      };
    });
    // Restore scroll position after state update
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 0);
  };

  const removeDateChip = (keyList, idx) => {
    const scrollY = window.scrollY;
    setForm((p) => ({
      ...p,
      [keyList]: p[keyList].filter((_, i) => i !== idx),
    }));
    // Restore scroll position after state update
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 0);
  };

  return (
    <div>
      <div>
        <div className="step5-service-header-container">
          <h2 className="section-title">Service Offering</h2>
          <div className="service-section-header">
            Primary Site Service offering
          </div>
        </div>

        <div className="step5-all-services-container">
          <button type="button" className="service-tab-button">
            All Services
          </button>
        </div>

        <div className="form-section">
          <div className="service-search-container">
            <input
              ref={searchInputRef}
              type="text"
              value={form.svc_search}
              onChange={handleSearchChange}
              placeholder="Search services..."
              className="input"
            />
            <span className="service-search-icon">⌕</span>
          </div>

          <div className="service-categories-grid">
            {filteredCategories.map((cat) => (
              <div key={cat.title} className="service-category-card">
                <div className="service-category-title">{cat.title}</div>
                <div className="service-items-list">
                  {cat.items.map((svc, idx) => (
                    <label
                      key={`${cat.title}-${svc}-${idx}`}
                      className="service-item-label"
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
            className="btn btn-outline"
            style={{ marginTop: "24px" }}
            onClick={() => alert("Add Other Service (mock)")}
          >
            + Add Other Service
          </button>
        </div>
      </div>

      <div style={{ marginTop: "32px" }}>
        <h2 className="section-title">Standards to Apply</h2>

        <div className="standards-section">
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

          <div className="standards-chips-container">
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

        <div className="standards-dates-grid">
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

        <div className="date-input-section">
          <ChipDateInput
            label="Dates of last twenty-five thrombolytic administrations"
            placeholder="mm/dd/yyyy "
            onAddDate={(picked) => {
              const scrollY = window.scrollY;
              if (!form.thrombolytic_dates.includes(picked)) {
                if (form.thrombolytic_dates.length < 25) {
                  setForm((p) => {
                    const newDates = [...p.thrombolytic_dates, picked];
                    console.log("Step5 - Thrombolytic date added:", {
                      date: picked,
                      totalDates: newDates.length,
                      dates: newDates,
                    });
                    return {
                      ...p,
                      thrombolytic_dates: newDates,
                    };
                  });
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

        <div className="date-input-section-small">
          <ChipDateInput
            label="Dates of last fifteen thrombectomies"
            placeholder="mm/dd/yyyy "
            onAddDate={(picked) => {
              const scrollY = window.scrollY;
              if (!form.thrombectomy_dates.includes(picked)) {
                if (form.thrombectomy_dates.length < 15) {
                  setForm((p) => {
                    const newDates = [...p.thrombectomy_dates, picked];
                    console.log("Step5 - Thrombectomy date added:", {
                      date: picked,
                      totalDates: newDates.length,
                      dates: newDates,
                    });
                    return {
                      ...p,
                      thrombectomy_dates: newDates,
                    };
                  });
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
    </div>
  );
}
