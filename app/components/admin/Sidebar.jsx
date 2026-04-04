"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/authContext";

const navItems = [
  { label: "Products", href: "/admin/products", icon: "▦" },
  // { label: "Banners",  href: "/admin/banners",  icon: "▬" },
  // { label: "Clients",  href: "/admin/clients",  icon: "◈" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();

  return (
    <aside className="fixed top-0 left-0 w-[220px] min-h-screen bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col py-8">

      {/* Brand */}
      <div className="px-6 pb-8 border-b border-[#1a1a1a]">
        <h1 className="text-white text-lg font-bold tracking-[5px]">MAVZER</h1>
        <p className="text-[#333] text-[9px] tracking-[3px] mt-1 uppercase">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 py-6 flex-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium tracking-wide transition-all
                ${active
                  ? "bg-[#1a1a1a] text-white"
                  : "text-[#555] hover:text-[#999] hover:bg-[#111]"
                }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 pt-6 border-t border-[#1a1a1a] flex flex-col gap-3">
        <span className="text-[#333] text-[11px] break-all">{admin?.email}</span>
        <button
          onClick={logout}
          className="text-[#555] text-xs border border-[#1f1f1f] rounded-md py-2 hover:text-[#999] hover:border-[#333] transition-all"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}