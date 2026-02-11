import MainLayout from "../../components/layout/MainLayout";

function OfficerDashboard() {
  return (
    <MainLayout>
      {/* Page Background */}
      <div className="min-h-full bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200">

        {/* Content Wrapper */}
        <div className="px-6 py-8">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">
              Officer Dashboard
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Manage assigned grievances, track progress, and take timely action.
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-5">
              <h2 className="font-medium text-slate-900 mb-1">
                Assigned Complaints
              </h2>
              <p className="text-sm text-slate-600">
                View and manage grievances assigned to you.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-5">
              <h2 className="font-medium text-slate-900 mb-1">
                Pending Actions
              </h2>
              <p className="text-sm text-slate-600">
                Complaints awaiting review or action.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-5">
              <h2 className="font-medium text-slate-900 mb-1">
                Reports & Updates
              </h2>
              <p className="text-sm text-slate-600">
                Review status updates and submit official remarks.
              </p>
            </div>

          </div>

          {/* Info Section */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-6 max-w-3xl">
            <h3 className="font-medium text-slate-900 mb-1">
              Officer Responsibilities
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Officers are responsible for reviewing grievances, coordinating
              with relevant departments, and ensuring timely and transparent
              resolution of citizen complaints.
            </p>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default OfficerDashboard;
