## Test Scenarios Executed

### Scenario 1: Complete Form Flow

- **Steps**: Fill all 6 steps with valid data and submit
- **Expected**: Form submits successfully, payload logged to console
- **Result**: ✅ **PASS** - All data captured correctly, submission works

### Scenario 2: Step Navigation

- **Steps**: Navigate forward/backward through all steps
- **Expected**: Data persists across navigation, progress bar updates correctly
- **Result**: ✅ **PASS** - State management works correctly

### Scenario 3: Required Field Validation

- **Steps**: Try to continue without filling required fields on each step
- **Expected**: Continue button disabled, cannot proceed
- **Result**: ✅ **PASS** - Validation works on Steps 1, 2, 4, 5, 6

### Scenario 4: "Same As" Checkbox Functionality

- **Steps**:
  - Check "Same as Legal Entity Name" → DBA should auto-fill
  - Uncheck → DBA should be editable
  - Check "Same as Primary Contact" for CEO/Quality/Invoicing → fields should copy
  - Uncheck → fields should clear
- **Expected**: Fields copy when checked, clear when unchecked
- **Result**: ✅ **PASS** - Logic works correctly

### Scenario 5: Date Picker Functionality

- **Steps**:
  - Click on date input fields
  - Select dates from calendar
  - Add multiple dates to chip inputs
- **Expected**: Calendar opens on click, dates display as MM/DD/YYYY
- **Result**: ✅ **PASS** - After fixes, calendar opens reliably

### Scenario 6: Service Search

- **Steps**:
  - Type in service search box
  - Verify cursor position maintained
  - Verify real-time filtering works
- **Expected**: Search filters services, cursor stays in place while typing
- **Result**: ✅ **PASS** - Search works, cursor position fixed

### Scenario 7: File Upload

- **Steps**:
  - Select "Multiple Locations"
  - Upload CSV/Excel files via click and drag-and-drop
  - Remove files
- **Expected**: Files upload correctly, can be removed
- **Result**: ✅ **PASS** - Upload functionality works

### Scenario 8: Scroll Position

- **Steps**:
  - Scroll down page
  - Add date chips, select standards, toggle services
- **Expected**: Page should not jump to top
- **Result**: ✅ **PASS** - Scroll position preserved after fixes

### Scenario 9: Review Page (Step 6)

- **Steps**:
  - Navigate to Step 6
  - Expand/collapse sections
  - Verify all data displayed correctly
- **Expected**: All entered data visible, sections toggle correctly
- **Result**: ✅ **PASS** - Review page displays all data accurately

### Scenario 10: Responsive Design

- **Steps**: Test on desktop (1920x1080), tablet (768px), mobile (375px)
- **Expected**: Form remains usable and readable on all screen sizes
- **Result**: ✅ **PASS** - Responsive design works correctly

## Bugs Identified & Resolved

### Bug 1: Scroll-to-Top Issue

- **Description**: Page scrolled to top when adding dates, selecting standards, or toggling services
- **Impact**: Poor user experience, users lost their place on the page
- **Root Cause**: React re-renders after state updates were resetting scroll position
- **Resolution**:
  - Saved `window.scrollY` before state updates
  - Restored scroll position using `setTimeout(() => window.scrollTo(0, scrollY), 0)`
  - Applied to `DateField`, `ChipDateInput`, and `Step5` functions (`addStandard`, `removeStandard`, `toggleService`, `removeDateChip`)
- **Status**: ✅ **FIXED**

### Bug 2: Calendar Not Opening on Click

- **Description**: Date picker calendar did not open when clicking on date input fields
- **Impact**: Users could not select dates, breaking date input functionality
- **Root Cause**: Text input overlay was preventing clicks from reaching the native date input; `showPicker()` requires direct user gesture
- **Resolution**:
  - Made visible text input `readOnly` with `pointerEvents: 'none'`
  - Positioned invisible `<input type="date">` overlay covering entire input area
  - Used `showPicker()` in `onMouseDown` handler (direct user gesture)
  - Added proper z-index layering
- **Status**: ✅ **FIXED**

### Bug 3: Cursor Position Not Restoring in Search Input

- **Description**: When typing in service search box, cursor jumped to end after each keystroke, allowing only one character at a time
- **Impact**: Users could not type normally in search field
- **Root Cause**: React re-renders after state updates were resetting cursor position
- **Resolution**:
  - Saved cursor position (`selectionStart`) before state update
  - Used `requestAnimationFrame` to restore cursor after DOM update
  - Used `useRef` to access input element directly
  - Implemented `useCallback` for stable handler function
- **Status**: ✅ **FIXED**

### Bug 4: Date Format Inconsistency

- **Description**: Date chips displayed ISO format instead of MM/DD/YYYY as specified in Figma
- **Impact**: Dates displayed in wrong format, inconsistent with design
- **Root Cause**: Helper function `isoToDDMMYYYY` was returning DD/MM/YYYY format
- **Resolution**:
  - Updated `isoToDDMMYYYY` helper function to return `MM/DD/YYYY` format
  - Updated all placeholders to `mm/dd/yyyy` for consistency
  - Ensured all date displays use same format throughout application
- **Status**: ✅ **FIXED**

### Bug 5: "Same as Primary Contact" Not Clearing on Uncheck

- **Description**: When unchecking "Same as Primary Contact" checkbox, copied values remained instead of clearing
- **Impact**: Users could not enter different values after unchecking
- **Root Cause**: Logic only handled checked state, not unchecked state
- **Resolution**:
  - Updated `setField` function to clear values when checkbox is unchecked
  - Applied to CEO, Quality, and Invoicing contact fields
  - Values now clear to empty strings when checkbox is unchecked
- **Status**: ✅ **FIXED**

### Bug 6: File Upload Type Restrictions

- **Description**: File input accepted any file type, not just CSV/Excel
- **Impact**: Users could upload invalid file types
- **Root Cause**: Missing `accept` attribute on file input
- **Resolution**: Added `accept=".csv,.xlsx,.xls"` to file input element
- **Status**: ✅ **FIXED**

### Bug 7: Disabled Button Visual Clarity

- **Description**: Disabled buttons were not visually distinct from enabled buttons
- **Impact**: Users couldn't tell when buttons were disabled
- **Root Cause**: Missing disabled state styling
- **Resolution**: Added reduced-opacity styling for disabled primary/secondary buttons
- **Status**: ✅ **FIXED**

### Bug 8: React Warning - Non-Unique Keys

- **Description**: Console warning: "Encountered two children with the same key, Pediatric Intensive Care Services"
- **Impact**: Potential React rendering issues, console warnings
- **Root Cause**: Duplicate service name in categories array, non-unique keys in mapped items
- **Resolution**:
  - Removed duplicate "Pediatric Intensive Care Services" entry
  - Updated key to `key={`${cat.title}-${svc}-${idx}`}` for uniqueness
- **Status**: ✅ **FIXED**

## Test Coverage Summary

- **Total Test Areas**: Navigation, validation, data management, upload, services, review, responsiveness, accessibility
- **Overall Result**: **No blocking issues found**; all core user flows pass.

## Tools Used

- Browser DevTools (inspection, console logging)
- Built‑in responsive design mode
- Manual exploratory and scenario‑based testing

## Recommendations

1. Add phone number formatting for a consistent `(###) ###‑####` display.
2. Add client‑side email format validation for better UX.
3. Add file size/type validation and user‑facing error messages for uploads.
4. Persist form data in `localStorage` to survive full page refreshes.
5. Add more explicit inline validation messages and error summaries.

## Conclusion

The DNV multi‑step quote request form has been tested across the main flows and environments.  
Navigation, validation, data persistence, uploads, and submission all behave as expected, and the submission correctly logs the payload to the console. The application is **ready for submission**, with the above recommendations as future enhancements.
