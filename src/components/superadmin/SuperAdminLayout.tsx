import { useState } from "react";
import {  Activity,  BarChart3,  Bell,  ChevronDown,  FileText,  LayoutDashboard,  LogOut,  Megaphone,  Menu,  MessageSquare,  Settings,  ShieldCheck,  Users,  X,  ClipboardList,} from "lucide-react";
import {  NavLink,  Outlet,  useNavigate,} from "react-router-dom";
import { store } from "../../services/store";

export default function SuperAdminLayout() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const user = store.getCurrentUser();

  const navigation = [
    {
      label: "Dashboard",
      path: "/super-admin",
      icon: LayoutDashboard,
      end: true,
    },
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
      icon: MessageSquare,
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
      icon: ClipboardList,
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

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    store.logout();
    closeMenus();
    navigate("/auth", { replace: true });
  };

  const goToPublicSite = () => {
    closeMenus();
    navigate("/");
  };

  const goToMainDashboard = () => {
    closeMenus();
    navigate("/dashboard");
  };

  const goToDevConsole = () => {
    closeMenus();
    navigate("/devconsole");
  };

  return (
    <div className="min-h-screen bg-[#F5F7F6] text-gray-900">
      {/* =====================================================
          MOBILE SIDEBAR BACKDROP
      ====================================================== */}

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform overflow-hidden bg-[#0F4C3A] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Decorative glow */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

        {/* ===================================================
            LOGO
        ==================================================== */}

        <div className="relative flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37] shadow-lg shadow-black/10">
              <ShieldCheck className="h-5 w-5 text-[#0F4C3A]" />
            </div>

            <div>
              <p className="text-sm font-bold tracking-tight text-white">
                CommunityConnect NG
              </p>

              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E5C75A]">
                Super Admin Portal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ===================================================
            NAVIGATION
        ==================================================== */}

        <nav className="relative h-[calc(100vh-9rem)] space-y-1 overflow-y-auto px-4 py-5">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
            Administration
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#0F4C3A] shadow-lg shadow-black/10"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                        isActive
                          ? "bg-[#0F4C3A]/10"
                          : "bg-white/5 group-hover:bg-white/10"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                    </span>

                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ===================================================
            SIDEBAR BOTTOM
        ==================================================== */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#0B3F30]/95 p-4 backdrop-blur-md">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/70 transition-all hover:bg-red-500/15 hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 group-hover:bg-red-500/20">
              <LogOut className="h-4 w-4" />
            </span>

            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="min-h-screen lg:ml-72">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <header className="sticky top-0 z-30 h-20 border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
          <div className="flex h-full items-center justify-between px-4 sm:px-6">
            {/* =================================================
                LEFT SIDE
            ================================================== */}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(true)
                }
                className="rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-50 hover:text-[#0F4C3A] lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0F4C3A]">
                  Super Administration
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Platform control center
                </p>
              </div>
            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================== */}

            <div className="flex items-center gap-3">
              {/* ===============================================
                  SYSTEM STATUS
              ================================================ */}

              <div className="hidden items-center gap-2.5 rounded-xl border border-green-100 bg-green-50 px-3.5 py-2 md:flex">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute h-3 w-3 animate-ping rounded-full bg-green-400 opacity-75" />

                  <span className="relative h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
                </span>

                <span className="text-xs font-semibold text-green-700">
                  System Operational
                </span>
              </div>

              {/* ===============================================
                  PROFILE
              ================================================ */}

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(
                      (previous) =>
                        !previous
                    )
                  }
                  className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-gray-100"
                  aria-expanded={profileOpen}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F4C3A] shadow-sm">
                    <span className="text-sm font-bold text-[#E5C75A]">
                      {user?.name
                        ?.charAt(0)
                        .toUpperCase() || "S"}
                    </span>
                  </div>

                  <div className="hidden text-left sm:block">
                    <p className="max-w-[150px] truncate text-sm font-semibold text-gray-900">
                      {user?.name ||
                        "Super Administrator"}
                    </p>

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0F4C3A]">
                      Super Admin
                    </p>
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      profileOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {/* =============================================
                    PROFILE DROPDOWN
                ============================================== */}

                {profileOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close profile menu"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="fixed inset-0 z-40 cursor-default"
                    />

                    <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                      {/* User information */}

                      <div className="border-b border-gray-100 bg-gradient-to-br from-[#F7FAF8] to-white px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0F4C3A] shadow-sm">
                            <span className="font-bold text-[#E5C75A]">
                              {user?.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                "S"}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-gray-900">
                              {user?.name ||
                                "Super Administrator"}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-gray-400">
                              {user?.email || ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Portal navigation */}

                      <div className="p-2">
                        <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                          Switch Portal
                        </p>

                        <button
                          type="button"
                          onClick={
                            goToPublicSite
                          }
                          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 transition group-hover:bg-[#0F4C3A]/10">
                            <LayoutDashboard className="h-4 w-4 text-gray-500 group-hover:text-[#0F4C3A]" />
                          </span>

                          <span>
                            Public Website
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={
                            goToMainDashboard
                          }
                          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 transition group-hover:bg-[#0F4C3A]/10">
                            <Users className="h-4 w-4 text-gray-500 group-hover:text-[#0F4C3A]" />
                          </span>

                          <span>
                            Main Dashboard
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={
                            goToDevConsole
                          }
                          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 transition group-hover:bg-[#0F4C3A]/10">
                            <Activity className="h-4 w-4 text-gray-500 group-hover:text-[#0F4C3A]" />
                          </span>

                          <span>
                            Developer Console
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(
                              false
                            );

                            navigate(
                              "/super-admin"
                            );
                          }}
                          className="mt-1 flex w-full items-center gap-3 rounded-xl bg-[#0F4C3A]/5 px-3 py-2.5 text-left text-sm font-semibold text-[#0F4C3A]"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F4C3A]/10">
                            <ShieldCheck className="h-4 w-4" />
                          </span>

                          <span>
                            Super Admin Portal
                          </span>
                        </button>
                      </div>

                      {/* Logout */}

                      <div className="border-t border-gray-100 p-2">
                        <button
                          type="button"
                          onClick={
                            handleLogout
                          }
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                            <LogOut className="h-4 w-4" />
                          </span>

                          <span>
                            Sign Out
                          </span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT
        ==================================================== */}

        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}