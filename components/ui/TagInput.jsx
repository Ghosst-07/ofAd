"use client";
import { useState } from "react";

export const TagInput = ({
  label,
  items,
  onAdd,
  onRemove,
  placeholder,
  helpText,
}) => {
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
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
