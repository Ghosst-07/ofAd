"use client";
import React, { useState, useEffect } from "react";
// Import the official Supabase client
// Make sure to run `npm install @supabase/supabase-js`
// We use a CDN link here to make the preview work.
import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
// It will be null if the URL or Key is missing
const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "YOUR_SUPABASE_URL" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY"
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
    : null;

// --- Helper Components for UI ---
const Input = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  ...props
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium leading-6 text-slate-900"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="mt-2">
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        {...props}
      />
    </div>
  </div>
);

const Textarea = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  helpText,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium leading-6 text-slate-900"
    >
      {label}
    </label>
    <div className="mt-2">
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </div>
    {helpText && <p className="mt-2 text-sm text-slate-500">{helpText}</p>}
  </div>
);

const TagInput = ({ label, items, onAdd, onRemove, placeholder, helpText }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  const handleAddClick = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-slate-900">
        {label}
      </label>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block flex-1 rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        <button
          type="button"
          onClick={handleAddClick}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add
        </button>
      </div>
      {helpText && <p className="mt-1 text-sm text-slate-500">{helpText}</p>}
      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="group relative -mr-1 h-4 w-4 rounded-sm hover:bg-indigo-600/20"
              >
                <span className="sr-only">Remove</span>
                <svg
                  viewBox="0 0 14 14"
                  className="h-4 w-4 stroke-indigo-700/50 group-hover:stroke-indigo-700/75"
                >
                  <path d="M4 4l6 6m0-6l-6 6" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// --- SVG Icons for Sidebar ---
const UserPlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="17" y1="11" x2="23" y2="11"></line>
  </svg>
);

const ListIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

// --- Stepper Component ---
const Stepper = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Basic Info" },
    { id: 2, name: "Professional" },
    { id: 3, name: "Rates & Settings" },
  ];

  return (
    <nav aria-label="Progress" className="mb-12">
      <ol
        role="list"
        className="grid grid-cols-3 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm"
      >
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative overflow-hidden">
            <div
              className={`
              ${currentStep > step.id ? "bg-indigo-600" : ""}
              ${currentStep === step.id ? "border-indigo-600" : ""}
              ${stepIdx === 0 ? "rounded-l-md" : ""}
              ${stepIdx === steps.length - 1 ? "rounded-r-md" : ""}
              ${
                currentStep === step.id
                  ? "border-b-4"
                  : "border-b-4 border-transparent"
              }
              p-4 text-center text-sm font-medium
            `}
            >
              {currentStep > step.id ? (
                <span className="flex items-center justify-center text-white">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-2 hidden sm:inline">{step.name}</span>
                </span>
              ) : currentStep === step.id ? (
                <span className="flex items-center justify-center text-indigo-600">
                  <span className="h-5 w-5 rounded-full border-2 border-indigo-600 flex items-center justify-center text-xs">
                    {step.id}
                  </span>
                  <span className="ml-2 hidden sm:inline">{step.name}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center text-gray-500">
                  <span className="h-5 w-5 rounded-full border-2 border-gray-400 flex items-center justify-center text-xs">
                    {step.id}
                  </span>
                  <span className="ml-2 hidden sm:inline">{step.name}</span>
                </span>
              )}
            </div>

            {/* Arrow separator */}
            {stepIdx !== 0 ? (
              <div
                className="absolute top-0 right-0 h-full w-5"
                aria-hidden="true"
              >
                <svg
                  className="h-full w-full text-gray-200"
                  viewBox="0 0 22 80"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 -2L20 40L0 82"
                    vectorEffect="non-scaling-stroke"
                    stroke="currentcolor"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// --- Main Page Component ---

const initialState = {
  full_name: "",
  email: "",
  phone_number: "",
  avatar_url: "",
  bio: "",
  date_of_birth: "",
  license_number: "",
  specializations: [],
  languages: ["en"],
  years_of_experience: 0,
  rate_video_per_minute: 2.0,
  rate_voice_per_minute: 1.5,
  rate_chat_per_minute: 0.5,
  accepts_chat: true,
  accepts_voice: true,
  accepts_video: true,
  is_active: true,
  is_accepting_calls: true,
};

export default function App() {
  // --- State Management ---
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  const [currentTab, setCurrentTab] = useState("add"); // 'add' or 'view'
  const [currentStep, setCurrentStep] = useState(1); // For multi-step form

  const [counselors, setCounselors] = useState([]);
  const [counselorsLoading, setCounselorsLoading] = useState(false); // Default to false
  const [counselorsError, setCounselorsError] = useState(null);
  const [editingCounselorId, setEditingCounselorId] = useState(null);

  // --- Data Fetching ---
  // Fetch data only once on component mount
  useEffect(() => {
    if (supabase) {
      fetchCounselors();
    } else {
      setCounselorsError(
        "Supabase client not initialized. Please add your SUPABASE_URL and SUPABASE_ANON_KEY."
      );
      setCounselorsLoading(false);
    }
  }, []);

  const fetchCounselors = async () => {
    setCounselorsLoading(true);
    setCounselorsError(null);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("counselors")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCounselors(data);
      } else {
        throw new Error(
          "Supabase client not initialized. Add your URL and Key."
        );
      }
    } catch (error) {
      console.error("Error fetching counselors:", error.message);
      setCounselorsError(error.message);
    } finally {
      setCounselorsLoading(false);
    }
  };

  // --- Handlers ---

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleResetForm = () => {
    setFormData(initialState);
    setMessage({ type: "", content: "" });
    setEditingCounselorId(null);
    setCurrentStep(1); // Reset to first step
  };

  const handleSetTab = (tab) => {
    setCurrentTab(tab);
    if (tab === "add" && !editingCounselorId) {
      // If switching to 'add' tab and not editing, reset form
      handleResetForm();
    }
    if (tab === "add") {
      setMessage({ type: "", content: "" }); // Clear messages
    }
  };

  const handleEditClick = (counselor) => {
    setEditingCounselorId(counselor.id);
    setFormData({
      full_name: counselor.full_name,
      email: counselor.email,
      phone_number: counselor.phone_number,
      avatar_url: counselor.avatar_url || "",
      bio: counselor.bio || "",
      date_of_birth: counselor.date_of_birth || "",
      license_number: counselor.license_number || "",
      specializations: counselor.specializations || [],
      languages: counselor.languages || ["en"],
      years_of_experience: counselor.years_of_experience,
      rate_video_per_minute: counselor.rate_video_per_minute,
      rate_voice_per_minute: counselor.rate_voice_per_minute,
      rate_chat_per_minute: counselor.rate_chat_per_minute,
      accepts_chat: counselor.accepts_chat,
      accepts_voice: counselor.accepts_voice,
      accepts_video: counselor.accepts_video,
      is_active: counselor.is_active,
      is_accepting_calls: counselor.is_accepting_calls,
    });
    setMessage({ type: "", content: "" });
    setCurrentStep(1); // Start editing from step 1
    setCurrentTab("add");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    // --- Data Transformation ---
    const newCounselorData = {
      full_name: formData.full_name,
      email: formData.email || null,
      phone_number: formData.phone_number,
      avatar_url: formData.avatar_url || null,
      bio: formData.bio || null,
      date_of_birth: formData.date_of_birth || null,
      license_number: formData.license_number || null,
      specializations: formData.specializations,
      languages: formData.languages,
      years_of_experience: parseInt(formData.years_of_experience, 10) || 0,
      rate_video_per_minute: parseFloat(formData.rate_video_per_minute) || 0,
      rate_voice_per_minute: parseFloat(formData.rate_voice_per_minute) || 0,
      rate_chat_per_minute: parseFloat(formData.rate_chat_per_minute) || 0,
      accepts_chat: formData.accepts_chat,
      accepts_voice: formData.accepts_voice,
      accepts_video: formData.accepts_video,
      is_active: formData.is_active,
      is_accepting_calls: formData.is_accepting_calls,
    };

    // --- Database Insertion/Update Logic ---
    try {
      if (editingCounselorId) {
        // --- UPDATE LOGIC ---
        console.log(
          "Updating counselor:",
          editingCounselorId,
          newCounselorData
        );
        if (supabase) {
          const { data, error } = await supabase
            .from("counselors")
            .update(newCounselorData)
            .eq("id", editingCounselorId) // <-- This line ensures only this ID is updated
            .select();
          if (error) throw error;

          if (data && data.length > 0) {
            setMessage({
              type: "success",
              content: `Successfully updated counselor: ${data[0].full_name}`,
            });
            // Update local state instantly
            setCounselors(
              counselors.map((c) => (c.id === data[0].id ? data[0] : c))
            );
          } else {
            setMessage({
              type: "success",
              content: "Successfully updated counselor.",
            });
          }

          handleResetForm();
          setCurrentTab("view"); // Go back to list after update
        } else {
          setMessage({
            type: "error",
            content: "Supabase client is not initialized.",
          });
        }
      } else {
        // --- INSERT LOGIC ---
        console.log("Inserting counselor:", newCounselorData);
        if (supabase) {
          const { data, error } = await supabase
            .from("counselors")
            .insert([newCounselorData])
            .select();
          if (error) throw error;

          if (data && data.length > 0) {
            setMessage({
              type: "success",
              content: `Successfully added counselor: ${data[0].full_name}`,
            });
            setCounselors([data[0], ...counselors]);
          } else {
            setMessage({
              type: "success",
              content: "Successfully added counselor.",
            });
          }
          handleResetForm(); // Reset form on success
        } else {
          setMessage({
            type: "error",
            content: "Supabase client is not initialized.",
          });
        }
      }
    } catch (error) {
      console.error("Error saving counselor:", error.message);
      setMessage({ type: "error", content: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <Stepper currentStep={currentStep} />

      {/* --- Step 1: Basic Information --- */}
      <div className={currentStep === 1 ? "block" : "hidden"}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-lg font-semibold leading-7 text-slate-900">
              Basic Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Core details for the counselor&apos;s public profile and internal
              identification.
            </p>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl md:col-span-2">
            <div className="p-4 sm:p-6">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Input
                    label="Full Name"
                    id="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Dr. Jane Doe"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    label="Email Address"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane.doe@example.com"
                    autoComplete="email"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    label="Phone Number"
                    id="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="+919876543210"
                    required
                    autoComplete="tel"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    label="Date of Birth"
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    label="Avatar URL"
                    id="avatar_url"
                    type="url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.png"
                  />
                </div>
                <div className="sm:col-span-6">
                  <Textarea
                    label="Biography"
                    id="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="A brief bio about the counselor..."
                    helpText="This will be displayed on their public profile."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Step 2: Professional Details --- */}
      <div className={currentStep === 2 ? "block" : "hidden"}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-lg font-semibold leading-7 text-slate-900">
              Professional Details
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Credentials, experience, and areas of expertise.
            </p>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl md:col-span-2">
            <div className="p-4 sm:p-6">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Input
                    label="License Number"
                    id="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    placeholder="MH-12345"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    label="Years of Experience"
                    id="years_of_experience"
                    type="number"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="sm:col-span-6">
                  <TagInput
                    label="Specializations"
                    items={formData.specializations}
                    onAdd={(item) =>
                      setFormData((prev) => ({
                        ...prev,
                        specializations: [...prev.specializations, item],
                      }))
                    }
                    onRemove={(index) =>
                      setFormData((prev) => ({
                        ...prev,
                        specializations: prev.specializations.filter(
                          (_, i) => i !== index
                        ),
                      }))
                    }
                    placeholder="e.g., Anxiety, Depression, Trauma"
                    helpText="Press Enter or click Add to add each specialization"
                  />
                </div>
                <div className="sm:col-span-6">
                  <TagInput
                    label="Languages"
                    items={formData.languages}
                    onAdd={(item) =>
                      setFormData((prev) => ({
                        ...prev,
                        languages: [...prev.languages, item],
                      }))
                    }
                    onRemove={(index) =>
                      setFormData((prev) => ({
                        ...prev,
                        languages: prev.languages.filter((_, i) => i !== index),
                      }))
                    }
                    placeholder="e.g., en, hi, es"
                    helpText="Press Enter or click Add to add each language code"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Step 3: Rates & Availability --- */}
      <div className={currentStep === 3 ? "block" : "hidden"}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-lg font-semibold leading-7 text-slate-900">
              Rates & Platform Settings
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Manage pricing and which services the counselor will offer.
            </p>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl md:col-span-2">
            <div className="p-4 sm:p-6">
              {/* Rates Grid */}
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mb-8">
                <div className="sm:col-span-2">
                  <Input
                    label="Video Rate (per min)"
                    id="rate_video_per_minute"
                    type="number"
                    value={formData.rate_video_per_minute}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Voice Rate (per min)"
                    id="rate_voice_per_minute"
                    type="number"
                    value={formData.rate_voice_per_minute}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Chat Rate (per min)"
                    id="rate_chat_per_minute"
                    type="number"
                    value={formData.rate_chat_per_minute}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Toggles */}
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-slate-900">
                  Service & Account Status
                </legend>
                <div className="mt-4 space-y-4">
                  {[
                    { id: "accepts_video", label: "Accepts Video Calls" },
                    { id: "accepts_voice", label: "Accepts Voice Calls" },
                    { id: "accepts_chat", label: "Accepts Chat" },
                    { id: "is_active", label: "Is Active" },
                    { id: "is_accepting_calls", label: "Accepting Calls" },
                  ].map((item) => (
                    <div key={item.id} className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id={item.id}
                          name={item.id}
                          type="checkbox"
                          checked={formData[item.id]}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label
                          htmlFor={item.id}
                          className="font-medium text-slate-900"
                        >
                          {item.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>

      {/* --- Form Actions --- */}
      <div className="mt-10 flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={handleResetForm}
            disabled={loading}
            className="text-sm font-semibold leading-6 text-slate-900 hover:text-slate-700"
          >
            Cancel
          </button>
        </div>

        <div className="flex items-center gap-x-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              disabled={loading}
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
            >
              Previous
            </button>
          )}

          {currentStep < 3 && (
            <button
              type="button"
              onClick={nextStep}
              disabled={loading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Next
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingCounselorId
                ? "Update Counselor"
                : "Save Counselor"}
            </button>
          )}
        </div>
      </div>
    </form>
  );

  const renderViewAll = () => (
    <div className="mt-6">
      {" "}
      {/* Removed mt-10 */}
      <div className="flex justify-end items-center mb-6">
        {/* H2 removed, title is now the main H1 */}
        <button
          onClick={fetchCounselors}
          disabled={counselorsLoading || !supabase}
          className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          {counselorsLoading ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="-ml-0.5 h-4 w-4 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312.311a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 11.708-.708L5 12.293V9.5a.5.5 0 011 0v3.5a.5.5 0 01-.146.354l-1.5 1.5a.5.5 0 01-.708 0L3.336 14a6.5 6.5 0 019.633-3.007.5.5 0 01.38.635l-.5 2a.5.5 0 01-.966-.24l.412-1.65A5.5 5.5 0 0115.312 11.424zM4.688 8.576a5.5 5.5 0 019.201-2.466l.312-.311a.5.5 0 01.708 0l1.5 1.5a.5.5 0 01-.708.708L15 7.707V10.5a.5.5 0 01-1 0V7a.5.5 0 01.146-.354l1.5-1.5a.5.5 0 01.708 0L16.664 6a6.5 6.5 0 01-9.633 3.007.5.5 0 01-.38-.635l.5-2a.5.5 0 01.966.24l-.412 1.65A5.5 5.5 0 014.688 8.576z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {counselorsLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {counselorsLoading && counselors.length === 0 && (
        <p className="mt-4 text-slate-500">Loading counselors...</p>
      )}
      {counselorsError && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            Error: {counselorsError}
          </p>
        </div>
      )}
      {!counselorsLoading && counselors.length === 0 && !counselorsError && (
        <p className="mt-4 text-slate-500">
          No counselors found. Add one to get started.
        </p>
      )}
      {/* Enclose list in a card */}
      {counselors.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
          <ul role="list" className="divide-y divide-gray-200">
            {counselors.map((counselor) => (
              <li
                key={counselor.id}
                className="flex items-center justify-between gap-x-6 p-4 hover:bg-gray-50"
              >
                <div className="flex min-w-0 gap-x-4">
                  <img
                    className="h-12 w-12 flex-none rounded-full bg-gray-50 object-cover"
                    src={
                      counselor.avatar_url ||
                      "https://placehold.co/100x100/E2E8F0/475569?text=??"
                    }
                    alt=""
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {counselor.full_name}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {counselor.email || "No email"}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {counselor.phone_number}
                    </p>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-x-4">
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    {counselor.is_active ? (
                      <div className="mt-1 flex items-center gap-x-1.5">
                        <div className="flex-none rounded-full bg-green-500/20 p-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        </div>
                        <p className="text-xs leading-5 text-gray-500">
                          Active
                        </p>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-x-1.5">
                        <div className="flex-none rounded-full bg-red-500/20 p-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        </div>
                        <p className="text-xs leading-5 text-gray-500">
                          Inactive
                        </p>
                      </div>
                    )}
                    <p className="text-xs leading-5 text-gray-500">
                      {counselor.is_accepting_calls
                        ? "Accepting Calls"
                        : "Not Accepting Calls"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditClick(counselor)}
                    className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-slate-100 font-sans">
      {/* --- Sidebar Navigation --- */}
      <nav className="w-64 flex-none bg-slate-900 text-slate-300 flex flex-col p-4 space-y-2">
        <div className="px-3 pb-4 mb-2 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Counselor HQ</h2>
        </div>
        <button
          onClick={() => handleSetTab("add")}
          className={`
            flex items-center gap-x-3 w-full rounded-md p-3 text-sm font-medium
            ${
              currentTab === "add"
                ? "bg-indigo-600 text-white"
                : "hover:bg-slate-800 hover:text-white"
            }
          `}
        >
          <UserPlusIcon />
          <span>
            {editingCounselorId ? "Edit Counselor" : "Add New Counselor"}
          </span>
        </button>
        <button
          onClick={() => handleSetTab("view")}
          className={`
            flex items-center gap-x-3 w-full rounded-md p-3 text-sm font-medium
            ${
              currentTab === "view"
                ? "bg-indigo-600 text-white"
                : "hover:bg-slate-800 hover:text-white"
            }
          `}
        >
          <ListIcon />
          <span>View All Counselors</span>
        </button>
      </nav>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-8 overflow-auto">
        {/* --- Dynamic Header --- */}
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">
          {currentTab === "add"
            ? editingCounselorId
              ? `Edit: ${formData.full_name}`
              : "Add New Counselor"
            : `All Counselors (${counselors.length})`}
        </h1>

        {/* --- Message Display --- */}
        {message.content && (
          <div
            className={`rounded-md ${
              message.type === "success" ? "bg-green-50" : "bg-red-50"
            } p-4 my-6`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === "success" ? (
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    message.type === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab Content --- */}
        {currentTab === "add" && renderForm()}
        {currentTab === "view" && renderViewAll()}
      </main>
    </div>
  );
}
