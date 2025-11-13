import { Input } from "../ui/Input";
import { TagInput } from "../ui/TagInput";

export const ProfessionalDetailsStep = ({
  formData,
  setFormData,
  handleChange,
}) => {
  return (
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
  );
};
