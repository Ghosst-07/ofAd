import { Input } from "../ui/Input";

export const RatesAndSettingsStep = ({ formData, handleChange }) => {
  const serviceToggles = [
    { id: "accepts_video", label: "Accepts Video Calls" },
    { id: "accepts_voice", label: "Accepts Voice Calls" },
    { id: "accepts_chat", label: "Accepts Chat" },
    { id: "is_active", label: "Is Active" },
    { id: "is_accepting_calls", label: "Accepting Calls" },
  ];

  return (
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
              {serviceToggles.map((item) => (
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
  );
};
