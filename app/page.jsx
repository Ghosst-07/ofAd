"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { initialFormState, PHONE_PREFIX } from "@/lib/constants";
import { UserPlusIcon, ListIcon } from "@/components/icons/Icons";
import { Stepper } from "@/components/Stepper";
import { BasicInfoStep } from "@/components/forms/BasicInfoStep";
import { ProfessionalDetailsStep } from "@/components/forms/ProfessionalDetailsStep";
import { RatesAndSettingsStep } from "@/components/forms/RatesAndSettingsStep";
import { CounselorList } from "@/components/CounselorList";
import { MessageAlert } from "@/components/MessageAlert";

export default function App() {
  // --- State Management ---
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [currentTab, setCurrentTab] = useState("add");
  const [currentStep, setCurrentStep] = useState(1);
  const [counselors, setCounselors] = useState([]);
  const [counselorsLoading, setCounselorsLoading] = useState(false);
  const [counselorsError, setCounselorsError] = useState(null);
  const [editingCounselorId, setEditingCounselorId] = useState(null);

  // --- Data Fetching ---
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
    setFormData(initialFormState);
    setMessage({ type: "", content: "" });
    setEditingCounselorId(null);
    setCurrentStep(1);
  };

  const handleSetTab = (tab) => {
    setCurrentTab(tab);
    if (tab === "add" && !editingCounselorId) {
      handleResetForm();
    }
    if (tab === "add") {
      setMessage({ type: "", content: "" });
    }
  };

  const handleEditClick = (counselor) => {
    setEditingCounselorId(counselor.id);
    
    // Remove the +91 prefix from phone number if it exists
    let phoneNumber = counselor.phone_number || "";
    if (phoneNumber.startsWith(PHONE_PREFIX)) {
      phoneNumber = phoneNumber.slice(PHONE_PREFIX.length);
    }
    
    setFormData({
      full_name: counselor.full_name,
      email: counselor.email,
      phone_number: phoneNumber,
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
    setCurrentStep(1);
    setCurrentTab("add");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    // Add +91 prefix to phone number if not already present
    const phoneNumber = formData.phone_number.startsWith(PHONE_PREFIX)
      ? formData.phone_number
      : `${PHONE_PREFIX}${formData.phone_number}`;

    const newCounselorData = {
      full_name: formData.full_name,
      email: formData.email || null,
      phone_number: phoneNumber,
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

    try {
      if (editingCounselorId) {
        // UPDATE
        if (supabase) {
          const { data, error } = await supabase
            .from("counselors")
            .update(newCounselorData)
            .eq("id", editingCounselorId)
            .select();
          if (error) throw error;

          if (data && data.length > 0) {
            setMessage({
              type: "success",
              content: `Successfully updated counselor: ${data[0].full_name}`,
            });
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
          setCurrentTab("view");
        } else {
          setMessage({
            type: "error",
            content: "Supabase client is not initialized.",
          });
        }
      } else {
        // INSERT
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
          handleResetForm();
        } else {
          setMessage({
            type: "error",
            content: "Supabase client is not initialized.",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting counselor:", error.message);
      setMessage({
        type: "error",
        content: `Failed: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Render Form ---
  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-12">
      <Stepper currentStep={currentStep} />

      {currentStep === 1 && (
        <BasicInfoStep formData={formData} handleChange={handleChange} />
      )}

      {currentStep === 2 && (
        <ProfessionalDetailsStep
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
        />
      )}

      {currentStep === 3 && (
        <RatesAndSettingsStep formData={formData} handleChange={handleChange} />
      )}

      {/* Form Actions */}
      <div className="mt-10 flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={handleResetForm}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-gray-50"
          >
            Clear Form
          </button>
        </div>
        <div className="flex gap-x-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || !supabase}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {loading
                ? "Submitting..."
                : editingCounselorId
                ? "Update Counselor"
                : "Add Counselor"}
            </button>
          )}
        </div>
      </div>
    </form>
  );

  return (
    <div className="flex min-h-screen w-full bg-slate-100 font-sans">
      {/* Sidebar Navigation */}
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

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Dynamic Header */}
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">
          {currentTab === "add"
            ? editingCounselorId
              ? `Edit: ${formData.full_name}`
              : "Add New Counselor"
            : `All Counselors (${counselors.length})`}
        </h1>

        {/* Message Display */}
        <MessageAlert message={message} />

        {/* Tab Content */}
        {currentTab === "add" && renderForm()}
        {currentTab === "view" && (
          <CounselorList
            counselors={counselors}
            counselorsLoading={counselorsLoading}
            counselorsError={counselorsError}
            onRefresh={fetchCounselors}
            onEdit={handleEditClick}
            supabase={supabase}
          />
        )}
      </main>
    </div>
  );
}
