import { PHONE_PREFIX } from "@/lib/constants";

export const PhoneInput = ({
  label,
  id,
  value,
  onChange,
  required = false,
  autoComplete,
  ...props
}) => {
  const handlePhoneChange = (e) => {
    let inputValue = e.target.value;

    // Remove any existing prefix to avoid duplication
    if (inputValue.startsWith(PHONE_PREFIX)) {
      inputValue = inputValue.slice(PHONE_PREFIX.length);
    }

    // Only allow numbers
    inputValue = inputValue.replace(/[^\d]/g, "");

    // Create event with formatted value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: id,
        value: inputValue,
      },
    };

    onChange(syntheticEvent);
  };

  const displayValue = value ? `${PHONE_PREFIX}${value}` : PHONE_PREFIX;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-slate-900"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2">
        <input
          type="tel"
          id={id}
          name={id}
          value={displayValue}
          onChange={handlePhoneChange}
          placeholder={`${PHONE_PREFIX}9876543210`}
          required={required}
          autoComplete={autoComplete}
          className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          {...props}
        />
      </div>
    </div>
  );
};
