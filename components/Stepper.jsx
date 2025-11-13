export const Stepper = ({ currentStep }) => {
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
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {step.name}
                </span>
              ) : (
                <span
                  className={
                    currentStep === step.id
                      ? "text-indigo-600"
                      : "text-slate-700"
                  }
                >
                  {step.name}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
