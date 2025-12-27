import React, { useId } from "react";
import { isoToDDMMYYYY } from "../../utils/helpers";

export function DateField({ label, value, onChange }) {
  const id = useId();
  const displayId = `display-${id}`;

  return (
    <div>
      <label className="date-field-label" htmlFor={id}>
        {label}
      </label>
      <div className="date-field-wrapper">
        {/* Visible text input showing formatted date */}
        <input
          id={displayId}
          type="text"
          value={value ? isoToDDMMYYYY(value) : ""}
          readOnly
          className="input date-field-input"
          placeholder="mm/dd/yyyy"
          style={{ pointerEvents: "none", cursor: "pointer" }}
        />

        {/* Invisible date input for calendar picker */}
        <input
          id={id}
          type="date"
          value={value}
          onChange={(e) => {
            const scrollY = window.scrollY;
            if (typeof onChange === "function") {
              onChange(e);
            }
            setTimeout(() => {
              window.scrollTo(0, scrollY);
            }, 0);
          }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            margin: 0,
            padding: 0,
            border: "none",
            outline: "none",
            boxSizing: "border-box",
            opacity: 0,
            zIndex: 10,
            cursor: "pointer",
            backgroundColor: "transparent",
            fontSize: "16px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            // Try to show picker if available
            try {
              if (e.target.showPicker) {
                e.target.showPicker();
              }
            } catch (err) {
              // showPicker() can throw in cross-origin iframes, ignore
            }
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            // Focus the input to ensure calendar can open
            e.target.focus();
          }}
          onFocus={(e) => {
            // Try to show picker on focus
            try {
              if (e.target.showPicker) {
                e.target.showPicker();
              }
            } catch (err) {
              // showPicker() can throw in cross-origin iframes, ignore
            }
          }}
          aria-label="Pick date"
        />

        <label
          htmlFor={id}
          className="date-field-icon"
          title="Open calendar"
          aria-label="Open calendar"
        >
          📅
        </label>
      </div>
    </div>
  );
}
