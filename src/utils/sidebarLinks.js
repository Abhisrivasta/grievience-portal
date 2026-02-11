export const sidebarLinks = {
  citizen: [
    { path: "/citizen", label: "Dashboard" },
    { path: "/citizen/complaints", label: "My Complaints" },
    { path: "/citizen/create", label: "New Complaint" },
  ],
  officer: [
    { path: "/officer", label: "Dashboard" },
    { path: "/officer/assigned", label: "Assigned Complaints" },
  ],
  admin: [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/departments", label: "Departments" },
    { path: "/admin/officers", label: "Officers" },
    { path: "/admin/reports", label: "Reports" },
    { path: "/admin/audit", label: "Audit Logs" },
    { path: "/admin/complaints", label: "Complaints" },
    { path: "/admin/notifications", label: "Bulk Notifications" },

  ],
};
