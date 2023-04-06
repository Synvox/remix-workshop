import { useEffect, useId, useState } from "react";

export function Input({
  label,
  placeholder = label,
  error,
  ...props
}: {
  error?: string;
  label: string;
} & JSX.IntrinsicElements["input"]) {
  const id = useId();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!showError) return;
    const handler = () => {
      setShowError(false);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  });

  return (
    <div className="flex flex-col items-start gap-1">
      <label className="font-medium" htmlFor={id}>
        {label}
      </label>
      <div className="relative h-10 rounded-md border border-slate-300 bg-slate-50 px-3 shadow-inner focus-within:border-blue-500 focus-within:outline focus-within:outline-2 focus-within:outline-blue-400">
        <input
          id={id}
          placeholder={placeholder}
          {...props}
          className="h-full w-full bg-transparent focus:outline-none"
        />
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 text-red-500">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowError((v) => !v);
              }}
            >
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
              </svg>
            </button>
            {showError && (
              <div className="absolute left-0 top-full -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-4 py-2 text-slate-200">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
