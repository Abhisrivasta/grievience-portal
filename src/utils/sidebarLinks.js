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

    // 🔥 IMPORTANT ADDITION
    { path: "/admin/home", label: "Home Page (CMS)" },

    { path: "/admin/departments", label: "Departments" },
    { path: "/admin/officers", label: "Officers" },
    { path: "/admin/assign", label: "Assign Complaints" },
    { path: "/admin/reports", label: "Reports" },
    { path: "/admin/audit", label: "Audit Logs" },
    { path: "/admin/complaints", label: "Complaints" },
    { path: "/admin/notifications", label: "Bulk Notifications" },
    { path: "/admin/feedback", label: "Feedback" }, // ⚠️ was missing
  ],
};