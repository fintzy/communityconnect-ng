import {
  Users,
  FileText,
  ClipboardList,
  ShieldCheck,
  Bell,
  CheckCircle,
} from "lucide-react";

import { store } from "../../../services/store";

export default function DashboardCards() {
  const stats = store.getStats();

  const cards = [
    {
      title: "Users",
      value: stats.totalUsers,
      color: "bg-green-50",
      icon: Users,
    },
    {
      title: "Reports",
      value: stats.totalReports,
      color: "bg-yellow-50",
      icon: FileText,
    },
    {
      title: "Pending",
      value: stats.pending,
      color: "bg-red-50",
      icon: ClipboardList,
    },
    {
      title: "Resolved",
      value: stats.resolved,
      color: "bg-blue-50",
      icon: CheckCircle,
    },
    {
      title: "Admins",
      value: stats.admins,
      color: "bg-purple-50",
      icon: ShieldCheck,
    },
    {
      title: "Notifications",
      value: stats.totalNotifications,
      color: "bg-orange-50",
      icon: Bell,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`${card.color} rounded-2xl p-6 shadow-sm border`}
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold text-[#0F4C3A] mt-2">
                  {card.value}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Icon className="w-7 h-7 text-[#0F4C3A]" />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}