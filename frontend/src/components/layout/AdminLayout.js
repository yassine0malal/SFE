import React from 'react';
import AdminNavbar from '../admin/AdminNavbar';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-main">{children}</main>
    </div>
  );
}
