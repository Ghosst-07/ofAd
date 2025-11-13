export const Input = ({
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
