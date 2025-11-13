# Common Customizations Guide

## 🎨 Styling Changes

### Change Primary Color (from Indigo to Blue)

Find and replace in all files:

- `indigo-600` → `blue-600`
- `indigo-500` → `blue-500`
- `indigo-50` → `blue-50`
- `indigo-700` → `blue-700`

### Change Sidebar Color

Edit `app/page.jsx`, sidebar navigation section:

```jsx
<nav className="w-64 flex-none bg-blue-900 text-blue-300 ...">
  {/* Change bg-slate-900 to your color */}
</nav>
```

## 📝 Form Customizations

### Add a New Field (Example: "City")

**1. Update constants** (`lib/constants.js`):

```javascript
export const initialFormState = {
  // ... existing fields
  city: "", // Add here
};
```

**2. Add to BasicInfoStep** (`components/forms/BasicInfoStep.jsx`):

```jsx
<div className="sm:col-span-3">
  <Input
    label="City"
    id="city"
    value={formData.city}
    onChange={handleChange}
    placeholder="Mumbai"
  />
</div>
```

**3. Update handleSubmit** (`app/page.jsx`):

```javascript
const newCounselorData = {
  // ... existing fields
  city: formData.city || null,
};
```

**4. Update handleEditClick** (`app/page.jsx`):

```javascript
setFormData({
  // ... existing fields
  city: counselor.city || "",
});
```

**5. Add to database**:

```sql
ALTER TABLE counselors ADD COLUMN city TEXT;
```

### Change Phone Prefix (from +91 to +1)

Edit `lib/constants.js`:

```javascript
export const PHONE_PREFIX = "+1"; // Change from "+91"
```

### Make a Field Required

Add `required` prop:

```jsx
<Input
  label="License Number"
  id="license_number"
  value={formData.license_number}
  onChange={handleChange}
  required={true} // Add this
/>
```

### Add Dropdown/Select Field

Create new component `components/ui/Select.jsx`:

```jsx
export const Select = ({ label, id, value, onChange, options, required }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium leading-6 text-slate-900"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="mt-2">
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);
```

Use it:

```jsx
<Select
  label="Gender"
  id="gender"
  value={formData.gender}
  onChange={handleChange}
  options={[
    { value: "", label: "Select..." },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ]}
/>
```

## 🔧 Functionality Changes

### Add Confirmation Before Delete

In `CounselorList.jsx`, add delete button:

```jsx
const handleDelete = async (id, name) => {
  if (window.confirm(`Are you sure you want to delete ${name}?`)) {
    const { error } = await supabase.from("counselors").delete().eq("id", id);

    if (!error) {
      onRefresh();
    }
  }
};

// In the JSX:
<button
  onClick={() => handleDelete(counselor.id, counselor.full_name)}
  className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
>
  Delete
</button>;
```

### Add Search/Filter to Counselor List

In `CounselorList.jsx`:

```jsx
import { useState } from "react";

export const CounselorList = ({ counselors, ... }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCounselors = counselors.filter((c) =>
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-6">
      <input
        type="text"
        placeholder="Search counselors..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300"
      />

      {/* Use filteredCounselors instead of counselors */}
      {filteredCounselors.map((counselor) => ...)}
    </div>
  );
};
```

### Add File Upload for Avatar

1. Install Supabase storage library (if needed)
2. Create upload component:

```jsx
const AvatarUpload = ({ onUpload }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (!error) {
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);
      onUpload(urlData.publicUrl);
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
    />
  );
};
```

### Change Number of Steps

Edit `components/Stepper.jsx`:

```javascript
const steps = [
  { id: 1, name: "Basic Info" },
  { id: 2, name: "Professional" },
  { id: 3, name: "Rates" },
  { id: 4, name: "Settings" }, // Add new step
];
```

Then create new step component and update `page.jsx`.

## 📱 Responsive Adjustments

### Hide Sidebar on Mobile

In `app/page.jsx`:

```jsx
<nav className="w-64 flex-none bg-slate-900 text-slate-300 flex flex-col p-4 space-y-2 hidden md:flex">
  {/* Added: hidden md:flex */}
</nav>
```

Add mobile menu button:

```jsx
const [sidebarOpen, setSidebarOpen] = useState(false);

// Mobile menu button
<button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
  <svg className="h-6 w-6" ...>...</svg>
</button>
```

### Adjust Form Layout for Tablets

In form step components, change grid:

```jsx
<div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 lg:grid-cols-12">
  <div className="sm:col-span-3 lg:col-span-4">{/* Responsive columns */}</div>
</div>
```

## 🚀 Performance Optimizations

### Lazy Load Components

```jsx
import dynamic from "next/dynamic";

const CounselorList = dynamic(() =>
  import("@/components/CounselorList").then((mod) => ({
    default: mod.CounselorList,
  }))
);
```

### Memoize Expensive Calculations

```jsx
import { useMemo } from "react";

const sortedCounselors = useMemo(() => {
  return counselors.sort((a, b) => a.full_name.localeCompare(b.full_name));
}, [counselors]);
```

## 🔐 Security Enhancements

### Add Row Level Security (RLS) in Supabase

```sql
-- Enable RLS
ALTER TABLE counselors ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Enable read access for authenticated users"
ON counselors FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON counselors FOR INSERT
TO authenticated
WITH CHECK (true);
```

### Validate Phone Numbers

In `PhoneInput.jsx`:

```javascript
const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile numbers
  return phoneRegex.test(phone);
};
```
