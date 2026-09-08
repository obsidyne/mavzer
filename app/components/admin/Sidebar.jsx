// COMPONENT: Sidebar
// Fixed left sidebar shown on all admin pages except /admin/auth.
// Shows nav links and a sign out button.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { useTheme } from "../../context/themeContext";

const navItems = [
  { label: "tüm ürünler", href: "/admin/all-products", icon: "☰" },
  { label: "sektörler",     href: "/admin/sectors",     icon: "▦" },
  { label: "sektör ürünleri", href: "/admin/products2", icon: "▤" },
  // { label: "Categories",     href: "/admin/categories",     icon: "▦" },
  { label: "ürünler",     href: "/admin/group",     icon: "▦" },
  // { label: "Featured",     href: "/admin/featured",     icon: "★" },
  { label: "afişler",      href: "/admin/banners",      icon: "▬" },
  // { label: "About",        href: "/admin/about",        icon: "✦" },
  // { label: "About",        href: "/admin/about",        icon: "✦" },
  { label: "müşteriler",      href: "/admin/clients",      icon: "◈" },
  // { label: "Clients",  href: "/admin/clients",  icon: "◈" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed top-0 left-0 w-[220px] min-h-screen bg-[var(--bg-sidebar)] border-r border-[var(--border-faint)] flex flex-col py-8">

      <div className="px-6 pb-8 border-b border-[var(--border-faint)] flex items-center justify-between">
        <h1 className="text-[var(--text-primary)] text-lg font-bold tracking-[5px]">MAVZER</h1>
        <button
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
        >
          {theme === "light" ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-3 py-6 flex-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium tracking-wide transition-all
                ${active
                  ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-tertiary)] hover:bg-[var(--bg-surface)]"
                }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 pt-6 border-t border-[var(--border-faint)] flex flex-col gap-3">
        <span className="text-[var(--text-disabled)] text-[11px] break-all">{admin?.email}</span>
        <button
          onClick={logout}
          className="text-[var(--text-muted)] text-xs border border-[var(--border-subtle)] rounded-md py-2 hover:text-[var(--text-tertiary)] hover:border-[var(--border-mid)] transition-all"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}