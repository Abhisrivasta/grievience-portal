import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

const Home = lazy(() => import("../pages/Home"));
const Profile = lazy(() => import("../pages/Profile"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));

const AboutUs = lazy(() => import("../components/AboutUs"));
const ContactUs = lazy(() => import("../components/ContactUs"));

const CitizenDashboard = lazy(() => import("../pages/citizen/Dashboard"));
const MyComplaints = lazy(() => import("../pages/citizen/MyComplaints"));
const ComplaintDetails = lazy(() => import("../pages/citizen/ComplaintDetails"));
const CreateComplaint = lazy(() => import("../pages/citizen/CreateComplaint"));

const OfficerDashboard = lazy(() => import("../pages/officer/Dashboard"));
const AssignedComplaints = lazy(() => import("../pages/officer/AssignedComplaints"));
const OfficerComplaintDetails = lazy(() =>
  import("../pages/officer/ComplaintDetails")
);

const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const Departments = lazy(() => import("../pages/admin/Departments"));
const Officers = lazy(() => import("../pages/admin/Officers"));
const AssignComplaints = lazy(() => import("../pages/admin/AssignedComplaints"));
const AuditLogs = lazy(() => import("../pages/admin/AuditLogs"));
const BulkNotifications = lazy(() => import("../pages/admin/BulkNotifications"));
const AdminComplaints = lazy(() => import("../pages/admin/Complaints"));
const Reports = lazy(() => import("../pages/admin/Reports"));
const Feedback = lazy(() => import("../pages/admin/Feedback"));
const AdminHomeEditor = lazy(() => import("../pages/admin/AdminHomeEditor"));
const AdminAboutEditor = lazy(() => import("../pages/admin/AdminAboutEditor"));
const AdminInquiries = lazy(() => import("../pages/admin/AdminInquiries"));

const NotFound = lazy(() => import("../pages/NotFound"));
const EmailVerified = lazy(() => import("../pages/auth/EmailVerified"));
const VerifyFailed = lazy(() => import("../pages/auth/VerifyFailed"));
const ResendVerification = lazy(() =>
  import("../pages/auth/ResendVerification")
);
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));

function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
      <div className="h-11 w-11 animate-spin rounded-full border-4 border-white/20 border-t-cyan-400" />
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verified" element={<EmailVerified />} />
        <Route path="/verify-failed" element={<VerifyFailed />} />
        <Route path="/resend-verification" element={<ResendVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* PROTECTED: ALL LOGGED IN USERS */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["citizen", "officer", "admin"]} />
          }
        >
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* CITIZEN ONLY */}
        <Route element={<ProtectedRoute allowedRoles={["citizen"]} />}>
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/citizen/complaints" element={<MyComplaints />} />
          <Route
            path="/citizen/complaints/:id"
            element={<ComplaintDetails />}
          />
          <Route path="/citizen/create" element={<CreateComplaint />} />
        </Route>

        {/* OFFICER ONLY */}
        <Route element={<ProtectedRoute allowedRoles={["officer"]} />}>
          <Route path="/officer" element={<OfficerDashboard />} />
          <Route path="/officer/assigned" element={<AssignedComplaints />} />
          <Route
            path="/officer/complaints/:id"
            element={<OfficerComplaintDetails />}
          />
        </Route>

        {/* ADMIN ONLY */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/home" element={<AdminHomeEditor />} />
          <Route path="/admin/about" element={<AdminAboutEditor />} />
          <Route path="/admin/inquiries" element={<AdminInquiries />} />
          <Route path="/admin/departments" element={<Departments />} />
          <Route path="/admin/officers" element={<Officers />} />
          <Route path="/admin/assign" element={<AssignComplaints />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/admin/audit" element={<AuditLogs />} />
          <Route path="/admin/notifications" element={<BulkNotifications />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/feedback" element={<Feedback />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;