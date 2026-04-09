import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Common Pages
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/Unauthorized";

// Dashboards & Features
import CitizenDashboard from "../pages/citizen/Dashboard";
import MyComplaints from "../pages/citizen/MyComplaints";
import ComplaintDetails from "../pages/citizen/ComplaintDetails";
import CreateComplaint from "../pages/citizen/CreateComplaint";
import OfficerDashboard from "../pages/officer/Dashboard";
import AssignedComplaints from "../pages/officer/AssignedComplaints";
import OfficerComplaintDetails from "../pages/officer/ComplaintDetails";
import AdminDashboard from "../pages/admin/Dashboard";
import Departments from "../pages/admin/Departments";
import Officers from "../pages/admin/Officers";
import AssignComplaints from "../pages/admin/AssignedComplaints";
import AuditLogs from "../pages/admin/AuditLogs";
import BulkNotifications from "../pages/admin/BulkNotifications";
import AdminComplaints from "../pages/admin/Complaints";
import Reports from "../pages/admin/Reports";
import Feedback from "../pages/admin/Feedback";
import AdminHomeEditor from "../pages/admin/AdminHomeEditor";
import AdminInquiries from "../pages/admin/AdminInquiries";

function AppRoutes() {
  return (
    <Routes>
      {/* ✅ SABKE LIYE OPEN (Public Routes) */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* 🔐 LOGIN REQUIRED (Common) */}
      <Route element={<ProtectedRoute allowedRoles={["citizen", "officer", "admin"]} />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* 🔐 CITIZEN ONLY */}
      <Route element={<ProtectedRoute allowedRoles={["citizen"]} />}>
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/citizen/complaints" element={<MyComplaints />} />
        <Route path="/citizen/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/citizen/create" element={<CreateComplaint />} />
      </Route>

      {/* 🔐 OFFICER ONLY */}
      <Route element={<ProtectedRoute allowedRoles={["officer"]} />}>
        <Route path="/officer" element={<OfficerDashboard />} />
        <Route path="/officer/assigned" element={<AssignedComplaints />} />
        <Route path="/officer/complaints/:id" element={<OfficerComplaintDetails />} />
      </Route>

      {/* 🔐 ADMIN ONLY */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/home" element={<AdminHomeEditor />} />
        <Route path="/admin/inquiries" element={<AdminInquiries />} />
        <Route path="/admin/departments" element={<Departments />} />
        <Route path="/admin/officers" element={<Officers />} />
        <Route path="/admin/assign" element={<AssignComplaints />} />
        <Route path="/admin/audit" element={<AuditLogs />} />
        <Route path="/admin/notifications" element={<BulkNotifications />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/feedback" element={<Feedback />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;