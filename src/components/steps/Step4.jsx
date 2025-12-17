import React from "react";
import { formatBytes } from "../../utils/helpers";

export function Step4({ form, setForm }) {
  const isSingle = form.site_locationMode === "single";
  const isMultiple = form.site_locationMode === "multiple";

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []).map((f) => ({
      name: f.name,
      size: f.size,
    }));
    setForm((p) => ({
      ...p,
      site_uploadedFiles: [...p.site_uploadedFiles, ...files],
    }));
  };

  const removeFile = (idx) =>
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
          onClick={() =>
            setForm((p) => ({ ...p, site_locationMode: "single" }))
          }
          className={
            "text-left rounded-lg border px-6 py-5 transition " +
            (isSingle
              ? "border-blue-400 bg-blue-50"
              : "border-slate-300 bg-white hover:bg-slate-50")
          }
        >
          <div className="text-sm font-semibold text-slate-800">
            Single Location
          </div>
          <div className="mt-1 text-xs text-slate-500">
            We operate from one facility only
          </div>
        </button>

        <button
          type="button"
          onClick={() =>
            setForm((p) => ({ ...p, site_locationMode: "multiple" }))
          }
          className={
            "text-left rounded-lg border px-6 py-5 transition " +
            (isMultiple
              ? "border-blue-400 bg-blue-50"
              : "border-slate-300 bg-white hover:bg-slate-50")
          }
        >
          <div className="text-sm font-semibold text-slate-800">
            Multiple Locations
          </div>
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
            <div className="text-sm font-semibold text-slate-800">
              Upload CSV / Excel
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Upload a spreadsheet with all site information
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-300 bg-blue-50 p-6">
            <div
              className="upload-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
            >
              <div className="upload-icon">⤒</div>
              <div
                style={{
                  fontFamily:
                    "Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont",
                  fontSize: "16px",
                  fontWeight: 700,
                  lineHeight: "22px",
                  color: "#000000",
                }}
              >
                Upload Site Information
              </div>
              <div
                className="mt-1"
                style={{
                  fontFamily:
                    "Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont",
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "16px",
                  color: "#707070",
                }}
              >
                Drag and drop your CSV or Excel file here, or click to select
              </div>

              <div className="mt-5">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-md bg-dark-blue px-5 py-2 text-xs font-semibold text-white hover:opacity-95">
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
                className="mt-3 hover:underline"
                style={{
                  fontFamily:
                    "Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont",
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "22px",
                  color: "#1A3A70",
                  textAlign: "center",
                }}
                onClick={() => alert("Download CSV Template (mock)")}
              >
                Download CSV Template
              </button>
            </div>

            <div className="mt-6">
              <div className="text-sm font-semibold text-slate-800">
                Uploaded
              </div>

              <div className="mt-3 space-y-3">
                {form.site_uploadedFiles.length === 0 ? (
                  <div className="text-xs text-slate-500">
                    No files uploaded yet.
                  </div>
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
                            {f.name}{" "}
                            <span className="text-xs text-slate-400">·</span>{" "}
                            <button
                              type="button"
                              className="text-sm font-medium text-primary-blue hover:underline"
                              onClick={() => alert("Preview (mock)")}
                            >
                              Preview
                            </button>
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatBytes(f.size)}
                          </div>
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

