import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  MessageCircle,
  Megaphone,
  Bell,
  Activity,
  BarChart3,
  Settings,
} from "lucide-react";

const actions = [
  {
    label: "User Management",
    path: "/super-admin/users",
    icon: Users,
  },
  {
    label: "Reports",
    path: "/super-admin/reports",
    icon: FileText,
  },
  {
    label: "Comments",
    path: "/super-admin/comments",
    icon: MessageCircle,
  },
  {
    label: "Announcements",
    path: "/super-admin/announcements",
    icon: Megaphone,
  },
  {
    label: "Notifications",
    path: "/super-admin/notifications",
    icon: Bell,
  },
  {
    label: "Audit Logs",
    path: "/super-admin/audit-logs",
    icon: Activity,
  },
  {
    label: "Analytics",
    path: "/super-admin/analytics",
    icon: BarChart3,
  },
  {
    label: "System Settings",
    path: "/super-admin/settings",
    icon: Settings,
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Access Super Admin management tools.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.path}
              type="button"
              onClick={() => navigate(action.path)}
              className="group rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:border-[#0F4C3A]/20 hover:bg-[#0F4C3A]/5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                <Icon className="h-5 w-5 text-[#0F4C3A] transition group-hover:text-[#D4AF37]" />
              </div>

              <p className="text-sm font-semibold text-gray-800">
                {action.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}