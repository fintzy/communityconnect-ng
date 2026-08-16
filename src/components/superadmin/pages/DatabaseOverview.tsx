import {
  Database,
  Users,
  FileText,
  MessageCircle,
  Megaphone,
  Bell,
} from "lucide-react";
import { store } from "../../../services/store";
import StatCard from "./StatCard";

export default function DatabaseOverview() {
  const stats = store.getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F4C3A]">
          Database Overview
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of records currently stored in CommunityConnect NG.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-5">
        <Database className="h-7 w-7 text-green-600" />

        <div>
          <p className="font-semibold text-green-800">
            Database Operational
          </p>

          <p className="text-sm text-green-700">
            Local application data store is available.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Users"
          value={stats.totalUsers}
          icon={Users}
        />

        <StatCard
          title="Reports"
          value={stats.totalReports}
          icon={FileText}
        />

        <StatCard
          title="Comments"
          value={stats.totalComments}
          icon={MessageCircle}
        />

        <StatCard
          title="Announcements"
          value={stats.totalAnnouncements}
          icon={Megaphone}
        />

        <StatCard
          title="Notifications"
          value={stats.totalNotifications}
          icon={Bell}
        />

        <StatCard
          title="Resolution Rate"
          value={`${stats.resolutionRate}%`}
          icon={Database}
        />
      </div>
    </div>
  );
}