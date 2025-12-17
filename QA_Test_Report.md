# QA Test Report - DNV Quote Request Multi-Step Form

## Test Environment

- **Browsers**: Chrome 120+, Firefox 121+, Safari 17+
- **OS**: macOS, Windows 10/11
- **Screen Resolutions**: 1920x1080, 1366x768, 375x667 (mobile)
- **Testing Date**: December 2025

## High‑Level Test Summary

- **Multi-step navigation**: Forward/back buttons and quick step jump work; current step is always reflected in the progress bar.

- **Validation**: Required fields are enforced on Steps 1, 2, 4, 5 and certification checkbox on Step 6.

- **State management**: Data entered in one step persists when navigating across all steps.

- **File upload**: CSV / Excel upload supports click + drag‑and‑drop; multiple files and removal are handled correctly.

- **Services & certifications**: Search, checkbox selection, standards chips, and date pickers all behave as expected.

- **Review & submit**: Step 6 accurately summarizes all data and only allows submission when certification is confirmed.

- **Form submission**: Final payload is logged to the browser console as a JSON object.

- **Responsive design**: Layout remains usable on desktop, tablet, and mobile resolutions.

- **Accessibility**: All interactive elements are keyboard reachable and have associated labels.

## Key Test Scenarios

### Navigation & Progress

- Navigate through all 6 steps using **Continue/Previous** – state is preserved ✅
- Use quick step buttons to jump between steps – correct step content and progress state shown ✅

### Core Validation

- **Step 1** – required organization and primary contact fields block progression when empty ✅
- **Step 2** – cannot continue without selecting **Facility Type** ✅
- **Step 4** – cannot continue without choosing **Single** vs **Multiple Locations** ✅
- **Step 5** – at least one service must be selected before continuing ✅
- **Step 6** – submit button disabled until certification checkbox is checked ✅

### Data Integrity & “Same As” Logic

- Data entered in any step persists when navigating forward/backward ✅
- “Same as Legal Entity Name” correctly fills and locks DBA, and re‑enables editing when unchecked ✅
- “Same as Primary Contact” correctly copies primary contact details to CEO / Quality / Invoicing contacts ✅

### Upload Site Information

- Selecting **Multiple Locations** reveals upload area; **Single Location** hides it ✅
- Clicking **Select file** or using drag‑and‑drop adds CSV/Excel files to uploaded list with correct name and size ✅
- Files can be removed individually, and multiple uploads are supported ✅

### Services & Certifications

- Service search filters cards in real time and restores full list when cleared ✅
- Selecting/deselecting services updates the selected set and persists across navigation ✅
- Standards dropdown adds chips; duplicate standards are prevented; chips can be removed ✅
- Date fields and multi‑date chip inputs store ISO dates and display them as **MM/DD/YYYY** ✅

### Review & Submit (Step 6)

- Accordion sections (Basic, Facility, Leadership, Site, Services) expand/collapse and show all captured data ✅
- Dates, services, standards, and uploaded files are rendered in the expected summary format ✅
- When form is fully valid and certification is checked, **Submit Application** logs the full payload to the console ✅

### Responsive & Accessibility Checks

- Desktop, tablet, and mobile views keep the form readable and all actions usable ✅
- Tab order follows a logical path through inputs and buttons; labels are correctly announced by screen readers ✅

## Bugs Identified & Resolved

1. **Date format display** – Date chips initially showed ISO format

   - ✅ **Fix**: Centralized helper now converts ISO → `MM/DD/YYYY` for all displayed dates.

2. **File upload type restrictions** – File input accepted any file type

   - ✅ **Fix**: Added `accept=".csv,.xlsx,.xls"` to restrict to CSV/Excel.

3. **Disabled button clarity** – Disabled buttons were not visually distinct
   - ✅ **Fix**: Added reduced‑opacity styling for disabled primary/secondary buttons.

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
