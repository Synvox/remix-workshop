import { ReactNode } from "react";
import { Nav } from "./Nav";

export function Container({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-200 pt-12 text-center">
      <Nav />
      <div className="container mx-auto flex flex-1 border-x border-slate-300 bg-white text-left">
        <div className="flex-1 text-slate-800">{children}</div>
      </div>
    </div>
  );
}
