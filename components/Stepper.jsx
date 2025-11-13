export const Stepper = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Basic", fullName: "Basic Info" },
    { id: 2, name: "Professional", fullName: "Professional Details" },
    { id: 3, name: "Rates", fullName: "Rates & Settings" },
  ];

  return (
    <nav aria-label="Progress" className="mb-6 sm:mb-8 lg:mb-12">
      <ol
        role="list"
        className="grid grid-cols-3 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
      >
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative overflow-hidden">
            <div
              className={`
              ${currentStep > step.id ? "bg-indigo-600" : ""}
              ${currentStep === step.id ? "border-indigo-600" : ""}
              ${stepIdx === 0 ? "rounded-l-lg" : ""}
              ${stepIdx === steps.length - 1 ? "rounded-r-lg" : ""}
              ${
                currentStep === step.id
                  ? "border-b-4"
                  : "border-b-4 border-transparent"
              }
              p-2 sm:p-4 text-center text-xs sm:text-sm font-medium
            `}
            >
              {currentStep > step.id ? (
                <span className="flex items-center justify-center gap-1 text-white">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="hidden sm:inline">{step.fullName}</span>
                  <span className="sm:hidden">{step.name}</span>
                </span>
              ) : (
                <span
                  className={
                    currentStep === step.id
                      ? "text-indigo-600"
                      : "text-slate-700"
                  }
                >
                  <span className="hidden sm:inline">{step.fullName}</span>
                  <span className="sm:hidden">{step.name}</span>
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
