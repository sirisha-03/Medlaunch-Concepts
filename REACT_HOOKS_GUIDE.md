# React Hooks Guide - Interview Preparation

## Overview

This project uses **3 React hooks**: `useState`, `useMemo`, and `useId`. This guide covers quick reference, detailed explanations, and interview answers.

---

## 🎯 Quick Reference - 3 Hooks Used

### 1. useState (State Management)

**Used for:**

- Form data storage (single object with 30+ fields)
- Step navigation (1-6)
- Collapsible sections in Step 6

**Key points:**

- Stores data that changes and triggers re-renders
- Used functional updates: `setStep((s) => s + 1)` for reliability
- Single form state object for easier management

### 2. useMemo (Performance Optimization)

**Used for:**

- Validation calculation (`canContinue`)
- Service search filtering (`filteredCategories`)

**Key points:**

- Caches expensive calculations
- Only recalculates when dependencies change
- Prevents unnecessary re-renders

### 3. useId (Accessibility)

**Used for:**

- Generating unique IDs for date inputs
- Connecting labels to inputs (`htmlFor` and `id`)

**Key points:**

- React-recommended for accessibility
- Ensures unique IDs per component instance
- Works with SSR

---

## 📚 Detailed Explanations

## 1. useState Hook

### What it does:

`useState` is used to manage **component state** - data that can change and causes the component to re-render when updated.

### Usage in this project:

#### A. **Form State Management** (Main Component)

```javascript
const [form, setForm] = useState({
  legalEntityName: "",
  dbaName: "",
  firstName: "",
  lastName: "",
  // ... 30+ more fields
});
```

**Why?** Stores all form data in one object. When any field changes, we update the entire form object.

**Interview tip:** "I used a single state object instead of multiple `useState` calls because:

- All form data is related
- Easier to pass to child components
- Simpler to validate and submit
- Better performance (one state update vs many)"

#### B. **Step Navigation**

```javascript
const [step, setStep] = useState(1);
```

**Why?** Tracks which step the user is on (1-6). When `step` changes, React re-renders and shows the correct step component.

**How it's updated:**

```javascript
const onContinue = () => {
  setStep((s) => Math.min(6, s + 1)); // Increment step, max 6
};

const onPrevious = () => {
  setStep((s) => Math.max(1, s - 1)); // Decrement step, min 1
};
```

**Interview tip:** "I used the functional update form `setStep((s) => ...)` to ensure I'm always working with the latest state value, especially important for navigation logic."

#### C. **Collapsible Sections** (Step 6)

```javascript
const [open, setOpen] = useState({
  basic: true,
  facility: true,
  leadership: true,
  site: true,
  services: true,
});
```

**Why?** Tracks which sections are expanded/collapsed in the review page. Each section can be toggled independently.

**How it's used:**

```javascript
<button onClick={() => setOpen({ ...open, basic: !open.basic })}>
  {open.basic ? "▼" : "▶"} Basic Information
</button>
```

**Interview tip:** "I used an object to store multiple boolean states instead of separate `useState` calls for each section. This keeps related state together and makes it easier to manage."

---

## 2. useMemo Hook

### What it does:

`useMemo` **memoizes** (caches) the result of an expensive calculation. It only recalculates when its dependencies change.

### Usage in this project:

#### A. **Form Validation**

```javascript
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
```

**Why?**

- The validation logic depends on multiple form fields
- Without `useMemo`, this calculation would run on **every render**
- With `useMemo`, it only recalculates when `step` or any `missingStepX` value changes
- This improves performance, especially as the form grows

**Why useMemo is better here:**

- `canContinue` is a derived value (computed from step + missingStepX)
- Derived values should be computed during render, not stored and "synced" later
- ✅ Always correct (no sync issues)
- ✅ No extra state
- ✅ No extra render cycle

**How it's used:**

```javascript
<button
  onClick={onContinue}
  disabled={!canContinue} // Button is disabled if validation fails
>
  Continue
</button>
```

#### B. **Service Search Filtering** (Step 5)

```javascript
const filteredCategories = useMemo(() => {
  return categories
    .map((c) => ({
      ...c,
      items: c.items.filter((i) =>
        i.toLowerCase().includes(form.svc_search.toLowerCase())
      ),
    }))
    .filter((c) => c.items.length > 0);
}, [form.svc_search]);
```

**Why?**

- Filtering happens on every render when user types
- `useMemo` prevents recalculating when search hasn't changed
- Improves performance during typing

**Interview tip:** "I used `useMemo` for form validation and search filtering because:

1. The validation depends on multiple form fields
2. It prevents unnecessary recalculations on every render
3. It's a performance optimization - the calculation only runs when relevant fields change
4. This is especially important in forms with many fields like this one"

**Common interview question:** "When would you use `useMemo` vs `useState`?"

- **`useMemo`**: For **derived/computed values** that depend on other state
- **`useState`**: For **actual state** that the user directly changes

---

## 3. useId Hook

### What it does:

`useId` generates a **unique ID** for each component instance. Useful for connecting labels to inputs for accessibility.

### Usage in this project:

#### A. DateField Component

```javascript
export function DateField({ label, value, onChange }) {
  const id = useId(); // Generates unique ID like "r1:", "r2:", etc.

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="date" value={value} onChange={onChange} />
    </div>
  );
}
```

#### B. ChipDateInput Component

```javascript
export function ChipDateInput({ label, onAddDate, chips, ... }) {
  const dateInputId = useId();

  return (
    <div>
      <label htmlFor={dateInputId}>{label}</label>
      <input id={dateInputId} type="date" ... />
    </div>
  );
}
```

**Why?**

- **Accessibility**: Screen readers need `htmlFor` on labels matching `id` on inputs
- **Uniqueness**: Each component instance gets a unique ID automatically
- **No conflicts**: If the same component is used multiple times, each gets a different ID

**Interview tip:** "I used `useId` instead of hardcoding IDs or using `Math.random()` because:

1. It's the React-recommended way for accessibility
2. It ensures unique IDs even when components are reused
3. It works correctly with server-side rendering (SSR)
4. It's stable across re-renders"

**Common interview question:** "Why not just use `id="date-input"`?"

- If you use the component twice, you'd have duplicate IDs (invalid HTML)
- `useId` ensures each instance gets a unique ID automatically

---

## 🚫 Hooks NOT Used (And Why)

### useEffect

**Not needed because:**

- No side effects like API calls, subscriptions, or DOM manipulation
- All state updates are triggered by user interactions (onClick, onChange)
- No cleanup needed

**If we needed it:** "I would use `useEffect` for things like:

- Fetching data on component mount
- Setting up event listeners
- Cleaning up subscriptions"

### useCallback

**Not needed because:**

- Functions passed to child components are simple and don't cause performance issues
- No expensive function recreations that would benefit from memoization

**Note:** We actually DO use `useCallback` in Step5 for `handleSearchChange` to maintain cursor position, but it's not a core hook used throughout the project.

**If we needed it:** "I would use `useCallback` if I was passing functions to many child components and wanted to prevent unnecessary re-renders."

### useRef

**Not needed in most places because:**

- No need to access DOM elements directly (except in Step5 for cursor position)
- No need to store mutable values that don't trigger re-renders

**Note:** We actually DO use `useRef` in Step5 for `searchInputRef` to maintain cursor position, but it's not a core hook used throughout the project.

**If we needed it:** "I would use `useRef` for things like:

- Storing a reference to an input element
- Keeping a counter that doesn't need to trigger re-renders
- Storing previous values for comparison"

---

## 💡 Quick Interview Answers

**Q: Why useState for form?**
A: "Single state object keeps all form data together, easier to validate and submit. Requirements specified React hooks, so I avoided form libraries."

**Q: Why useMemo?**
A: "Validation depends on multiple fields. useMemo prevents recalculating on every render - only when step or validation fields change."

**Q: Why useId?**
A: "For accessibility - connects labels to inputs. Ensures unique IDs when component is reused multiple times."

**Q: useState vs useMemo?**
A: "useState stores actual state. useMemo stores computed/derived values from other state."

**Q: Why did you use `useState` for form state instead of a form library?**
A: "The requirements specified using React hooks. I used a single `useState` object to manage all form fields, which keeps the code simple and doesn't require additional dependencies. For larger forms, I might consider React Hook Form or Formik."

**Q: When does `useMemo` recalculate?**
A: "Only when its dependency array changes. In this case, when `step` or any of the `missingStepX` values change."

**Q: What's the difference between `useState` and `useMemo`?**
A: "`useState` stores state that can be directly updated. `useMemo` stores a computed/derived value that's calculated from other state. `useState` triggers re-renders when updated; `useMemo` prevents unnecessary recalculations."

**Q: Why is `useId` better than generating IDs manually?**
A: "It ensures uniqueness across component instances, works with SSR, and is the React-recommended approach for accessibility. Manual IDs can conflict if the same component is used multiple times."

---

## 📝 Code Examples Summary

```javascript
// 1. useState - Form state
const [form, setForm] = useState({
  legalEntityName: "",
  dbaName: "",
  // ... 30+ more fields
});

// 2. useState - Step navigation
const [step, setStep] = useState(1);

// 3. useState - UI state (collapsible sections)
const [open, setOpen] = useState({
  basic: true,
  facility: true,
  // ...
});

// 4. useMemo - Validation calculation
const canContinue = useMemo(() => {
  if (step === 1) return !missingStep1;
  if (step === 2) return !missingStep2;
  // ...
  return true;
}, [step, missingStep1, missingStep2, ...]);

// 5. useMemo - Search filtering
const filteredCategories = useMemo(() => {
  return categories
    .map((c) => ({
      ...c,
      items: c.items.filter((i) =>
        i.toLowerCase().includes(form.svc_search.toLowerCase())
      ),
    }))
    .filter((c) => c.items.length > 0);
}, [form.svc_search]);

// 6. useId - Accessibility
const id = useId(); // Used in DateField and ChipDateInput
<label htmlFor={id}>Label</label>
<input id={id} type="date" />
```

---

## Key Takeaways for Interview

1. **useState**: Used for all state management (form data, step navigation, UI state)
2. **useMemo**: Used for performance optimization (validation calculation, search filtering)
3. **useId**: Used for accessibility (connecting labels to inputs)
4. **Why these hooks?**: Each was chosen for a specific purpose - state management, performance, and accessibility

**Remember:** Each hook was chosen for a specific purpose - state management, performance, and accessibility! 🎯

Good luck with your interview! 🚀
