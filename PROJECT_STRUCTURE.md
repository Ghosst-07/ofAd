# Counselor Admin - Project Structure

This project has been refactored to be fully modular and maintainable. Here's the organization:

## 📁 Project Structure

```
ofadmin/
├── app/
│   ├── page.jsx           # Main application entry point
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── icons/
│   │   └── Icons.jsx      # SVG icon components
│   ├── ui/
│   │   ├── Input.jsx      # Standard input component
│   │   ├── PhoneInput.jsx # Phone input with +91 prefix
│   │   ├── Textarea.jsx   # Textarea component
│   │   └── TagInput.jsx   # Tag-based input for arrays
│   ├── forms/
│   │   ├── BasicInfoStep.jsx            # Step 1 form
│   │   ├── ProfessionalDetailsStep.jsx  # Step 2 form
│   │   └── RatesAndSettingsStep.jsx     # Step 3 form
│   ├── CounselorList.jsx  # List view component
│   ├── MessageAlert.jsx   # Success/error messages
│   └── Stepper.jsx        # Progress stepper
└── lib/
    ├── supabase.js        # Supabase client initialization
    └── constants.js       # App constants and initial state
```

## 🎯 Key Features

### 1. **Phone Number with Auto +91 Prefix**
- The phone input automatically adds +91 prefix
- Users only need to enter the 10-digit number
- Stored with prefix in database

### 2. **Modern Tag-Based Input**
- No more comma-separated values!
- **Specializations**: Add items like "Anxiety", "Depression" individually
- **Languages**: Add language codes like "en", "hi", "es" one by one
- Press Enter or click "Add" button
- Click X to remove tags

### 3. **Date of Birth Field**
- New date picker field added
- Stored in `date_of_birth` column in database

## 🔧 How to Edit

### Adding a New Input Field

1. **Update Constants** (`lib/constants.js`):
```javascript
export const initialFormState = {
  // ... existing fields
  new_field: "",  // Add your field
};
```

2. **Add to Form Step** (e.g., `components/forms/BasicInfoStep.jsx`):
```jsx
<Input
  label="New Field"
  id="new_field"
  value={formData.new_field}
  onChange={handleChange}
/>
```

3. **Update Submit Handler** (`app/page.jsx` - handleSubmit):
```javascript
const newCounselorData = {
  // ... existing fields
  new_field: formData.new_field || null,
};
```

### Creating a New Component

All components are modular. Example:
```jsx
// components/MyNewComponent.jsx
export const MyNewComponent = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};
```

Then import and use:
```jsx
import { MyNewComponent } from "@/components/MyNewComponent";
```

## 📝 Component Documentation

### UI Components (`components/ui/`)

#### Input
Standard text input with label and validation.
```jsx
<Input
  label="Field Name"
  id="field_id"
  value={value}
  onChange={handleChange}
  type="text"
  required={false}
/>
```

#### PhoneInput
Phone input with automatic +91 prefix.
```jsx
<PhoneInput
  label="Phone Number"
  id="phone_number"
  value={phoneNumber}  // Without prefix
  onChange={handleChange}
/>
```

#### TagInput
Array input with tag interface.
```jsx
<TagInput
  label="Tags"
  items={arrayOfItems}
  onAdd={(item) => /* add to array */}
  onRemove={(index) => /* remove from array */}
  placeholder="Add item..."
  helpText="Press Enter to add"
/>
```

### Form Steps (`components/forms/`)

Each step is a separate component for better organization:
- **BasicInfoStep**: Name, email, phone, DOB, avatar, bio
- **ProfessionalDetailsStep**: License, experience, specializations, languages
- **RatesAndSettingsStep**: Pricing and service toggles

### Other Components

- **CounselorList**: Displays all counselors with edit functionality
- **MessageAlert**: Shows success/error messages
- **Stepper**: Progress indicator for multi-step form

## 🚀 Running the Project

```bash
npm run dev
```

## 🔑 Environment Variables

Create a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 📊 Database Schema

The `counselors` table includes:
- Basic info: full_name, email, phone_number, avatar_url, bio
- **date_of_birth** (DATE) - newly added
- Professional: license_number, years_of_experience
- Arrays: specializations, languages
- Rates: rate_video_per_minute, rate_voice_per_minute, rate_chat_per_minute
- Toggles: accepts_chat, accepts_voice, accepts_video, is_active, is_accepting_calls

## 🎨 Styling

Using Tailwind CSS classes throughout. All components follow the same design system with:
- Indigo primary color
- Slate gray for backgrounds
- Consistent spacing and shadows
