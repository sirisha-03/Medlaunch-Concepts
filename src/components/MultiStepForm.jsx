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
    site_addMethod: "upload",
    site_uploadedFiles: [],

    svc_search: "",
    svc_selected: [],
    std_selected: [],
    std_expirationDate: "",
    std_applicationDate: "",
    thrombolytic_input: "",
    thrombolytic_dates: [],
    thrombectomy_input: "",
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

      // Step 3: copy from primary
      if (key === "ceo_sameAsPrimary" && value) {
        return {
          ...prev,
          ceo_sameAsPrimary: true,
          ceo_firstName: prev.firstName,
          ceo_lastName: prev.lastName,
          ceo_phone: prev.workPhone,
          ceo_email: prev.email,
        };
      }
      if (key === "quality_sameAsPrimary" && value) {
        return {
          ...prev,
          quality_sameAsPrimary: true,
          quality_firstName: prev.firstName,
          quality_lastName: prev.lastName,
          quality_phone: prev.workPhone,
          quality_email: prev.email,
        };
      }
      if (key === "invoicing_sameAsPrimary" && value) {
        return {
          ...prev,
          invoicing_sameAsPrimary: true,
          invoicing_firstName: prev.firstName,
          invoicing_lastName: prev.lastName,
          invoicing_phone: prev.workPhone,
          invoicing_email: prev.email,
        };
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
  const missingStep4 = !form.site_locationMode;
  const missingStep5 = form.svc_selected.length === 0;
  const missingStep6 = !form.ready_certify;

  const canContinue = useMemo(() => {
    if (step === 1) return !missingStep1;
    if (step === 2) return !missingStep2;
    if (step === 4) return !missingStep4;
    if (step === 5) return !missingStep5;
    if (step === 6) return !missingStep6;
    return true;
  }, [
    step,
    missingStep1,
    missingStep2,
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
    <div className="min-h-screen bg-slate-100">
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

      <main className="max-w-960px mx-auto px-6 py-10">
        {/* Title + Stepper */}
        <div className="flex flex-col items-start gap-4">
          <div className="w-full flex items-center justify-between">
            <h1 className="page-title">{pageTitle}</h1>
            <div className="text-sm text-slate-600">Step {step} of 6</div>
          </div>

          <div className="w-full" style={{ maxWidth: "960px" }}>
            <div
              className="flex items-start"
              style={{
                width: "100%",
                maxWidth: "960px",
                height: "31px",
                justifyContent: "space-between",
                paddingRight: "0px",
                gap: "6px",
                paddingTop: "16px",
                paddingBottom: "16px",
                borderRadius: "8px",
              }}
            >
              {STEPS.map((label, idx) => {
                const i = idx + 1;
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <div key={label} className="flex-1 min-w-0">
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
                        "mt-2 text-11px text-center truncate " +
                        (isActive
                          ? "text-slate-800 font-medium"
                          : "text-slate-500")
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
        <div className="mt-10 flex justify-center">
          {step === 5 ? (
            <div className="w-full max-w-960px">
              <Step5 form={form} setForm={setForm} />
            </div>
          ) : (
            <div className="card">
              {step === 1 ? <Step1 form={form} setField={setField} /> : null}
              {step === 2 ? <Step2 form={form} setField={setField} /> : null}
              {step === 3 ? <Step3 form={form} setField={setField} /> : null}
              {step === 4 ? <Step4 form={form} setForm={setForm} /> : null}
              {step === 6 ? <Step6 form={form} setForm={setForm} /> : null}
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="w-full max-w-961px mx-auto mt-10 flex items-center justify-between">
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
            <div className="flex items-center gap-6">
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
        <div className="max-w-4xl mx-auto mt-6 text-center">
          <div className="inline-flex rounded-full border border-slate-300 bg-white p-1 text-xs">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                className={
                  "px-3 py-1 rounded-full " +
                  (n === step
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100")
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
