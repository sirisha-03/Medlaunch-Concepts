import React, { useId, useMemo, useState } from "react";

/**
 * NOTE ABOUT DATE PICKERS IN THIS PREVIEW
 * This preview may run inside a cross-origin iframe.
 * Calling `HTMLInputElement.showPicker()` can throw a SecurityError in such environments.
 * So we DO NOT call showPicker(). We rely on real <input type="date"> plus a clickable label/overlay.
 */

const STEPS = [
  "DNV Quote Request",
  "Facility Details",
  "Leadership Contacts",
  "Site Information",
  "Services & Certifications",
  "Review & Submit",
];

// ---------- Small helpers (and minimal "self tests") ----------
function isoToUS(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
}

function formatBytes(bytes: number) {
  if (bytes === null || bytes === undefined) return "";
  const units = ["B", "KB", "MB", "GB"];
  let b = bytes;
  let i = 0;
  while (b >= 1024 && i < units.length - 1) {
    b /= 1024;
    i += 1;
  }
  return `${b.toFixed(i === 0 ? 0 : 1)}${units[i]}`;
}

(function runSelfTests() {
  try {
    const t1 = isoToUS("2025-01-31") === "01/31/2025";
    const t2 = formatBytes(0) === "0B";
    const t3 = formatBytes(1024) === "1.0KB";
    const t4 = STEPS.length === 6;
    if (!t1 || !t2 || !t3 || !t4) {
      // eslint-disable-next-line no-console
      console.warn("Self-tests failed:", { t1, t2, t3, t4 });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Self-tests threw:", e);
  }
})();

// ---------- Types ----------
type UploadedFile = { name: string; size: number };

type FormState = {
  // Step 1
  legalEntityName: string;
  dbaName: string;
  sameAsLegal: boolean;
  firstName: string;
  lastName: string;
  title: string;
  workPhone: string;
  cellPhone: string;
  email: string;
  emailVerified: boolean;

  // Step 2
  facilityType: string;

  // Step 3
  ceo_sameAsPrimary: boolean;
  ceo_firstName: string;
  ceo_lastName: string;
  ceo_phone: string;
  ceo_email: string;

  quality_sameAsPrimary: boolean;
  quality_firstName: string;
  quality_lastName: string;
  quality_phone: string;
  quality_email: string;

  invoicing_sameAsPrimary: boolean;
  invoicing_firstName: string;
  invoicing_lastName: string;
  invoicing_phone: string;
  invoicing_email: string;

  billing_street: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;

  // Step 4
  site_locationMode: "" | "single" | "multiple";
  site_addMethod: "upload";
  site_uploadedFiles: UploadedFile[];

  // Step 5
  svc_search: string;
  svc_selected: string[];
  std_selected: string[];
  std_expirationDate: string; // ISO
  std_applicationDate: string; // ISO
  thrombolytic_input: string;
  thrombolytic_dates: string[]; // mm/dd/yyyy
  thrombectomy_input: string;
  thrombectomy_dates: string[]; // mm/dd/yyyy

  // Step 6
  ready_certify: boolean;
};

export default function DnvQuoteRequestPreview() {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<FormState>({
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

  const setField =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = e.target as HTMLInputElement;
      const value: any = target.type === "checkbox" ? target.checked : target.value;

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
          return { ...prev, legalEntityName: String(value), dbaName: String(value) };
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
  }, [step, missingStep1, missingStep2, missingStep4, missingStep5, missingStep6]);

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
    // eslint-disable-next-line no-console
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
    alert("Submit Application (mock)");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <header className="h-16 bg-[#143E73] text-white flex items-center justify-center px-6">
        <div className="text-xl font-semibold tracking-wide">DNV Healthcare</div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Title + Stepper */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-semibold text-slate-800">{pageTitle}</h1>

          <div className="w-full max-w-4xl">
            <div className="flex items-center justify-end mb-2">
              <div className="text-sm text-slate-600">Step {step} of 6</div>
            </div>

            <div className="flex items-start gap-3">
              {STEPS.map((label, idx) => {
                const i = idx + 1;
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <div key={label} className="flex-1 min-w-0">
                    <div
                      className={
                        "h-2 rounded-full " +
                        (isActive
                          ? "bg-[#1E5AA8]"
                          : isDone
                          ? "bg-[#1E5AA8]/50"
                          : "bg-slate-300")
                      }
                    />
                    <div
                      className={
                        "mt-2 text-[11px] text-center truncate " +
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
            <div className="w-full max-w-[960px]">
              <Step5 form={form} setForm={setForm} />
            </div>
          ) : (
            <div className="w-full max-w-[960px] bg-white rounded-[8px] px-8 pt-10 pb-16 shadow-[0_1px_5px_rgba(0,0,0,0.10)] flex flex-col gap-16">
              {step === 1 ? <Step1 form={form} setField={setField} /> : null}
              {step === 2 ? <Step2 form={form} setField={setField} /> : null}
              {step === 3 ? <Step3 form={form} setField={setField} /> : null}
              {step === 4 ? <Step4 form={form} setForm={setForm} /> : null}
              {step === 6 ? <Step6 form={form} setForm={setForm} /> : null}
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="w-full max-w-[961px] mx-auto mt-10 flex items-center justify-between">
          {step === 1 ? (
            <button
              type="button"
              className="h-12 inline-flex items-center justify-center rounded-[8px] bg-[#1E5AA8] px-8 py-[18px] text-sm font-semibold text-white border-[1.5px] border-[#1E5AA8] hover:opacity-95"
              onClick={onExit}
            >
              Exit
            </button>
          ) : (
            <button
              type="button"
              className="h-12 rounded-md border border-[#1E5AA8] bg-white px-10 text-sm font-semibold text-[#1E5AA8] hover:bg-blue-50"
              onClick={onPrevious}
            >
              Previous
            </button>
          )}

          {step === 6 ? (
            <button
              type="button"
              className="h-12 rounded-md bg-[#123D7A] px-10 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
              onClick={onSubmit}
              disabled={!form.ready_certify}
            >
              Submit Application
            </button>
          ) : (
            <div className="flex items-center gap-6">
              <button
                type="button"
                className="h-12 rounded-md bg-[#1E5AA8] px-10 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                onClick={onSave}
              >
                Save
              </button>

              <button
                type="button"
                className="h-12 rounded-md bg-[#123D7A] px-10 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
                onClick={onContinue}
                disabled={!canContinue}
                title={!canContinue ? "Complete required fields (*)" : "Continue"}
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

function SupportChat() {
  return (
    <button
      type="button"
      className="fixed bottom-8 right-8 inline-flex items-center gap-2 rounded-full bg-[#123D7A] px-8 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-95"
      onClick={() => alert("Support Chat (mock)")}
    >
      <span className="inline-block h-4 w-4 rounded-full bg-white/20" />
      Support Chat
    </button>
  );
}

// ---------- Step 1 ----------
function Step1({
  form,
  setField,
}: {
  form: FormState;
  setField: (k: keyof FormState) => any;
}) {
  const sendVerification = () =>
    alert(`Verification email sent to: ${form.email}`);

  return (
    <div>
      <section>
        <h2 className="text-xl font-semibold text-slate-800">
          Identify Healthcare Organization
        </h2>

        <div className="mt-6 space-y-5">
          <Field
            label="Legal Entity Name"
            required
            value={form.legalEntityName}
            onChange={setField("legalEntityName")}
          />

          <Field
            label="Doing Business As (d/b/a) Name"
            required
            value={form.dbaName}
            onChange={setField("dbaName")}
            disabled={form.sameAsLegal}
          />

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={form.sameAsLegal}
              onChange={setField("sameAsLegal")}
            />
            Same as Legal Entity Name
          </label>
        </div>
      </section>

      <hr className="my-10 border-slate-200" />

      <section>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Primary Contact Information
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Primary contact receives all DNV Healthcare official communications
            </p>
          </div>
        </div>

        <div className="mt-7 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="First Name"
              required
              value={form.firstName}
              onChange={setField("firstName")}
            />
            <Field
              label="Last Name"
              required
              value={form.lastName}
              onChange={setField("lastName")}
            />
          </div>

          <Field
            label="Title"
            required
            value={form.title}
            onChange={setField("title")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Work Phone"
              required
              value={form.workPhone}
              onChange={setField("workPhone")}
              placeholder="(###) ###-####"
            />
            <Field
              label="Cell Phone"
              value={form.cellPhone}
              onChange={setField("cellPhone")}
            />
          </div>

          <div className="relative">
            <Field
              label="Email"
              required
              value={form.email}
              onChange={setField("email")}
              placeholder="name@company.com"
            />
            <button
              type="button"
              className="absolute right-3 top-[42px] text-slate-400 hover:text-slate-600"
              onClick={() => alert("Refresh / validate email (mock)")}
              aria-label="Refresh"
              title="Refresh"
            >
              ↻
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-[#1E5AA8] px-4 py-2 text-sm font-semibold text-[#1E5AA8] hover:bg-blue-50 disabled:opacity-60"
              onClick={sendVerification}
              disabled={!form.email}
            >
              Send Verification Email
            </button>

            <span
              className={
                "text-xs px-3 py-1 rounded-full " +
                (form.emailVerified
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700")
              }
            >
              {form.emailVerified ? "Verified" : "Not verified"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------- Step 2 ----------
function Step2({
  form,
  setField,
}: {
  form: FormState;
  setField: (k: keyof FormState) => any;
}) {
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
                className="h-4 w-4 accent-[#1E5AA8]"
              />
              <span className="font-medium">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Step 3 ----------
function Step3({
  form,
  setField,
}: {
  form: FormState;
  setField: (k: keyof FormState) => any;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800">Contact Information</h2>

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

        <div className="rounded-[8px] border border-slate-200 bg-white p-[1px] overflow-hidden">
          <div className="px-6 py-5">
            <div className="text-sm font-semibold text-slate-800">Invoicing Contact</div>

            <label className="mt-3 flex items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
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
              <div className="text-sm font-semibold text-slate-800">Billing Address</div>

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

// ---------- Step 4 ----------
function Step4({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const isSingle = form.site_locationMode === "single";
  const isMultiple = form.site_locationMode === "multiple";

  const addFiles = (fileList: FileList | null) => {
    const files = Array.from(fileList || []).map((f) => ({
      name: f.name,
      size: f.size,
    }));
    setForm((p) => ({
      ...p,
      site_uploadedFiles: [...p.site_uploadedFiles, ...files],
    }));
  };

  const removeFile = (idx: number) =>
    setForm((p) => ({
      ...p,
      site_uploadedFiles: p.site_uploadedFiles.filter((_, i) => i !== idx),
    }));

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800">
        Do you have multiple sites or locations?
      </h2>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setForm((p) => ({ ...p, site_locationMode: "single" }))}
          className={
            "text-left rounded-lg border px-6 py-5 transition " +
            (isSingle
              ? "border-blue-400 bg-blue-50"
              : "border-slate-300 bg-white hover:bg-slate-50")
          }
        >
          <div className="text-sm font-semibold text-slate-800">Single Location</div>
          <div className="mt-1 text-xs text-slate-500">
            We operate from one facility only
          </div>
        </button>

        <button
          type="button"
          onClick={() => setForm((p) => ({ ...p, site_locationMode: "multiple" }))}
          className={
            "text-left rounded-lg border px-6 py-5 transition " +
            (isMultiple
              ? "border-blue-400 bg-blue-50"
              : "border-slate-300 bg-white hover:bg-slate-50")
          }
        >
          <div className="text-sm font-semibold text-slate-800">Multiple Locations</div>
          <div className="mt-1 text-xs text-slate-500">
            We have multiple facilities or practice locations
          </div>
        </button>
      </div>

      {isMultiple ? (
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-slate-800">
            How would you like to add your site information?
          </h3>

          <div className="mt-5 rounded-lg border border-blue-400 bg-blue-50 px-6 py-5">
            <div className="text-sm font-semibold text-slate-800">Upload CSV / Excel</div>
            <div className="mt-1 text-xs text-slate-500">
              Upload a spreadsheet with all site information
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-300 bg-blue-50 p-6">
            <div
              className="rounded-xl border-2 border-dashed border-blue-300 bg-white px-6 py-10 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
            >
              <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                ⤒
              </div>
              <div className="text-sm font-semibold text-slate-800">Upload Site Information</div>
              <div className="mt-1 text-xs text-slate-500">
                Drag and drop your CSV or Excel file here, or click to select
              </div>

              <div className="mt-5">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-md bg-[#123D7A] px-5 py-2 text-xs font-semibold text-white hover:opacity-95">
                  Select file
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => addFiles(e.target.files)}
                  />
                </label>
              </div>

              <button
                type="button"
                className="mt-3 text-xs font-medium text-[#1E5AA8] hover:underline"
                onClick={() => alert("Download CSV Template (mock)")}
              >
                Download CSV Template
              </button>
            </div>

            <div className="mt-6">
              <div className="text-sm font-semibold text-slate-800">Uploaded</div>

              <div className="mt-3 space-y-3">
                {form.site_uploadedFiles.length === 0 ? (
                  <div className="text-xs text-slate-500">No files uploaded yet.</div>
                ) : (
                  form.site_uploadedFiles.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-500">
                          📄
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-800">
                            {f.name} <span className="text-xs text-slate-400">·</span>{" "}
                            <button
                              type="button"
                              className="text-sm font-medium text-[#1E5AA8] hover:underline"
                              onClick={() => alert("Preview (mock)")}
                            >
                              Preview
                            </button>
                          </div>
                          <div className="text-xs text-slate-500">{formatBytes(f.size)}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="h-7 w-7 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
                        onClick={() => removeFile(idx)}
                        aria-label="Remove"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ---------- Step 5 (two separate cards like your screenshot) ----------
function Step5({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const CardShell = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full bg-white rounded-[8px] px-8 pt-10 pb-16 shadow-[0_1px_5px_rgba(0,0,0,0.10)] flex flex-col gap-16">
      {children}
    </div>
  );

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
    { title: "Cardiac Services", items: ["Cardiac Catheterization Laboratory", "Open Heart"] },
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

  const toggleService = (svc: string) => {
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

  const addStandard = (val: string) => {
    if (!val) return;
    setForm((p) =>
      p.std_selected.includes(val)
        ? p
        : { ...p, std_selected: [...p.std_selected, val] }
    );
  };

  const removeStandard = (val: string) =>
    setForm((p) => ({
      ...p,
      std_selected: p.std_selected.filter((s) => s !== val),
    }));

  const addDateChip = (
    keyInput: "thrombolytic_input" | "thrombectomy_input",
    keyList: "thrombolytic_dates" | "thrombectomy_dates"
  ) => {
    setForm((p) => {
      const v = (p[keyInput] || "").trim();
      if (!v) return p;
      return { ...p, [keyList]: [...p[keyList], v], [keyInput]: "" } as FormState;
    });
  };

  const removeDateChip = (
    keyList: "thrombolytic_dates" | "thrombectomy_dates",
    idx: number
  ) =>
    setForm((p) => ({
      ...p,
      [keyList]: p[keyList].filter((_, i) => i !== idx),
    }));

  return (
    <div className="flex flex-col gap-16">
      <CardShell>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Service Offering</h2>
          <div className="mt-1 text-xs text-slate-500">Primary Site Service offering</div>

          <div className="mt-6">
            <button
              type="button"
              className="text-xs font-semibold text-[#1E5AA8] border-b-2 border-[#1E5AA8] pb-2"
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
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                          className="h-4 w-4 rounded border-slate-300"
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
              className="mt-6 inline-flex items-center gap-2 rounded-md border border-[#1E5AA8] bg-white px-4 py-2 text-xs font-semibold text-[#1E5AA8] hover:bg-blue-50"
              onClick={() => alert("Add Other Service (mock)")}
            >
              + Add Other Service
            </button>
          </div>
        </div>
      </CardShell>

      <CardShell>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Standards to Apply</h2>

          <div className="mt-5">
            <select
              value=""
              onChange={(e) => addStandard(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                <span
                  key={s}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1E5AA8] border border-blue-200"
                >
                  {s}
                  <button
                    type="button"
                    className="text-[#1E5AA8]"
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
              onChange={(e) =>
                setForm((p) => ({ ...p, std_expirationDate: e.target.value }))
              }
            />
            <DateField
              label="Date of Application"
              value={form.std_applicationDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, std_applicationDate: e.target.value }))
              }
            />
          </div>

          <div className="mt-10">
            <ChipDateInput
              label="Dates of last twenty-five thrombolytic administrations"
              placeholder="mm/dd/yyyy , mm/dd/yyyy"
              value={form.thrombolytic_input}
              onChange={(e) =>
                setForm((p) => ({ ...p, thrombolytic_input: e.target.value }))
              }
              onAdd={() => addDateChip("thrombolytic_input", "thrombolytic_dates")}
              onAddDate={(picked) =>
                setForm((p) => ({
                  ...p,
                  thrombolytic_dates: [...p.thrombolytic_dates, picked],
                }))
              }
              chips={form.thrombolytic_dates}
              onRemove={(idx) => removeDateChip("thrombolytic_dates", idx)}
            />
          </div>

          <div className="mt-8">
            <ChipDateInput
              label="Dates of last fifteen thrombectomies"
              placeholder="mm/dd/yyyy , mm/dd/yyyy"
              value={form.thrombectomy_input}
              onChange={(e) =>
                setForm((p) => ({ ...p, thrombectomy_input: e.target.value }))
              }
              onAdd={() => addDateChip("thrombectomy_input", "thrombectomy_dates")}
              onAddDate={(picked) =>
                setForm((p) => ({
                  ...p,
                  thrombectomy_dates: [...p.thrombectomy_dates, picked],
                }))
              }
              chips={form.thrombectomy_dates}
              onRemove={(idx) => removeDateChip("thrombectomy_dates", idx)}
            />
          </div>
        </div>
      </CardShell>
    </div>
  );
}

// ---------- Step 6 ----------
function Step6({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const [open, setOpen] = useState({
    basic: true,
    facility: true,
    leadership: true,
    site: true,
    services: true,
  });

  const Toggle = ({ id, title }: { id: keyof typeof open; title: string }) => (
    <button
      type="button"
      className="w-full flex items-center justify-between bg-white px-6 py-3 text-sm font-semibold text-slate-800 border-b border-[#EBEBEB]"
      onClick={() => setOpen((p) => ({ ...p, [id]: !p[id] }))}
    >
      <span className="flex items-center gap-2">
        <span className={(open[id] ? "rotate-90 " : "") + "inline-block"}>›</span>
        {title}
      </span>
      <span className="text-xs font-medium text-[#0056A3]">Edit</span>
    </button>
  );

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="grid grid-cols-3 gap-4 py-2 text-xs">
      <div className="text-slate-500">{label}</div>
      <div className="col-span-2 text-slate-800">{value || "-"}</div>
    </div>
  );

  const Chip = ({ text }: { text: string }) => (
    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#1E5AA8]">
      {text}
    </span>
  );

  return (
    <div>
      <div className="text-sm font-semibold text-slate-800 mb-6">Hospital Information</div>

      <div className="rounded-[8px] border border-[#D6D6D6] bg-white p-[1px] overflow-hidden mb-4">
        <Toggle id="basic" title="Basic Information" />
        {open.basic ? (
          <div className="px-6 py-5">
            <Row label="Legal Entity Name" value={form.legalEntityName} />
            <Row label="d/b/a Name" value={form.dbaName} />
            <Row
              label="Primary Contact"
              value={`${form.firstName || ""} ${form.lastName || ""} • ${form.title || ""} • ${form.workPhone || ""} • ${form.email || ""}`.trim()}
            />
          </div>
        ) : null}
      </div>

      <div className="rounded-[8px] border border-[#D6D6D6] bg-white p-[1px] overflow-hidden mb-4">
        <Toggle id="facility" title="Facility Details" />
        {open.facility ? (
          <div className="px-6 py-5">
            <Row label="Facility Type" value={form.facilityType} />
          </div>
        ) : null}
      </div>

      <div className="rounded-[8px] border border-[#D6D6D6] bg-white p-[1px] overflow-hidden mb-4">
        <Toggle id="leadership" title="Leadership Contacts" />
        {open.leadership ? (
          <div className="px-6 py-5 space-y-4">
            <div className="rounded-md bg-slate-50 p-3 text-xs">
              <div className="font-semibold text-slate-800 mb-1">CEO</div>
              <div>{`${form.ceo_firstName} ${form.ceo_lastName}`.trim() || "-"}</div>
              <div>{form.ceo_phone || "-"}</div>
              <div>{form.ceo_email || "-"}</div>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-xs">
              <div className="font-semibold text-slate-800 mb-1">Director of Quality</div>
              <div>{`${form.quality_firstName} ${form.quality_lastName}`.trim() || "-"}</div>
              <div>{form.quality_phone || "-"}</div>
              <div>{form.quality_email || "-"}</div>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-xs">
              <div className="font-semibold text-slate-800 mb-1">Invoicing Contact</div>
              <div>{`${form.invoicing_firstName} ${form.invoicing_lastName}`.trim() || "-"}</div>
              <div>{form.invoicing_phone || "-"}</div>
              <div>{form.invoicing_email || "-"}</div>
              <div className="mt-1">
                {`${form.billing_street || ""} ${form.billing_city || ""} ${form.billing_state || ""} ${form.billing_zip || ""}`.trim() || "-"}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-[8px] border border-[#D6D6D6] bg-white p-[1px] overflow-hidden mb-4">
        <Toggle id="site" title="Site Information" />
        {open.site ? (
          <div className="px-6 py-5">
            <Row
              label="Site Configuration"
              value={
                form.site_locationMode === "multiple"
                  ? "Multiple Locations"
                  : form.site_locationMode === "single"
                  ? "Single Location"
                  : "-"
              }
            />
            <Row label="Input Method" value={form.site_locationMode === "multiple" ? "File Upload" : "-"} />
            <Row
              label="Uploaded Files"
              value={
                form.site_uploadedFiles.length
                  ? form.site_uploadedFiles.map((f) => f.name).join(", ")
                  : "-"
              }
            />
          </div>
        ) : null}
      </div>

      <div className="rounded-[8px] border border-[#D6D6D6] bg-white p-[1px] overflow-hidden mb-6">
        <Toggle id="services" title="Services & Certifications" />
        {open.services ? (
          <div className="px-6 py-5 space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2">
                Services Provided
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.svc_selected.length ? form.svc_selected : ["-"]).map((s, i) => (
                  <Chip key={i} text={s} />
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2">
                Standards to Apply
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.std_selected.length ? form.std_selected : ["-"]).map((s, i) => (
                  <Chip key={i} text={s} />
                ))}
              </div>
            </div>

            <Row label="Date of Application" value={form.std_applicationDate ? isoToUS(form.std_applicationDate) : "-"} />
            <Row
              label="Expiration Date of Current Stroke Certification"
              value={form.std_expirationDate ? isoToUS(form.std_expirationDate) : "-"}
            />
            <Row
              label="Dates of last 25 thrombolytic administrations"
              value={form.thrombolytic_dates.length ? form.thrombolytic_dates.join(", ") : "-"}
            />
            <Row
              label="Dates of last 15 thrombectomies"
              value={form.thrombectomy_dates.length ? form.thrombectomy_dates.join(", ") : "-"}
            />
          </div>
        ) : null}
      </div>

      <div className="rounded-[8px] border border-[#D6D6D6] bg-white p-[1px] overflow-hidden">
        <div className="px-6 py-5">
          <div className="text-sm font-semibold text-slate-800">Ready to Submit?</div>

          <label className="mt-3 flex items-start gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-300"
              checked={form.ready_certify}
              onChange={(e) =>
                setForm((p) => ({ ...p, ready_certify: e.target.checked }))
              }
            />
            I certify that all information provided is accurate and complete to the best of my knowledge
          </label>

          <div className="mt-4 text-[11px] text-slate-500">
            By submitting this form, you agree to our terms and conditions. DNV will review your application and contact you within 1–2 business days.
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              className="rounded-md border border-[#1E5AA8] bg-white px-4 py-2 text-xs font-semibold text-[#1E5AA8] hover:bg-blue-50"
              onClick={() => alert("Download as PDF (mock)")}
            >
              Download as PDF
            </button>
            <button
              type="button"
              className="rounded-md border border-[#1E5AA8] bg-white px-4 py-2 text-xs font-semibold text-[#1E5AA8] hover:bg-blue-50"
              onClick={() => alert("Export to CSV (mock)")}
            >
              Export to CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Shared UI components ----------
function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const id = useId();

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700" htmlFor={id}>
        {label}
      </label>
      <div className="mt-2 relative">
        <input
          id={id}
          type="date"
          value={value}
          onChange={onChange}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <label
          htmlFor={id}
          className="absolute right-3 top-2.5 cursor-pointer select-none text-slate-400 hover:text-slate-600"
          title="Open calendar"
          aria-label="Open calendar"
        >
          📅
        </label>
      </div>
    </div>
  );
}

function ChipDateInput({
  label,
  placeholder,
  value,
  onChange,
  onAdd,
  onAddDate,
  chips,
  onRemove,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  onAddDate: (picked: string) => void;
  chips: string[];
  onRemove: (idx: number) => void;
}) {
  const dateInputId = useId();

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700">{label}</label>
      <div className="mt-2 relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
        />

        {/* Invisible date input over the icon area (no showPicker) */}
        <input
          id={dateInputId}
          type="date"
          className="absolute right-3 top-2.5 h-5 w-5 cursor-pointer opacity-0"
          onChange={(e) => {
            const picked = isoToUS(e.target.value);
            if (picked) onAddDate(picked);
            e.target.value = "";
          }}
          aria-label="Pick date"
        />

        <label
          htmlFor={dateInputId}
          className="absolute right-3 top-2.5 cursor-pointer select-none text-slate-500"
          title="Open calendar"
          aria-label="Open calendar"
        >
          📅
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {chips.map((d, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-2 rounded-full bg-[#123D7A] px-3 py-1 text-xs font-semibold text-white"
          >
            {d}
            <button
              type="button"
              className="h-4 w-4 rounded-full bg-white/15"
              onClick={() => onRemove(idx)}
              aria-label="Remove date"
              title="Remove"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function ContactCard({
  title,
  sameChecked,
  onSameChange,
  firstNameKey,
  lastNameKey,
  phoneKey,
  emailKey,
  form,
  setField,
  required,
}: {
  title: string;
  sameChecked: boolean;
  onSameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  firstNameKey: keyof FormState;
  lastNameKey: keyof FormState;
  phoneKey: keyof FormState;
  emailKey: keyof FormState;
  form: FormState;
  setField: (k: keyof FormState) => any;
  required?: boolean;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-[1px] overflow-hidden">
      <div className="px-6 py-5">
        <div className="text-sm font-semibold text-slate-800">{title}</div>

        <label className="mt-3 flex items-center gap-2 text-xs text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300"
            checked={sameChecked}
            onChange={onSameChange}
          />
          Same as Primary Contact entered in Step 1
        </label>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field
            label="First Name"
            required={!!required}
            value={String(form[firstNameKey] || "")}
            onChange={setField(firstNameKey)}
          />
          <Field
            label="Last Name"
            required={!!required}
            value={String(form[lastNameKey] || "")}
            onChange={setField(lastNameKey)}
          />
        </div>

        <div className="mt-5">
          <Field
            label="Phone"
            required={!!required}
            value={String(form[phoneKey] || "")}
            onChange={setField(phoneKey)}
          />
        </div>

        <div className="mt-5">
          <Field
            label="Email"
            required={!!required}
            value={String(form[emailKey] || "")}
            onChange={setField(emailKey)}
          />
        </div>
      </div>
    </div>
  );
}

const US_STATES = [
  { value: "", label: "Select State" },
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

function Select({
  label,
  required,
  value,
  onChange,
  options,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-md border px-3 py-2.5 text-sm outline-none border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((o) => (
          <option key={o.value || o.label} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={
          "mt-2 w-full rounded-md border px-3 py-2.5 text-sm outline-none border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 " +
          (disabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : "")
        }
      />
    </div>
  );
}

