import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Profile from "../pages/Profile";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/Unauthorized";

import CitizenDashboard from "../pages/citizen/Dashboard";
import OfficerDashboard from "../pages/officer/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";

import MyComplaints from "../pages/citizen/MyComplaints";
import ComplaintDetails from "../pages/citizen/complaintDetails";
import CreateComplaint from "../pages/citizen/createComplaint";

import AssignedComplaints from "../pages/officer/AssignedComplaints";
import OfficerComplaintDetails from "../pages/officer/ComplaintDetails";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["citizen", "officer", "admin"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Citizen */}
      <Route
        path="/citizen"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />

      {/* Officer */}
      <Route
        path="/officer"
        element={
          <ProtectedRoute allowedRoles={["officer"]}>
            <OfficerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/citizen/complaints"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <MyComplaints />
          </ProtectedRoute>
        }
      />

      <Route
        path="/citizen/complaints/:id"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <ComplaintDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/citizen/create"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <CreateComplaint />
          </ProtectedRoute>
        }
      />

      <Route
        path="/officer/assigned"
        element={
          <ProtectedRoute allowedRoles={["officer"]}>
            <AssignedComplaints />
          </ProtectedRoute>
        }
      />

      <Route
        path="/officer/complaints/:id"
        element={
          <ProtectedRoute allowedRoles={["officer"]}>
            <OfficerComplaintDetails />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<h1>Home</h1>} />
    </Routes>
  );
}

export default AppRoutes;
