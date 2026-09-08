"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { useTheme } from "../../context/themeContext";

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isAuthPage = pathname === "/admin/auth";

  if (isAuthPage) {
    return <div className="admin-root" data-theme={theme}>{children}</div>;
  }

  return (
    <div className="admin-root flex min-h-screen bg-[var(--bg-page)]" data-theme={theme}>
      <Sidebar />
      <main className="ml-[220px] flex-1 p-8">
        {children}
      </main>
    </div>
  );
}