

import { AuthProvider } from "../context/authContext";
import AdminShell from "../components/admin/Adminshell";

import "../globals.css"


export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminShell>
        {children}
      </AdminShell>
    </AuthProvider>
  );
}