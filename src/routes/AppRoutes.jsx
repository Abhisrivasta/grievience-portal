import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import CitizenDashboard from "../pages/citizen/CitizenDashboard";
import OfficerDashboard from "../pages/officer/OfficerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import ComplaintList from "../pages/citizen/ComplaintList";
import ComplaintDetails from "../pages/citizen/ComplaintDetails";
import NewComplaint from "../pages/citizen/NewComplaint";
import AssignedComplaints from "../pages/officer/AssignedComplaints";
import UpdateStatus from "../pages/officer/UpdateStatus";
import DepartmentManagement from "../pages/admin/DepartmentManagement";
import OfficerManagement from "../pages/admin/OfficerManagement";
import Reports from "../pages/admin/Reports";
import AuditLogs from "../pages/admin/AuditLogs";
import Register from "../pages/auth/Register";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

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

      {/* Add register routes here */}
      <Route path="/register" element={<Register />} />

      {/* Add login routes here */}
      <Route path="/" element={<Navigate to="/login" />} />

      <Route
        path="/citizen/complaints"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <ComplaintList />
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
        path="/citizen/new"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <NewComplaint />
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
            <UpdateStatus />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/departments"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DepartmentManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/officers"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <OfficerManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/audit"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AuditLogs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/citizen"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<div>404 Page Not Found</div>} />
    </Routes>
  );
}
