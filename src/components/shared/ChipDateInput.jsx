import React, { useId } from "react";
import { isoToDDMMYYYY } from "../../utils/helpers";

export function ChipDateInput({
  label,
  placeholder,
  onAddDate,
  chips,
  onRemove,
  maxDates,
}) {
  const dateInputId = useId();

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700">
        {label}
      </label>
      <div className="mt-2 relative">
        {/* Text input for display only - not editable */}
        <input
          type="text"
          value={
            chips.length > 0
              ? `${chips.length} date${chips.length > 1 ? "s" : ""} selected`
              : placeholder || "mm/dd/yyyy , mm/dd/yyyy"
          }
          readOnly
          className="input pr-10"
          style={{ pointerEvents: "none", cursor: "pointer" }}
        />

        {/* Invisible date input for calendar picker - covers entire input box exactly */}
        <input
          id={dateInputId}
          type="date"
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
          }}
          onChange={(e) => {
            const picked = isoToDDMMYYYY(e.target.value);
            if (picked) {
              // Check if date already exists
              if (!chips.includes(picked)) {
                // Check max dates limit
                if (!maxDates || chips.length < maxDates) {
                  // Prevent scroll to top
                  const scrollY = window.scrollY;
                  onAddDate(picked);
                  // Restore scroll position after state update
                  setTimeout(() => {
                    window.scrollTo(0, scrollY);
                  }, 0);
                } else {
                  alert(`Maximum ${maxDates} dates allowed`);
                }
              } else {
                alert("This date has already been added");
              }
            }
            e.target.value = "";
          }}
          onClick={(e) => {
            // Ensure calendar opens on click
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            // Ensure calendar opens on mousedown as well
            e.stopPropagation();
          }}
          aria-label="Pick date"
        />

        {/* Calendar icon for visual indication */}
        <span
          className="absolute right-3 top-2.5 pointer-events-none select-none text-slate-500"
          style={{ zIndex: 5 }}
          title="Click anywhere to select date from calendar"
          aria-label="Calendar icon"
        >
          📅
        </span>
      </div>

      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((d, idx) => (
            <span key={idx} className="chip chip-dark">
              {d}
              <button
                type="button"
                className="chip-remove"
                onClick={() => onRemove(idx)}
                aria-label="Remove date"
                title="Remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
