import {
  LayoutDashboard,
  Users,
  FileText,
  Bell,
  ClipboardList,
  Database,
  Shield,
  Settings,
  Activity,
  LogOut,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    title: "Users",
    icon: Users,
  },
  {
    title: "Reports",
    icon: FileText,
  },
  {
    title: "Notifications",
    icon: Bell,
  },
  {
    title: "Audit Logs",
    icon: ClipboardList,
  },
  {
    title: "Database",
    icon: Database,
  },
  {
    title: "System Health",
    icon: Activity,
  },
  {
    title: "Roles",
    icon: Shield,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-[#0F4C3A] text-white flex flex-col">

      {/* Logo */}

      <div className="h-24 flex items-center px-8 border-b border-white/10">

        <div className="w-12 h-12 rounded-xl bg-[#D4AF37] flex items-center justify-center mr-4">

          <Shield className="text-[#0F4C3A]" />

        </div>

        <div>

          <h2 className="font-bold text-lg">
            CommunityConnect
          </h2>

          <p className="text-xs text-green-200">
            Super Admin
          </p>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-5 py-6 space-y-2">

        {menu.map((item) => {

          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition

              ${
                item.active
                  ? "bg-[#D4AF37] text-[#0F4C3A] font-semibold shadow"
                  : "hover:bg-white/10"
              }`}
            >

              <Icon className="w-5 h-5" />

              <span>{item.title}</span>

            </button>
          );
        })}
      </nav>

      {/* Footer */}

      <div className="p-6 border-t border-white/10">

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500 transition">

          <LogOut className="w-5 h-5" />

          Logout

        </button>

      </div>

    </aside>
  );
}