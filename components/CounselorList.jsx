import { PHONE_PREFIX } from "@/lib/constants";

export const CounselorList = ({
  counselors,
  counselorsLoading,
  counselorsError,
  onRefresh,
  onEdit,
  supabase,
}) => {
  return (
    <div className="mt-6">
      <div className="flex justify-end items-center mb-6">
        <button
          onClick={onRefresh}
          disabled={counselorsLoading || !supabase}
          className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          {counselorsLoading ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="-ml-0.5 h-4 w-4 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312.311a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 11.708-.708L5 12.293V9.5a.5.5 0 011 0v3.5a.5.5 0 01-.146.354l-1.5 1.5a.5.5 0 01-.708 0L3.336 14a6.5 6.5 0 019.633-3.007.5.5 0 01.38.635l-.5 2a.5.5 0 01-.966-.24l.412-1.65A5.5 5.5 0 0115.312 11.424zM4.688 8.576a5.5 5.5 0 019.201-2.466l.312-.311a.5.5 0 01.708 0l1.5 1.5a.5.5 0 01-.708.708L15 7.707V10.5a.5.5 0 01-1 0V7a.5.5 0 01.146-.354l1.5-1.5a.5.5 0 01.708 0L16.664 6a6.5 6.5 0 01-9.633 3.007.5.5 0 01-.38-.635l.5-2a.5.5 0 01.966.24l-.412 1.65A5.5 5.5 0 014.688 8.576z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {counselorsLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {counselorsLoading && counselors.length === 0 && (
        <p className="mt-4 text-slate-500">Loading counselors...</p>
      )}

      {counselorsError && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            Error: {counselorsError}
          </p>
        </div>
      )}

      {!counselorsLoading && counselors.length === 0 && !counselorsError && (
        <p className="mt-4 text-slate-500">
          No counselors found. Add one to get started.
        </p>
      )}

      {counselors.length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
          <ul role="list" className="divide-y divide-gray-200">
            {counselors.map((counselor) => (
              <li
                key={counselor.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-x-6 p-3 sm:p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex min-w-0 gap-x-3 sm:gap-x-4">
                  <img
                    className="h-10 w-10 sm:h-12 sm:w-12 flex-none rounded-full bg-gray-50 object-cover"
                    src={
                      counselor.avatar_url ||
                      "https://placehold.co/100x100/E2E8F0/475569?text=??"
                    }
                    alt=""
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm sm:text-base font-semibold leading-6 text-gray-900">
                      {counselor.full_name}
                    </p>
                    <p className="mt-0.5 sm:mt-1 truncate text-xs leading-5 text-gray-500">
                      {counselor.email || "No email"}
                    </p>
                    <p className="mt-0.5 sm:mt-1 truncate text-xs leading-5 text-gray-500">
                      {PHONE_PREFIX}
                      {counselor.phone_number}
                    </p>
                    {/* Mobile status badges */}
                    <div className="flex sm:hidden items-center gap-x-3 mt-2">
                      {counselor.is_active ? (
                        <div className="flex items-center gap-x-1.5">
                          <div className="flex-none rounded-full bg-green-500/20 p-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          </div>
                          <p className="text-xs leading-5 text-gray-500">
                            Active
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-x-1.5">
                          <div className="flex-none rounded-full bg-red-500/20 p-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          </div>
                          <p className="text-xs leading-5 text-gray-500">
                            Inactive
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-none items-center justify-between sm:justify-end gap-x-3 sm:gap-x-4">
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    {counselor.is_active ? (
                      <div className="mt-1 flex items-center gap-x-1.5">
                        <div className="flex-none rounded-full bg-green-500/20 p-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        </div>
                        <p className="text-xs leading-5 text-gray-500">
                          Active
                        </p>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-x-1.5">
                        <div className="flex-none rounded-full bg-red-500/20 p-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        </div>
                        <p className="text-xs leading-5 text-gray-500">
                          Inactive
                        </p>
                      </div>
                    )}
                    <p className="text-xs leading-5 text-gray-500">
                      {counselor.is_accepting_calls
                        ? "Accepting Calls"
                        : "Not Accepting Calls"}
                    </p>
                  </div>
                  <button
                    onClick={() => onEdit(counselor)}
                    className="rounded-md bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
