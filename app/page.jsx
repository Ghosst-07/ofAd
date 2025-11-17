"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { initialFormState, PHONE_PREFIX } from "@/lib/constants";
import { UserPlusIcon, ListIcon } from "@/components/icons/Icons";
import { MenuIcon, CloseIcon } from "@/components/icons/MenuIcons";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Auto-dismiss success messages after 5 seconds
  useEffect(() => {
    if (message.type === "success" && message.content) {
      const timer = setTimeout(() => {
        setMessage({ type: "", content: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

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
  const nextStep = (e) => {
    if (e) e.preventDefault();
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };
  const prevStep = (e) => {
    if (e) e.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

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
    setMobileMenuOpen(false);
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
      email: counselor.email || "",
      phone_number: phoneNumber,
      avatar_url: counselor.avatar_url || "",
      bio: counselor.bio || "",
      date_of_birth: counselor.date_of_birth || "",
      license_number: counselor.license_number || "",
      specializations: counselor.specializations || [],
      languages: counselor.languages || ["en"],
      years_of_experience: counselor.years_of_experience || 0,
      rate_video_per_minute: counselor.rate_video_per_minute ?? 2.0,
      rate_voice_per_minute: counselor.rate_voice_per_minute ?? 1.5,
      rate_chat_per_minute: counselor.rate_chat_per_minute ?? 0.5,
      accepts_chat: counselor.accepts_chat ?? true,
      accepts_voice: counselor.accepts_voice ?? true,
      accepts_video: counselor.accepts_video ?? true,
      is_active: counselor.is_active ?? true,
      is_accepting_calls: counselor.is_accepting_calls ?? true,
    });
    setMessage({ type: "", content: "" });
    setCurrentStep(1);
    setCurrentTab("add");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    // Validation
    if (!formData.full_name || formData.full_name.trim() === "") {
      setMessage({
        type: "error",
        content: "Please enter the counselor's full name.",
      });
      setLoading(false);
      setCurrentStep(1);
      return;
    }

    if (!formData.phone_number || formData.phone_number.trim() === "") {
      setMessage({
        type: "error",
        content: "Please enter a valid phone number.",
      });
      setLoading(false);
      setCurrentStep(1);
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage({
        type: "error",
        content: "Please enter a valid email address.",
      });
      setLoading(false);
      setCurrentStep(1);
      return;
    }

    if (formData.specializations.length === 0) {
      setMessage({
        type: "error",
        content: "Please add at least one specialization.",
      });
      setLoading(false);
      setCurrentStep(2);
      return;
    }

    if (formData.languages.length === 0) {
      setMessage({
        type: "error",
        content: "Please add at least one language.",
      });
      setLoading(false);
      setCurrentStep(2);
      return;
    }

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
        // UPDATE - normalized schema uses auth_user_id FK, but we update by counselor.id
        if (!supabase) {
          throw new Error(
            "Database connection not available. Please check your internet connection."
          );
        }

        // Map to schema structure for update
        const updatePayload = {
          full_name: newCounselorData.full_name,
          email: newCounselorData.email,
          phone_number: newCounselorData.phone_number,
          avatar_url: newCounselorData.avatar_url,
          bio: newCounselorData.bio,
          date_of_birth: newCounselorData.date_of_birth,
          license_number: newCounselorData.license_number,
          specializations: newCounselorData.specializations,
          languages: newCounselorData.languages,
          years_of_experience: newCounselorData.years_of_experience,
          rate_video_per_minute: newCounselorData.rate_video_per_minute,
          rate_voice_per_minute: newCounselorData.rate_voice_per_minute,
          rate_chat_per_minute: newCounselorData.rate_chat_per_minute,
          accepts_chat: newCounselorData.accepts_chat,
          accepts_voice: newCounselorData.accepts_voice,
          accepts_video: newCounselorData.accepts_video,
          is_active: newCounselorData.is_active,
          is_accepting_calls: newCounselorData.is_accepting_calls,
        };

        const { data, error } = await supabase
          .from("counselors")
          .update(updatePayload)
          .eq("id", editingCounselorId)
          .select();

        if (error) {
          if (error.code === "PGRST116") {
            throw new Error("Counselor not found. They may have been deleted.");
          }
          throw new Error(`Update failed: ${error.message}`);
        }

        if (data && data.length > 0) {
          setMessage({
            type: "success",
            content: `🎉 Successfully updated ${data[0].full_name}'s profile!`,
          });
          setCounselors(
            counselors.map((c) => (c.id === data[0].id ? data[0] : c))
          );
        } else {
          setMessage({
            type: "success",
            content: "✅ Counselor profile updated successfully!",
          });
        }

        handleResetForm();
        // Delay tab switch to show success message
        setTimeout(() => setCurrentTab("view"), 1500);
      } else {
        // INSERT
        if (!supabase) {
          throw new Error(
            "Database connection not available. Please check your internet connection."
          );
        }

        // Call Next.js API route (no Supabase CLI required)
        const apiRes = await fetch("/api/create-counselor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCounselorData),
        });

        const apiJson = await apiRes.json();
        if (!apiRes.ok) {
          throw new Error(apiJson.error || "Failed to create counselor");
        }

        const createdCounselor = apiJson.counselor;

        if (createdCounselor) {
          setMessage({
            type: "success",
            content: `🎉 Successfully added ${createdCounselor.full_name} to the team!`,
          });
          setCounselors([createdCounselor, ...counselors]);
        } else {
          setMessage({
            type: "success",
            content: "✅ New counselor added successfully!",
          });
        }

        handleResetForm();
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error submitting counselor:", error);

      // User-friendly error messages
      let errorMessage = error.message;

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        errorMessage =
          "❌ Network error. Please check your internet connection and try again.";
      } else if (error.message.includes("JWT")) {
        errorMessage =
          "❌ Session expired. Please refresh the page and try again.";
      } else if (error.message.includes("permission")) {
        errorMessage = "❌ You don't have permission to perform this action.";
      } else if (
        !error.message.includes("❌") &&
        !error.message.includes("🎉")
      ) {
        errorMessage = `❌ ${errorMessage}`;
      }

      setMessage({
        type: "error",
        content: errorMessage,
      });

      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
        <div className="order-2 sm:order-1">
          <button
            type="button"
            onClick={handleResetForm}
            className="w-full sm:w-auto rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            Clear Form
          </button>
        </div>
        <div className="flex gap-x-3 order-1 sm:order-2">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={(e) => prevStep(e)}
              className="flex-1 sm:flex-none rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={(e) => nextStep(e)}
              className="flex-1 sm:flex-none rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 active:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || !supabase}
              className="flex-1 sm:flex-none rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 active:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-slate-900 text-white shadow-lg"
      >
        {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <nav
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 flex-none bg-slate-900 text-slate-300 flex flex-col p-4 space-y-2
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
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
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Dynamic Header */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-4 sm:mb-6 mt-12 lg:mt-0">
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
