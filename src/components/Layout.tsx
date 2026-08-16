import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Menu,
  X,
  Bell,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Home,
  ChevronDown,
  Code,
  Shield,
  Crown,
  Moon,
  Sun,
} from "lucide-react";

import { store } from "../services/store";
import type { User as AppUser } from "../services/store";

import EmergencyBar from "./EmergencyBar";
import { useTheme } from "../components/context/useTheme";

const NAV_ITEMS = [
  {
    path: "/",
    label: "Home",
    icon: Home,
  },
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/devconsole",
    label: "Dev Console",
    icon: Code,
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<AppUser | null>(
    store.getCurrentUser()
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [notifCount, setNotifCount] = useState(
    user
      ? store.getUnreadNotificationCount(user.id)
      : 0
  );

  const userMenuRef =
    useRef<HTMLDivElement>(null);

  const notifRef =
    useRef<HTMLDivElement>(null);

  /*
   * ----------------------------------------------------
   * RESET SCROLL POSITION WHEN ROUTE CHANGES
   * ----------------------------------------------------
   */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [location.pathname]);

  /*
   * ----------------------------------------------------
   * SYNC NOTIFICATION COUNT
   * ----------------------------------------------------
   */

  useEffect(() => {
    if (user) {
      setNotifCount(
        store.getUnreadNotificationCount(user.id)
      );
    } else {
      setNotifCount(0);
    }
  }, [user]);

  /*
   * ----------------------------------------------------
   * SYNC AUTHENTICATION STATE
   * ----------------------------------------------------
   */

  useEffect(() => {
    const syncAuth = () => {
      const currentUser =
        store.getCurrentUser();

      setUser(currentUser);

      if (currentUser) {
        setNotifCount(
          store.getUnreadNotificationCount(
            currentUser.id
          )
        );
      } else {
        setNotifCount(0);
      }
    };

    window.addEventListener(
      "storage",
      syncAuth
    );

    window.addEventListener(
      "authChanged",
      syncAuth
    );

    syncAuth();

    return () => {
      window.removeEventListener(
        "storage",
        syncAuth
      );

      window.removeEventListener(
        "authChanged",
        syncAuth
      );
    };
  }, []);

  /*
   * ----------------------------------------------------
   * CLOSE USER MENU WHEN CLICKING OUTSIDE
   * ----------------------------------------------------
   */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(
          event.target as Node
        )
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * ----------------------------------------------------
   * CLOSE NOTIFICATIONS WHEN CLICKING OUTSIDE
   * ----------------------------------------------------
   */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(
          event.target as Node
        )
      ) {
        setNotifOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * ----------------------------------------------------
   * CLOSE MENUS WHEN ROUTE CHANGES
   * ----------------------------------------------------
   */

  useEffect(() => {
    setMobileOpen(false);
    setNotifOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  /*
   * ----------------------------------------------------
   * LOGOUT
   * ----------------------------------------------------
   */

  const handleLogout = () => {
    store.logout();

    setUser(null);
    setNotifCount(0);

    setUserMenuOpen(false);
    setNotifOpen(false);
    setMobileOpen(false);

    window.dispatchEvent(
      new Event("authChanged")
    );

    navigate("/auth", {
      replace: true,
    });
  };

  /*
   * ----------------------------------------------------
   * MARK ALL NOTIFICATIONS READ
   * ----------------------------------------------------
   */

  const handleMarkAllNotificationsRead =
    () => {
      if (!user) {
        return;
      }

      store.markAllNotificationsRead(
        user.id
      );

      setNotifCount(0);
    };

  /*
   * ----------------------------------------------------
   * MARK SINGLE NOTIFICATION READ
   * ----------------------------------------------------
   */

  const handleNotificationClick = (
    notificationId: string
  ) => {
    if (!user) {
      return;
    }

    store.markNotificationRead(
      notificationId
    );

    setNotifCount(
      store.getUnreadNotificationCount(
        user.id
      )
    );
  };

  /*
   * ----------------------------------------------------
   * NOTIFICATIONS
   * ----------------------------------------------------
   */

  const notifications = user
    ? store.getNotifications(user.id)
    : [];

  /*
   * ----------------------------------------------------
   * ROLE HELPERS
   * ----------------------------------------------------
   */

  const isSuperAdmin =
    user?.role === "super-admin";

  const isAdmin =
    user?.role === "admin";

  const unreadNotifs = notifCount;

  /*
   * ----------------------------------------------------
   * RENDER
   * ----------------------------------------------------
   */

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] dark:bg-[#06110D] text-gray-900 dark:text-white flex flex-col transition-colors duration-300">

      {/* EMERGENCY BAR */}

      {user && <EmergencyBar />}

      {/* ==================================================
          HEADER
          ================================================== */}

      <header className="sticky top-0 z-50 bg-[#0F4C3A] border-b border-[#D4AF37]/20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="flex items-center justify-between h-16">

            {/* LOGO */}

            <Link
              to="/"
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#0F4C3A]" />
              </div>

              <span className="font-bold text-lg text-white tracking-tight">
                Community
                <span className="text-[#D4AF37]">
                  Connect
                </span>

                <span className="text-[10px] ml-0.5 text-white/60 font-normal">
                  NG
                </span>
              </span>
            </Link>

            {/* DESKTOP NAVIGATION */}

            <nav className="hidden md:flex items-center gap-1">

              {NAV_ITEMS.map((item) => {
                const active =
                  location.pathname ===
                  item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "bg-white/10 text-[#D4AF37]"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />

                    {item.label}
                  </Link>
                );
              })}

              {/* SUPER ADMIN */}

              {isSuperAdmin && (
                <Link
                  to="/super-admin"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    location.pathname.startsWith(
                      "/super-admin"
                    )
                      ? "bg-[#D4AF37] text-[#0F4C3A]"
                      : "text-[#D4AF37] hover:bg-[#D4AF37]/10"
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  Super Admin
                </Link>
              )}

            </nav>

            {/* RIGHT ACTIONS */}

            <div className="flex items-center gap-2">

              {/* THEME TOGGLE */}

              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
                aria-label={
                  theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
                title={
                  theme === "light"
                    ? "Dark mode"
                    : "Light mode"
                }
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5 text-[#D4AF37]" />
                )}
              </button>

              {/* AUTHENTICATED USER */}

              {user ? (
                <>
                  {/* NOTIFICATIONS */}

                  <div
                    className="relative"
                    ref={notifRef}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setNotifOpen(
                          (previous) =>
                            !previous
                        );
                      }}
                      className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
                      aria-label="Notifications"
                    >
                      <Bell className="w-5 h-5" />

                      {unreadNotifs > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#D4AF37] text-[#0F4C3A] text-[10px] font-bold rounded-full flex items-center justify-center">
                          {unreadNotifs}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {notifOpen && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: -8,
                            scale: 0.96,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            y: -8,
                            scale: 0.96,
                          }}
                          transition={{
                            duration: 0.15,
                          }}
                          className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#10241C] rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
                        >
                          <div className="p-3 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">

                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              Notifications
                            </span>

                            {unreadNotifs > 0 && (
                              <button
                                type="button"
                                onClick={
                                  handleMarkAllNotificationsRead
                                }
                                className="text-xs text-[#0F4C3A] dark:text-[#D4AF37] hover:underline font-medium"
                              >
                                Mark all read
                              </button>
                            )}

                          </div>

                          <div className="max-h-72 overflow-y-auto">

                            {notifications.length === 0 ? (
                              <div className="p-6 text-center text-sm text-gray-400">
                                No notifications yet
                              </div>
                            ) : (
                              notifications
                                .slice(0, 5)
                                .map(
                                  (
                                    notification
                                  ) => (
                                    <button
                                      type="button"
                                      key={
                                        notification.id
                                      }
                                      onClick={() =>
                                        handleNotificationClick(
                                          notification.id
                                        )
                                      }
                                      className={`w-full text-left p-3 border-b border-gray-50 dark:border-white/5 transition-colors ${
                                        notification.read
                                          ? "bg-white dark:bg-[#10241C]"
                                          : "bg-[#D4AF37]/5"
                                      } hover:bg-gray-50 dark:hover:bg-white/5`}
                                    >
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {
                                          notification.title
                                        }
                                      </p>

                                      <p className="text-xs text-gray-500 dark:text-white/50 mt-0.5 line-clamp-2">
                                        {
                                          notification.message
                                        }
                                      </p>
                                    </button>
                                  )
                                )
                            )}

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* USER MENU */}

                  <div
                    className="relative"
                    ref={userMenuRef}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setNotifOpen(false);

                        setUserMenuOpen(
                          (previous) =>
                            !previous
                        );
                      }}
                      className="flex items-center gap-2 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">

                        {isSuperAdmin ? (
                          <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                        ) : (
                          <UserIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                        )}

                      </div>

                      <span className="hidden sm:block text-sm text-white/80">
                        {user.name.split(" ")[0]}
                      </span>

                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: -8,
                            scale: 0.96,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            y: -8,
                            scale: 0.96,
                          }}
                          transition={{
                            duration: 0.15,
                          }}
                          className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#10241C] rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
                        >

                          {/* USER INFORMATION */}

                          <div className="p-3 border-b border-gray-100 dark:border-white/10">

                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              {user.email}
                            </p>

                            <span
                              className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${
                                isSuperAdmin
                                  ? "bg-[#D4AF37]/20 text-[#8B6914]"
                                  : isAdmin
                                  ? "bg-[#0F4C3A]/10 text-[#0F4C3A]"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {isSuperAdmin && (
                                <Crown className="w-3 h-3" />
                              )}

                              {user.role}
                            </span>

                          </div>

                          {/* DASHBOARD */}

                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);

                              if (
                                isSuperAdmin
                              ) {
                                navigate(
                                  "/super-admin"
                                );
                              } else {
                                navigate(
                                  "/dashboard"
                                );
                              }
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
                          >
                            {isSuperAdmin ? (
                              <>
                                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                                Super Admin Panel
                              </>
                            ) : (
                              <>
                                <LayoutDashboard className="w-3.5 h-3.5" />
                                Dashboard
                              </>
                            )}
                          </button>

                          {/* LOGOUT */}

                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign out
                          </button>

                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (

                /* SIGN IN */

                <Link
                  to="/auth"
                  className="px-4 py-2 bg-[#D4AF37] text-[#0F4C3A] text-sm font-semibold rounded-lg hover:bg-[#C5A032] transition-all"
                >
                  Sign In
                </Link>
              )}

              {/* MOBILE MENU */}

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(
                    (previous) => !previous
                  )
                }
                className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="md:hidden border-t border-[#D4AF37]/10 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">

                {NAV_ITEMS.map((item) => {
                  const active =
                    location.pathname ===
                    item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? "bg-white/10 text-[#D4AF37]"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}

                {/* SUPER ADMIN MOBILE LINK */}

                {isSuperAdmin && (
                  <Link
                    to="/super-admin"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      location.pathname.startsWith(
                        "/super-admin"
                      )
                        ? "bg-[#D4AF37] text-[#0F4C3A]"
                        : "text-[#D4AF37] hover:bg-white/5"
                    }`}
                  >
                    <Crown className="w-4 h-4" />
                    Super Admin
                  </Link>
                )}

                {/* MOBILE LOGOUT */}

                {user && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-300 hover:bg-white/5 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN CONTENT */}

      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}

      <footer className="bg-[#0F4C3A] border-t border-[#D4AF37]/10">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            {/* BRAND */}

            <div className="col-span-1 md:col-span-2">

              <div className="flex items-center gap-2.5 mb-3">

                <div className="w-7 h-7 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-[#0F4C3A]" />
                </div>

                <span className="font-bold text-base text-white">
                  CommunityConnect
                </span>

              </div>

              <p className="text-sm text-white/60 max-w-md leading-relaxed">
                Empowering Nigerian communities
                through transparent civic
                engagement, real-time reporting,
                and collaborative governance.
              </p>

            </div>

            {/* PLATFORM */}

            <div>

              <h4 className="text-sm font-semibold text-white mb-3">
                Platform
              </h4>

              <ul className="space-y-2">

                <li>
                  <Link
                    to="/"
                    className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    to={
                      isSuperAdmin
                        ? "/super-admin"
                        : "/dashboard"
                    }
                    className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors"
                  >
                    {isSuperAdmin
                      ? "Super Admin"
                      : "Dashboard"}
                  </Link>
                </li>

                <li>

                  {user ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors"
                    >
                      Sign In
                    </Link>
                  )}

                </li>

              </ul>
            </div>

            {/* RESOURCES */}

            <div>

              <h4 className="text-sm font-semibold text-white mb-3">
                Resources
              </h4>

              <ul className="space-y-2">

                <li>
                  <Link
                    to="/devconsole"
                    className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors"
                  >
                    Developer Console
                  </Link>
                </li>

                <li>
                  <span className="text-sm text-white/60">
                    Documentation
                  </span>
                </li>

                <li>
                  <span className="text-sm text-white/60">
                    API Reference
                  </span>
                </li>

              </ul>
            </div>

          </div>

          {/* COPYRIGHT */}

          <div className="mt-8 pt-6 border-t border-[#D4AF37]/10 flex flex-col sm:flex-row items-center justify-between gap-4">

            <p className="text-xs text-white/40">
              &copy;{" "}
              {new Date().getFullYear()}{" "}
              CommunityConnect NG. All rights reserved.
            </p>

            <p className="text-xs text-white/30">
              Built with integrity for the
              citizens of Nigeria.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}