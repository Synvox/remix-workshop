import { HTMLProps, ReactNode, useId } from "react";

export function Select({
  label,
  placeholder = label,
  ...props
}: {
  label: string;
  placeholder?: string;
} & JSX.IntrinsicElements["select"]) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium" htmlFor={id}>
        {label}
      </label>

      <select
        id={id}
        placeholder={placeholder}
        {...props}
        className="h-10 rounded-md border border-slate-300 bg-slate-50 px-3 shadow-inner focus-within:border-blue-500 focus-within:outline focus-within:outline-2 focus-within:outline-blue-400"
      />
    </div>
  );
}
