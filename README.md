# DNV Quote Request - Multi-Step Form

A fully functional multi-step form application built with React and JavaScript, implementing a comprehensive healthcare organization quote request form for DNV Healthcare.

## Tech Stack

- **Framework**: React 18.2.0 with JavaScript
- **Build Tool**: Vite 5.0.8
- **Styling**: Pure CSS (no third-party CSS frameworks)
- **State Management**: React Hooks (useState, useMemo)
- **Form Handling**: React controlled components

## Project Structure

```
medlaunch-multistep-form/
├── src/
│   ├── components/
│   │   └── MultiStepForm.jsx    # Main form component with all steps
│   ├── styles/
│   │   └── styles.css           # Pure CSS stylesheet
│   ├── App.jsx                  # Root App component
│   └── main.jsx                 # Application entry point
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## Installation

1. **Clone or download the repository**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

## Features

### Form Steps

1. **DNV Quote Request** - Organization identification and primary contact information
2. **Facility Details** - Facility type selection
3. **Leadership Contacts** - CEO, Director of Quality, and Invoicing contact details
4. **Site Information** - Single or multiple location selection with file upload capability
5. **Services & Certifications** - Service offerings, standards, and certification dates
6. **Review & Submit** - Review all entered information and submit the form

### Key Features

- ✅ **Multi-step navigation** with progress indicator
- ✅ **Form validation** - Required field validation before proceeding
- ✅ **State management** - Form data persists across steps
- ✅ **File upload** - Support for CSV/Excel file uploads (multiple locations)
- ✅ **Date pickers** - Native date input with custom styling
- ✅ **Responsive design** - Works on desktop and mobile devices
- ✅ **Accessibility** - Proper labels, ARIA attributes, and keyboard navigation
- ✅ **Form submission** - Logs complete form payload to console

### Form Validation

- Step 1: Legal Entity Name, DBA Name, First Name, Last Name, Title, Work Phone, Email
- Step 2: Facility Type selection
- Step 4: Site location mode selection
- Step 5: At least one service must be selected
- Step 6: Certification checkbox must be checked

## Development Approach

### Design Implementation

- Converted Figma design specifications to pure CSS
- Maintained design fidelity with accurate spacing, colors, and typography
- Implemented responsive breakpoints for mobile and tablet views

### Code Organization

- **Modular Components**: Each step is a separate component for maintainability
- **Reusable UI Components**: Field, Select, DateField, ChipDateInput, ContactCard
- **Helper Functions**: Utility functions for date formatting and file size formatting
- **State Management**: Centralized form state using React useState hook

### Styling Strategy

- Pure CSS implementation (no Tailwind or other CSS frameworks)
- Utility classes for common patterns (flexbox, grid, spacing)
- Component-specific styles for complex UI elements
- Responsive design using CSS media queries

## Assumptions Made

1. **Date Format**: Dates are stored in ISO format internally and displayed in MM/DD/YYYY format
2. **File Upload**: File upload functionality is implemented but file processing is mocked (files are stored with name and size only)
3. **Email Verification**: Email verification is a mock feature (no actual email sending)
4. **Form Submission**: Form submission logs to console as required; actual API integration would be implemented in production
5. **Support Chat**: Support chat button is a mock feature
6. **Step Navigation**: Quick step navigation buttons are included for development/testing purposes

## Known Issues & Limitations

1. **File Upload**: Files are not actually processed or validated - only metadata is stored
2. **Email Validation**: Basic email format validation is not implemented (relies on HTML5 validation)
3. **Phone Number Formatting**: Phone numbers are not automatically formatted
4. **Browser Compatibility**: Some modern CSS features may not work in older browsers (IE11 and below)
5. **Date Picker**: Uses native HTML5 date picker which may have different appearances across browsers

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Add phone number formatting/validation
- Implement actual file processing for CSV/Excel uploads
- Add email format validation
- Implement actual email verification service
- Add form data persistence (localStorage)
- Add form data export functionality (PDF/CSV)
- Add loading states for async operations
- Add error handling and user feedback improvements

## Contact


