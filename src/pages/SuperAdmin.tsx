import Sidebar from "../components/superadmin/Sidebar";
import Header from "../components/superadmin/Header";
import SuperAdminDashboard from "../components/superadmin/SuperAdminDashboard";

export default function SuperAdmin() {
  return (
    <div className="min-h-screen flex bg-[#F3F4F6]">

      <Sidebar />

      <main className="flex-1 overflow-y-auto">

        <Header />

        <div className="p-8">

          <div className="max-w-7xl mx-auto">

            <div className="bg-white rounded-2xl shadow-sm border p-8">

              <SuperAdminDashboard />

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}