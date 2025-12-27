import React, { useMemo, useState } from "react";
import "../styles/styles.css";
import { STEPS } from "../utils/constants";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { Step4 } from "./steps/Step4";
import { Step5 } from "./steps/Step5";
import { Step6 } from "./steps/Step6";
import { SupportChat } from "./shared/SupportChat";

/**
 * NOTE ABOUT DATE PICKERS IN THIS PREVIEW
 * This preview may run inside a cross-origin iframe.
 * Calling `HTMLInputElement.showPicker()` can throw a SecurityError in such environments.
 * So we DO NOT call showPicker(). We rely on real <input type="date"> plus a clickable label/overlay.
 */

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    legalEntityName: "",
    dbaName: "",
    sameAsLegal: false,
    firstName: "",
    lastName: "",
    title: "",
    workPhone: "",
    cellPhone: "",
    email: "",
    emailVerified: false,

    facilityType: "",

    ceo_sameAsPrimary: false,
    ceo_firstName: "",
    ceo_lastName: "",
    ceo_phone: "",
    ceo_email: "",

    quality_sameAsPrimary: false,
    quality_firstName: "",
    quality_lastName: "",
    quality_phone: "",
    quality_email: "",

    invoicing_sameAsPrimary: false,
    invoicing_firstName: "",
    invoicing_lastName: "",
    invoicing_phone: "",
    invoicing_email: "",

    billing_street: "",
    billing_city: "",
    billing_state: "",
    billing_zip: "",

    site_locationMode: "",
    site_uploadedFiles: [],

    svc_search: "",
    svc_selected: [],
    std_selected: [],
    std_expirationDate: "",
    std_applicationDate: "",
    thrombolytic_dates: [],
    thrombectomy_dates: [],

    ready_certify: false,
  });

  const setField = (key) => (e) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    setForm((prev) => {
      // Step 1: same-as legal
      if (key === "sameAsLegal") {
        return {
          ...prev,
          sameAsLegal: !!value,
          dbaName: value ? prev.legalEntityName : prev.dbaName,
        };
      }
      if (key === "legalEntityName" && prev.sameAsLegal) {
        return {
          ...prev,
          legalEntityName: String(value),
          dbaName: String(value),
        };
      }

      // Step 3: copy from primary or clear when unchecked
      if (key === "ceo_sameAsPrimary") {
        if (value) {
          // Checked: Copy from primary contact
          return {
            ...prev,
            ceo_sameAsPrimary: true,
            ceo_firstName: prev.firstName,
            ceo_lastName: prev.lastName,
            ceo_phone: prev.workPhone,
            ceo_email: prev.email,
          };
        } else {
          // Unchecked: Clear the values
          return {
            ...prev,
            ceo_sameAsPrimary: false,
            ceo_firstName: "",
            ceo_lastName: "",
            ceo_phone: "",
            ceo_email: "",
          };
        }
      }
      if (key === "quality_sameAsPrimary") {
        if (value) {
          // Checked: Copy from primary contact
          return {
            ...prev,
            quality_sameAsPrimary: true,
            quality_firstName: prev.firstName,
            quality_lastName: prev.lastName,
            quality_phone: prev.workPhone,
            quality_email: prev.email,
          };
        } else {
          // Unchecked: Clear the values
          return {
            ...prev,
            quality_sameAsPrimary: false,
            quality_firstName: "",
            quality_lastName: "",
            quality_phone: "",
            quality_email: "",
          };
        }
      }
      if (key === "invoicing_sameAsPrimary") {
        if (value) {
          // Checked: Copy from primary contact
          return {
            ...prev,
            invoicing_sameAsPrimary: true,
            invoicing_firstName: prev.firstName,
            invoicing_lastName: prev.lastName,
            invoicing_phone: prev.workPhone,
            invoicing_email: prev.email,
          };
        } else {
          // Unchecked: Clear the values
          return {
            ...prev,
            invoicing_sameAsPrimary: false,
            invoicing_firstName: "",
            invoicing_lastName: "",
            invoicing_phone: "",
            invoicing_email: "",
          };
        }
      }

      return { ...prev, [key]: value };
    });
  };

  // Required checks
  const missingStep1 =
    !form.legalEntityName ||
    !form.dbaName ||
    !form.firstName ||
    !form.lastName ||
    !form.title ||
    !form.workPhone ||
    !form.email;

  const missingStep2 = !form.facilityType;
  const missingStep3 =
    !form.ceo_firstName ||
    !form.ceo_lastName ||
    !form.ceo_phone ||
    !form.ceo_email ||
    !form.invoicing_firstName ||
    !form.invoicing_lastName ||
    !form.invoicing_phone ||
    !form.invoicing_email ||
    !form.billing_street ||
    !form.billing_city ||
    !form.billing_state ||
    !form.billing_zip;
  const missingStep4 = !form.site_locationMode;
  const missingStep5 = form.svc_selected.length === 0;
  const missingStep6 = !form.ready_certify;

  const canContinue = useMemo(() => {
    if (step === 1) return !missingStep1;
    if (step === 2) return !missingStep2;
    if (step === 3) return !missingStep3;
    if (step === 4) return !missingStep4;
    if (step === 5) return !missingStep5;
    if (step === 6) return !missingStep6;
    return true;
  }, [
    step,
    missingStep1,
    missingStep2,
    missingStep3,
    missingStep4,
    missingStep5,
    missingStep6,
  ]);

  const pageTitle =
    step === 1
      ? "New DNV Quote Request"
      : step === 2
      ? "Facility Details"
      : step === 3
      ? "Leadership Contacts"
      : step === 4
      ? "Site Information"
      : step === 5
      ? "Services & Certifications"
      : "Review & Submit";

  const onSave = () => {
    console.log("Saved:", form);
    alert("Saved (mock). Check console.");
  };

  const onContinue = () => {
    if (!canContinue) {
      alert("Please complete required fields (*) before continuing.");
      return;
    }
    setStep((s) => Math.min(6, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPrevious = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const onExit = () => alert("Exit (mock)");

  const onSubmit = () => {
    if (!form.ready_certify) {
      alert("Please confirm the certification checkbox before submitting.");
      return;
    }
    // Log form payload to console as required
    console.log("Form Submission Payload:", JSON.stringify(form, null, 2));
    alert("Submit Application (mock). Check console for payload.");
  };

  return (
    <div className="app-container">
      {/* Top bar */}
      <header className="header header-with-user">
        <div className="header-container">
          <div className="header-title">DNV Healthcare</div>
          <div className="header-user">
            <div className="user-avatar">KM</div>
            <span className="user-name">Katherine Martinez</span>
          </div>
        </div>
      </header>

      <main className="main-container">
        {/* Title + Stepper */}
        <div className="step-indicator-container">
          <div className="step-header">
            <h1 className="section-title-large">{pageTitle}</h1>
            <div className="step-counter">Step {step} of 6</div>
          </div>

          <div style={{ maxWidth: "960px", width: "100%" }}>
            <div className="step-bar-container">
              {STEPS.map((label, idx) => {
                const i = idx + 1;
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <div key={label} className="step-bar-item">
                    <div
                      className={
                        "step-bar " +
                        (isActive
                          ? "step-bar-active"
                          : isDone
                          ? "step-bar-done"
                          : "step-bar-inactive")
                      }
                    />
                    <div
                      className={
                        "step-label " +
                        (isActive ? "step-label-active" : "step-label-inactive")
                      }
                      title={label}
                    >
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content-wrapper">
          <div className="card">
            {step === 1 ? <Step1 form={form} setField={setField} /> : null}
            {step === 2 ? <Step2 form={form} setField={setField} /> : null}
            {step === 3 ? <Step3 form={form} setField={setField} /> : null}
            {step === 4 ? <Step4 form={form} setForm={setForm} /> : null}
            {step === 5 ? <Step5 form={form} setForm={setForm} /> : null}
            {step === 6 ? <Step6 form={form} setForm={setForm} /> : null}
          </div>
        </div>

        {/* Bottom actions */}
        <div className="action-buttons-wrapper">
          {step === 1 ? (
            <button type="button" className="btn-exit" onClick={onExit}>
              Exit
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline"
              onClick={onPrevious}
            >
              Previous
            </button>
          )}

          {step === 6 ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onSubmit}
              disabled={!form.ready_certify}
            >
              Submit Application
            </button>
          ) : (
            <div className="action-buttons-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onSave}
              >
                Save
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onContinue}
                disabled={!canContinue}
                title={
                  !canContinue ? "Complete required fields (*)" : "Continue"
                }
              >
                Continue
              </button>
            </div>
          )}
        </div>

        {/* Step jump helper (preview only) */}
        <div className="step-jump-container">
          <div className="step-jump-wrapper">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                className={
                  "step-jump-button " +
                  (n === step
                    ? "step-jump-button-active"
                    : "step-jump-button-inactive")
                }
                onClick={() => {
                  setStep(n);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* ONE Support Chat button for ALL pages */}
      <SupportChat />
    </div>
  );
}
