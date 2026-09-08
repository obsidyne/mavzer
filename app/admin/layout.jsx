

import { AuthProvider } from "../context/authContext";
import { ThemeProvider } from "../context/themeContext";
import AdminShell from "../components/admin/Adminshell";

import "../globals.css"


export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AdminShell>
          {children}
        </AdminShell>
      </ThemeProvider>
    </AuthProvider>
  );
}