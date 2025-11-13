import { Input } from "../ui/Input";
import { PhoneInput } from "../ui/PhoneInput";
import { Textarea } from "../ui/Textarea";

export const BasicInfoStep = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-3">
      <div className="px-0 sm:px-0">
        <h2 className="text-base sm:text-lg font-semibold leading-7 text-slate-900">
          Basic Information
        </h2>
        <p className="mt-1 text-xs sm:text-sm leading-6 text-slate-600">
          Core details for the counselor&apos;s public profile and internal
          identification.
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-slate-900/5 rounded-lg sm:rounded-xl lg:col-span-2">
        <div className="p-4 sm:p-6">
          <div className="grid max-w-2xl grid-cols-1 gap-x-4 gap-y-6 sm:gap-x-6 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
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
            <div className="col-span-full sm:col-span-3">
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
            <div className="col-span-full sm:col-span-3">
              <PhoneInput
                label="Phone Number"
                id="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                autoComplete="tel"
              />
            </div>
            <div className="col-span-full sm:col-span-3">
              <Input
                label="Date of Birth"
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-full sm:col-span-6">
              <Input
                label="Avatar URL"
                id="avatar_url"
                type="url"
                value={formData.avatar_url}
                onChange={handleChange}
                placeholder="https://example.com/avatar.png"
              />
            </div>
            <div className="col-span-full">
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
  );
};
