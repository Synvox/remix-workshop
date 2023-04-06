import { NavLink } from "@remix-run/react";
import { ReactNode } from "react";

export function Nav() {
  return (
    <div className="fixed left-0 right-0 top-0 z-10 h-12 bg-slate-800 text-center">
      <div className="flex-start container mx-auto flex h-full flex-row items-stretch gap-[1px] text-left">
        <Link to="/forms" index={1}>
          Basics
        </Link>
        <Link to="/steps" index={2}>
          Multi-Step Forms
        </Link>
        <Link to="/multiple-actions" index={3}>
          Handling Multiple Actions
        </Link>
        <Link to="/search-params" index={4}>
          URLSearchParams
        </Link>
        <Link to="/cookies" index={5}>
          Cookies
        </Link>
      </div>
    </div>
  );
}

function Link({
  children,
  to,
  index,
}: {
  children?: ReactNode;
  to: string;
  index: number;
}) {
  return (
    <NavLink
      to={to}
      className="relative flex flex-row items-center justify-center overflow-hidden px-5 text-sm font-medium text-slate-300 transition-colors duration-150 ease-in-out after:absolute after:inset-0 after:-translate-y-full after:bg-slate-500 after:bg-opacity-50 after:transition-transform after:ease-in-out hover:text-white after:active:bg-opacity-40 [&.active]:bg-blue-500 [&.active]:text-white [&.active]:after:hidden [&:not(.active)]:after:hover:translate-y-0"
    >
      <div className="relative z-10 flex flex-row items-center gap-2">
        <div className="flex h-6 w-6 flex-shrink-0 scale-90 items-center justify-center rounded-full border-2 border-current transition-all duration-300 [a.active_&]:-rotate-12 [a.active_&]:scale-125 [a.active_&]:border-transparent [a.active_&]:bg-white [a.active_&]:text-blue-500">
          {index}
        </div>
        {children}
      </div>
    </NavLink>
  );
}
