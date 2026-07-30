import DashboardCards from "./pages/DashboardCards";
import AnalyticsChart from "./pages/AnalyticsChart";
import CategoryChart from "./pages/CategoryChart";
import LgaChart from "./pages/LgaChart";
import RecentActivity from "./pages/RecentActivity";
import SystemHealth from "./pages/SystemHealth";

export default function SuperAdminDashboard() {
  return (
    <>
      <DashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>

        <CategoryChart />
      </div>

      <div className="mt-6">
        <LgaChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <RecentActivity />
        <SystemHealth />
      </div>
    </>
  );
}