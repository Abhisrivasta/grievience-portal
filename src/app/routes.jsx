import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Profile from "../pages/Profile";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/Unauthorized";

// 🔥 NEW
import Home from "../pages/Home";

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
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import AdminInquiries from "../pages/admin/AdminInquiries";

function AppRoutes() {
  return (
    <Routes>

      {/* ✅ PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />   {/* 🔥 FIXED */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ✅ PROFILE (ALL ROLES) */}
      <Route element={<ProtectedRoute allowedRoles={["citizen","officer","admin"]} />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* ✅ CITIZEN */}
      <Route element={<ProtectedRoute allowedRoles={["citizen"]} />}>
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/citizen/complaints" element={<MyComplaints />} />
        <Route path="/citizen/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/citizen/create" element={<CreateComplaint />} />
      </Route>

      {/* ✅ OFFICER */}
      <Route element={<ProtectedRoute allowedRoles={["officer"]} />}>
        <Route path="/officer" element={<OfficerDashboard />} />
        <Route path="/officer/assigned" element={<AssignedComplaints />} />
        <Route path="/officer/complaints/:id" element={<OfficerComplaintDetails />} />
      </Route>

      {/* ✅ ADMIN */}
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

        <Route path="/about" element={<AboutUs />} />
<Route path="/contact" element={<ContactUs />} />
      </Route>

    </Routes>
  );
}

export default AppRoutes;