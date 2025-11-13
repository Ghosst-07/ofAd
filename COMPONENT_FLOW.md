# Component Hierarchy

```
App (page.jsx)
│
├── Sidebar Navigation
│   ├── UserPlusIcon
│   └── ListIcon
│
└── Main Content
    ├── MessageAlert
    │
    ├── Add/Edit Form (when currentTab === "add")
    │   ├── Stepper
    │   │
    │   ├── Step 1: BasicInfoStep
    │   │   ├── Input (Full Name)
    │   │   ├── Input (Email)
    │   │   ├── PhoneInput (+91 prefix)
    │   │   ├── Input (Date of Birth)
    │   │   ├── Input (Avatar URL)
    │   │   └── Textarea (Bio)
    │   │
    │   ├── Step 2: ProfessionalDetailsStep
    │   │   ├── Input (License Number)
    │   │   ├── Input (Years of Experience)
    │   │   ├── TagInput (Specializations)
    │   │   └── TagInput (Languages)
    │   │
    │   └── Step 3: RatesAndSettingsStep
    │       ├── Input (Video Rate)
    │       ├── Input (Voice Rate)
    │       ├── Input (Chat Rate)
    │       └── Checkboxes (Service Toggles)
    │
    └── CounselorList (when currentTab === "view")
        └── List Items
            ├── Avatar Image
            ├── Counselor Info
            └── Edit Button
```

## Data Flow

### Adding/Editing Counselor
1. User fills form → `formData` state
2. Submit → `handleSubmit()`
3. Phone number gets +91 prefix automatically
4. Data sent to Supabase
5. Local state updated
6. Success message shown

### Phone Number Handling
```
User Input: "9876543210"
    ↓
PhoneInput Component: Stores as "9876543210" in state
    ↓
handleSubmit: Adds prefix → "+919876543210"
    ↓
Saved to Database: "+919876543210"
    ↓
Display in List: "+919876543210"
    ↓
Edit Mode: Removes prefix → "9876543210" in form
```

### Tag Input Flow
```
User types "Anxiety" + Enter
    ↓
TagInput onAdd callback
    ↓
setFormData updates array: [...prev, "Anxiety"]
    ↓
Displayed as colored tag badge
    ↓
Click X → onRemove callback → filtered array
```

## State Management

### Main States
- `formData`: Current form values
- `counselors`: Array of all counselors
- `currentTab`: "add" or "view"
- `currentStep`: 1, 2, or 3
- `editingCounselorId`: null or counselor ID
- `message`: { type: "success"|"error", content: "" }

### Form Reset Flow
```
handleResetForm()
    ↓
formData = initialFormState
editingCounselorId = null
currentStep = 1
message = cleared
```
