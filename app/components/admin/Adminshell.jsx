"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/admin/auth";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#0d0d0d]">
      <Sidebar />
      <main className="ml-[220px] flex-1 p-8">
        {children}
      </main>
    </div>
  );
}