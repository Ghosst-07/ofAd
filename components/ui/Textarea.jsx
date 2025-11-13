export const Textarea = ({
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
