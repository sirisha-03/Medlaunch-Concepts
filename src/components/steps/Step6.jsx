import React, { useState } from "react";
import { isoToDDMMYYYY } from "../../utils/helpers";

export function Step6({ form, setForm }) {
  const [open, setOpen] = useState({
    basic: true,
    facility: true,
    leadership: true,
    site: true,
    services: true,
  });

  // Log form data when Step6 loads
  console.log("Step6 - Review page loaded with form data:", {
    basicInfo: {
      legalEntityName: form.legalEntityName,
      dbaName: form.dbaName,
      primaryContact: {
        name: `${form.firstName || ""} ${form.lastName || ""}`.trim(),
        title: form.title,
        workPhone: form.workPhone,
        cellPhone: form.cellPhone,
        email: form.email,
      },
    },
    facilityType: form.facilityType,
    leadershipContacts: {
      ceo: {
        name: `${form.ceo_firstName || ""} ${form.ceo_lastName || ""}`.trim(),
        phone: form.ceo_phone,
        email: form.ceo_email,
      },
      quality: {
        name: `${form.quality_firstName || ""} ${
          form.quality_lastName || ""
        }`.trim(),
        phone: form.quality_phone,
        email: form.quality_email,
      },
      invoicing: {
        name: `${form.invoicing_firstName || ""} ${
          form.invoicing_lastName || ""
        }`.trim(),
        phone: form.invoicing_phone,
        email: form.invoicing_email,
        billingAddress: {
          street: form.billing_street,
          city: form.billing_city,
          state: form.billing_state,
          zip: form.billing_zip,
        },
      },
    },
    siteInfo: {
      locationMode: form.site_locationMode,
      uploadedFiles: form.site_uploadedFiles,
    },
    services: {
      selected: form.svc_selected,
      standards: form.std_selected,
      expirationDate: form.std_expirationDate,
      applicationDate: form.std_applicationDate,
      thrombolyticDates: form.thrombolytic_dates,
      thrombectomyDates: form.thrombectomy_dates,
    },
    readyToSubmit: form.ready_certify,
  });

  const Section = ({ children, className = "" }) => (
    <div className={"review-section " + className}>{children}</div>
  );

  const Toggle = ({ id, title }) => (
    <button
      type="button"
      className="review-toggle-button"
      onClick={() => {
        setOpen((p) => {
          const newState = { ...p, [id]: !p[id] };
          console.log("Step6 - Section toggled:", {
            section: title,
            sectionId: id,
            isOpen: newState[id],
          });
          return newState;
        });
      }}
    >
      <span className="review-toggle-content">
        <span
          className={
            "review-toggle-arrow " +
            (open[id] ? "review-toggle-arrow-open" : "")
          }
        >
          ›
        </span>
        {title}
      </span>
      <span className="review-edit-text">Edit</span>
    </button>
  );

  const Row = ({ label, children }) => (
    <div className="review-row">
      <div className="review-row-content">
        <div className="review-row-label">{label}</div>
        <div className="review-row-value">{children}</div>
      </div>
    </div>
  );

  const ValueText = ({ value, className }) => (
    <span className={className}>{value ? value : "-"}</span>
  );

  const InfoCard = ({ title, lines = [] }) => (
    <div className="review-info-card">
      {title ? <div className="review-info-card-title">{title}</div> : null}
      {lines.filter(Boolean).length ? (
        lines.filter(Boolean).map((l, i) => (
          <div key={i} className="review-info-card-line">
            {l}
          </div>
        ))
      ) : (
        <div className="review-info-card-empty">-</div>
      )}
    </div>
  );

  const Chip = ({ text }) => <span className="chip">{text}</span>;

  const hasFiles =
    Array.isArray(form.site_uploadedFiles) && form.site_uploadedFiles.length;

  return (
    <div>
      {/* 1. Title Container */}
      <div className="step6-title-container">
        <div className="review-page-header">Hospital Information</div>
      </div>

      {/* 2. Basic Information Container */}
      <div className="step6-basic-container">
        <Section>
          <Toggle id="basic" title="Basic Information" />
          {open.basic ? (
            <div className="review-section-content">
              <Row label="Legal Entity Name">
                <ValueText value={form.legalEntityName} />
              </Row>
              <Row label="d/b/a Name">
                <ValueText value={form.dbaName} />
              </Row>

              <Row label="Primary Contact">
                <InfoCard
                  title={
                    `${form.firstName || ""} ${form.lastName || ""}`.trim() ||
                    "-"
                  }
                  lines={[
                    form.title,
                    form.workPhone ? `Work: ${form.workPhone}` : "",
                    form.cellPhone ? `Mobile: ${form.cellPhone}` : "",
                    form.email ? `Email: ${form.email}` : "",
                  ]}
                />
              </Row>
            </div>
          ) : null}
        </Section>
      </div>

      {/* 3. Facility Details Container */}
      <div className="step6-facility-container">
        <Section>
          <Toggle id="facility" title="Facility Details" />
          {open.facility ? (
            <div className="review-section-content">
              <Row
                label={
                  <span className="review-row-label-bold">Facility Type</span>
                }
              >
                <ValueText
                  value={form.facilityType}
                  className="review-row-value-black"
                />
              </Row>
            </div>
          ) : null}
        </Section>
      </div>

      {/* 4. Leadership Container */}
      <div className="step6-leadership-container">
        <Section>
          <Toggle id="leadership" title="Leadership Contacts" />
          {open.leadership ? (
            <div className="review-section-content review-section-spaced">
              <Row label="CEO">
                <InfoCard
                  title={`${form.ceo_firstName || ""} ${
                    form.ceo_lastName || ""
                  }`.trim()}
                  lines={[
                    form.ceo_phone ? `Phone: ${form.ceo_phone}` : "",
                    form.ceo_email ? `Email: ${form.ceo_email}` : "",
                  ]}
                />
              </Row>

              <Row label="Director of Quality">
                <InfoCard
                  title={`${form.quality_firstName || ""} ${
                    form.quality_lastName || ""
                  }`.trim()}
                  lines={[
                    form.quality_phone ? `Phone: ${form.quality_phone}` : "",
                    form.quality_email ? `Email: ${form.quality_email}` : "",
                  ]}
                />
              </Row>

              <Row label="Invoicing Contact">
                <InfoCard
                  title={`${form.invoicing_firstName || ""} ${
                    form.invoicing_lastName || ""
                  }`.trim()}
                  lines={[
                    form.invoicing_phone
                      ? `Phone: ${form.invoicing_phone}`
                      : "",
                    form.invoicing_email
                      ? `Email: ${form.invoicing_email}`
                      : "",
                    form.billing_street ||
                    form.billing_city ||
                    form.billing_state ||
                    form.billing_zip
                      ? `Billing Address: ${(
                          form.billing_street || ""
                        ).trim()} ${(form.billing_city || "").trim()}, ${(
                          form.billing_state || ""
                        ).trim()} ${(form.billing_zip || "").trim()}`
                          .replace(/\s+/g, " ")
                          .trim()
                      : "",
                  ]}
                />
              </Row>
            </div>
          ) : null}
        </Section>
      </div>

      {/* 5. Site Info Container */}
      <div className="step6-site-container">
        <Section>
          <Toggle id="site" title="Site Information" />
          {open.site ? (
            <div className="review-section-content">
              <Row label="Site Configuration">
                <ValueText
                  value={
                    form.site_locationMode === "multiple"
                      ? hasFiles
                        ? `Multiple Locations (${form.site_uploadedFiles.length} sites)`
                        : "Multiple Locations"
                      : form.site_locationMode === "single"
                      ? "Single Location"
                      : ""
                  }
                />
              </Row>

              <Row label="Input Method">
                <ValueText
                  value={
                    form.site_locationMode === "multiple" ? "File Upload" : "-"
                  }
                />
              </Row>

              <Row label="Uploaded Files">
                <ValueText
                  value={
                    hasFiles
                      ? form.site_uploadedFiles.map((f) => f.name).join(", ")
                      : "-"
                  }
                />
              </Row>
            </div>
          ) : null}
        </Section>
      </div>

      {/* 6. Service Container */}
      <div className="step6-service-container">
        <Section>
          <Toggle id="services" title="Services & Certifications" />
          {open.services ? (
            <div className="review-section-content review-section-spaced">
              <Row label="Services Provided">
                <div className="review-chips-container">
                  {(form.svc_selected.length ? form.svc_selected : ["-"]).map(
                    (s, i) => (
                      <Chip key={i} text={s} />
                    )
                  )}
                </div>
              </Row>

              <Row label="Standards to Apply">
                <div className="review-chips-container">
                  {(form.std_selected.length ? form.std_selected : ["-"]).map(
                    (s, i) => (
                      <Chip key={i} text={s} />
                    )
                  )}
                </div>
              </Row>

              <Row label="Date of Application">
                <ValueText
                  value={
                    form.std_applicationDate
                      ? isoToDDMMYYYY(form.std_applicationDate)
                      : "-"
                  }
                />
              </Row>

              <Row label="Expiration Date of Current Stroke Certification">
                <ValueText
                  value={
                    form.std_expirationDate
                      ? isoToDDMMYYYY(form.std_expirationDate)
                      : "-"
                  }
                />
              </Row>

              <Row label="Dates of last 25 thrombolytic administrations">
                <ValueText
                  className="review-value-link"
                  value={
                    form.thrombolytic_dates.length
                      ? form.thrombolytic_dates.join(", ")
                      : "-"
                  }
                />
              </Row>

              <Row label="Dates of last 15 thrombectomies">
                <ValueText
                  className="review-value-link"
                  value={
                    form.thrombectomy_dates.length
                      ? form.thrombectomy_dates.join(", ")
                      : "-"
                  }
                />
              </Row>
            </div>
          ) : null}
        </Section>
      </div>

      {/* 7. Ready to Submit Container */}
      <div className="step6-submit-container">
        <Section>
          <div className="review-certify-section">
            <div className="review-certify-title">Ready to Submit?</div>

            <label className="review-certify-checkbox">
              <input
                type="checkbox"
                className="checkbox"
                checked={form.ready_certify}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  console.log("Step6 - Certification checkbox:", {
                    checked: isChecked,
                    readyToSubmit: isChecked,
                  });
                  setForm((p) => ({ ...p, ready_certify: isChecked }));
                }}
              />
              I certify that all information provided is accurate and complete
              to the best of my knowledge
            </label>

            <div className="review-certify-disclaimer">
              By submitting this form, you agree to our terms and conditions.
              DNV will review your application and contact you within 2–3
              business days.
            </div>

            <div className="review-certify-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => alert("Download as PDF (mock)")}
              >
                Download as PDF
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => alert("Export to CSV (mock)")}
              >
                Export to CSV
              </button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
