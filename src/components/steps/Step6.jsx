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

  const Section = ({ children, className = "" }) => (
    <div className={"rounded-md border border-slate-200 bg-white " + className}>
      {children}
    </div>
  );

  const Toggle = ({ id, title }) => (
    <button
      type="button"
      className="w-full flex items-center justify-between rounded-t-md text-sm font-semibold text-white"
      style={{
        backgroundColor: "#0056A3",
        paddingTop: "12px",
        paddingBottom: "12px",
        paddingLeft: "24px",
        paddingRight: "24px",
        borderBottom: "1px solid #EBEBEB",
      }}
      onClick={() => setOpen((p) => ({ ...p, [id]: !p[id] }))}
    >
      <span className="flex items-center gap-2">
        <span
          className={
            "inline-block transition-transform " + (open[id] ? "rotate-90" : "")
          }
        >
          ›
        </span>
        {title}
      </span>
      <span className="text-xs font-medium text-white/90">Edit</span>
    </button>
  );

  const Row = ({ label, children }) => (
    <div
      className="text-xs"
      style={{
        paddingTop: "8px",
        paddingBottom: "8px",
        borderBottom: "1px solid #EBEBEB",
      }}
    >
      <div className="flex items-start gap-6">
        <div
          className="text-slate-500"
          style={{ width: "200px", minHeight: "19px" }}
        >
          {label}
        </div>
        <div className="text-slate-800" style={{ flex: 1, minHeight: "19px" }}>
          {children}
        </div>
      </div>
    </div>
  );

  const ValueText = ({ value, className }) => (
    <span className={className}>{value ? value : "-"}</span>
  );

  const InfoCard = ({ title, lines = [] }) => (
    <div
      className="w-full rounded-md"
      style={{
        backgroundColor: "#F6F6F6",
        paddingTop: "16px",
        paddingBottom: "16px",
        paddingLeft: "24px",
        paddingRight: "24px",
        fontFamily: "Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont",
        fontSize: "16px",
        lineHeight: "24px",
      }}
    >
      {title ? (
        <div
          className="mb-1"
          style={{
            fontFamily:
              "Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont",
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: "19px",
            color: "#707070",
          }}
        >
          {title}
        </div>
      ) : null}
      {lines.filter(Boolean).length ? (
        lines.filter(Boolean).map((l, i) => (
          <div key={i} className="text-black font-medium">
            {l}
          </div>
        ))
      ) : (
        <div className="text-slate-500">-</div>
      )}
    </div>
  );

  const Chip = ({ text }) => <span className="chip">{text}</span>;

  // Optional: if you have real parsed locations, render them here.
  // For now, this follows your current "uploaded files" model.
  const hasFiles =
    Array.isArray(form.site_uploadedFiles) && form.site_uploadedFiles.length;

  return (
    <div>
      <div className="text-sm font-semibold text-slate-800 mb-4">
        Hospital Information
      </div>

      {/* BASIC */}
      <Section className="mb-4">
        <Toggle id="basic" title="Basic Information" />
        {open.basic ? (
          <div className="px-5 py-4">
            <Row label="Legal Entity Name">
              <ValueText value={form.legalEntityName} />
            </Row>
            <Row label="d/b/a Name">
              <ValueText value={form.dbaName} />
            </Row>

            <Row label="Primary Contact">
              <InfoCard
                title={
                  `${form.firstName || ""} ${form.lastName || ""}`.trim() || "-"
                }
                lines={[
                  form.title,
                  form.workPhone ? `Work: ${form.workPhone}` : "",
                  form.cellPhone ? `Mobile: ${form.cellPhone}` : "",
                  form.email ? `Email: ${form.email}` : "",
                  form.street || form.city || form.state || form.zip
                    ? `Address: ${(form.street || "").trim()} ${(
                        form.city || ""
                      ).trim()}, ${(form.state || "").trim()} ${(
                        form.zip || ""
                      ).trim()}`
                        .replace(/\s+/g, " ")
                        .trim()
                    : "",
                ]}
              />
            </Row>
          </div>
        ) : null}
      </Section>

      {/* FACILITY */}
      <Section className="mb-4">
        <Toggle id="facility" title="Facility Details" />
        {open.facility ? (
          <div className="px-5 py-4">
            <Row
              label={
                <span
                  style={{
                    fontFamily:
                      "Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont",
                    fontSize: "14px",
                    fontWeight: 700,
                    lineHeight: "19px",
                    color: "#707070",
                  }}
                >
                  Facility Type
                </span>
              }
            >
              <ValueText value={form.facilityType} className="text-black" />
            </Row>
          </div>
        ) : null}
      </Section>

      {/* LEADERSHIP */}
      <Section className="mb-4">
        <Toggle id="leadership" title="Leadership Contacts" />
        {open.leadership ? (
          <div className="px-5 py-4 space-y-2">
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
                  form.invoicing_title ? `Title: ${form.invoicing_title}` : "",
                  form.invoicing_phone ? `Phone: ${form.invoicing_phone}` : "",
                  form.invoicing_email ? `Email: ${form.invoicing_email}` : "",
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

      {/* SITE */}
      <Section className="mb-4">
        <Toggle id="site" title="Site Information" />
        {open.site ? (
          <div className="px-5 py-4">
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

            {/* If you later have parsed locations, replace this with your real array */}
            {Array.isArray(form.site_locations) &&
            form.site_locations.length ? (
              <Row label="">
                <div className="space-y-2">
                  {form.site_locations.map((loc, idx) => (
                    <InfoCard
                      key={idx}
                      title={`Practice Location ${idx + 1}`}
                      lines={[
                        loc.addressLine1,
                        loc.addressLine2,
                        loc.fte ? `FTE: ${loc.fte}` : "",
                        loc.sites ? `Sites: ${loc.sites}` : "",
                        loc.daysOpen ? `Days Open: ${loc.daysOpen}` : "",
                      ]}
                    />
                  ))}
                </div>
              </Row>
            ) : null}
          </div>
        ) : null}
      </Section>

      {/* SERVICES */}
      <Section className="mb-6">
        <Toggle id="services" title="Services & Certifications" />
        {open.services ? (
          <div className="px-5 py-4 space-y-2">
            <Row label="Services Provided">
              <div className="flex flex-wrap gap-2">
                {(form.svc_selected.length ? form.svc_selected : ["-"]).map(
                  (s, i) => (
                    <Chip key={i} text={s} />
                  )
                )}
              </div>
            </Row>

            <Row label="Standards to Apply">
              <div className="flex flex-wrap gap-2">
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
                className="text-link-blue"
                value={
                  form.thrombolytic_dates.length
                    ? form.thrombolytic_dates.join(", ")
                    : "-"
                }
              />
            </Row>

            <Row label="Dates of last 15 thrombectomies">
              <ValueText
                className="text-link-blue"
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

      {/* READY TO SUBMIT */}
      <Section>
        <div className="px-5 py-4">
          <div className="text-sm font-semibold text-slate-800">
            Ready to Submit?
          </div>

          <label className="mt-3 flex items-start gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              className="checkbox mt-0.5"
              checked={form.ready_certify}
              onChange={(e) =>
                setForm((p) => ({ ...p, ready_certify: e.target.checked }))
              }
            />
            I certify that all information provided is accurate and complete to
            the best of my knowledge
          </label>

          <div className="mt-4 text-11px text-slate-500">
            By submitting this form, you agree to our terms and conditions. DNV
            will review your application and contact you within 2–3 business
            days.
          </div>

          <div className="mt-4 flex items-center gap-3">
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
  );
}
