import MainLayout from "../../components/layout/MainLayout";

function CitizenDashboard() {
  return (
    <MainLayout>
      {/* Page Background */}
      <div className="min-h-full bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200">

        {/* Content Wrapper */}
        <div className="px-6 py-8">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">
              Citizen Dashboard
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Manage and track your grievances in a transparent and accountable manner.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-5">
              <h2 className="font-medium text-slate-900 mb-1">
                Raise a Grievance
              </h2>
              <p className="text-sm text-slate-600">
                Submit complaints related to public services or departments.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-5">
              <h2 className="font-medium text-slate-900 mb-1">
                Track Complaints
              </h2>
              <p className="text-sm text-slate-600">
                View status and progress of your submitted grievances.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-5">
              <h2 className="font-medium text-slate-900 mb-1">
                Notifications
              </h2>
              <p className="text-sm text-slate-600">
                Receive official updates and responses from authorities.
              </p>
            </div>

          </div>

          {/* Info Section */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-6 max-w-3xl">
            <h3 className="font-medium text-slate-900 mb-1">
              Our Commitment
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              This grievance portal ensures fairness, accountability, and timely
              resolution. Each complaint is securely recorded and monitored by the
              concerned authorities to maintain transparency and public trust.
            </p>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default CitizenDashboard;
