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
    <section className="form-fields-container">
      <h2 className="section-title">
        Do you have multiple sites or locations?
      </h2>

      <div className="location-selection-grid">
        <button
          type="button"
          onClick={() =>
            setForm((p) => ({ ...p, site_locationMode: "single" }))
          }
          className={
            "location-option-button " +
            (isSingle ? "location-option-button-selected" : "")
          }
        >
          <div className="location-option-title">Single Location</div>
          <div className="location-option-description">
            We operate from one facility only
          </div>
        </button>

        <button
          type="button"
          onClick={() =>
            setForm((p) => ({ ...p, site_locationMode: "multiple" }))
          }
          className={
            "location-option-button " +
            (isMultiple ? "location-option-button-selected" : "")
          }
        >
          <div className="location-option-title">Multiple Locations</div>
          <div className="location-option-description">
            We have multiple facilities or practice locations
          </div>
        </button>
      </div>

      {isMultiple ? (
        <div className="upload-section">
          <h3 className="section-title">
            How would you like to add your site information?
          </h3>

          <div className="upload-info-box">
            <div className="location-option-title">Upload CSV / Excel</div>
            <div className="location-option-description">
              Upload a spreadsheet with all site information
            </div>
          </div>

          <div className="upload-container">
            <div
              className="upload-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
            >
              <div className="upload-icon">⤒</div>
              <div className="upload-title">Upload Site Information</div>
              <div className="upload-description">
                Drag and drop your CSV or Excel file here, or click to select
              </div>

              <div className="upload-button-container">
                <label className="file-select-button">
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
                className="download-template-button"
                onClick={() => alert("Download CSV Template (mock)")}
              >
                Download CSV Template
              </button>
            </div>

            <div className="uploaded-files-section">
              <div className="contact-card-title">Uploaded</div>

              <div className="uploaded-files-list">
                {form.site_uploadedFiles.length === 0 ? (
                  <div className="helper-text">No files uploaded yet.</div>
                ) : (
                  form.site_uploadedFiles.map((f, idx) => (
                    <div key={idx} className="file-item">
                      <div className="file-item-content">
                        <div className="file-icon">📄</div>
                        <div>
                          <div className="file-name">
                            {f.name}{" "}
                            <span className="file-size-separator">·</span>{" "}
                            <button
                              type="button"
                              className="file-preview-link"
                              onClick={() => alert("Preview (mock)")}
                            >
                              Preview
                            </button>
                          </div>
                          <div className="file-size">{formatBytes(f.size)}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="file-remove-button"
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
    </section>
  );
}
