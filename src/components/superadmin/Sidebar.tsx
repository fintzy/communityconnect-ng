import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {  LayoutDashboard,  Users,  FileText,  MessageSquare,  Megaphone,  Bell,  ClipboardList,  BarChart3,  Settings,  ShieldCheck,  LogOut,  Menu,  X,  Home,} from "lucide-react";
import { store } from "../../services/store";

type SidebarItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    path: "/super-admin",
    label: "Dashboard",
    icon: LayoutDashboard,

  },
  {
    path: "/super-admin/users",
    label: "User Management",
    icon: Users,
  },
  {
    path: "/super-admin/reports",
    label: "Reports",
    icon: FileText,
  },
  {
    path: "/super-admin/comments",
    label: "Comments",
    icon: MessageSquare,
  },
  {
    path: "/super-admin/announcements",
    label: "Announcements",
    icon: Megaphone,
  },
  {
    path: "/super-admin/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    path: "/super-admin/audit-logs",
    label: "Audit Logs",
    icon: ClipboardList,
  },
  {
    path: "/super-admin/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    path: "/super-admin/settings",
    label: "System Settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentUser = store.getCurrentUser();

  const handleLogout = () => {
    store.logout();

    window.dispatchEvent(new Event("authChanged"));

    navigate("/auth");
  };

  const handleNavigation = () => {
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0F4C3A] text-white">
      {/* Logo */}
      <div className="h-20 px-5 flex items-center border-b border-white/10">
        <button
          type="button"
          onClick={() => navigate("/super-admin")}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#0F4C3A]" />
          </div>

          <div className="text-left">
            <p className="font-bold text-sm text-white">
              CommunityConnect
            </p>

            <p className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">
              Super Admin
            </p>
          </div>
        </button>
      </div>

      {/* Current user */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {currentUser?.name ?? "Super Admin"}
            </p>

            <p className="text-[10px] text-white/50 truncate">
              {currentUser?.email ?? "okutu@communityconnect.ng"}
            </p>
          </div>
        </div>
        
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Administration
        </p>

        <div className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/super-admin"}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#D4AF37] text-[#0F4C3A] shadow-sm"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <button
          type="button"
          onClick={() => {
            setMobileOpen(false);
            navigate("/");
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <Home className="w-4 h-4" />
          Main Website
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 min-h-screen sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-[#0F4C3A] text-white flex items-center justify-center shadow-lg"
        aria-label="Open administration menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close administration menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          {/* Drawer */}
          <aside className="relative w-72 max-w-[85vw] h-full shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Close administration menu"
            >
              <X className="w-5 h-5" />
            </button>

            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}