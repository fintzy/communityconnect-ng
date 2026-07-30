import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,  X,  Bell,  User as UserIcon,  LogOut,  LayoutDashboard,  Home,  ChevronDown,  Code,  Shield
} from "lucide-react";
import { store } from "../services/store";
import type { User as AppUser} from "../services/store";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/devconsole", label: "Dev Console", icon: Code },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(store.getCurrentUser());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(user ? store.getUnreadNotificationCount(user.id) : 0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setNotifCount(store.getUnreadNotificationCount(user.id));
    } else {
      setNotifCount(0);
    }
  }, [user]);

  useEffect(() => {
    const syncAuth = () => {
      setUser(store.getCurrentUser());
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("authChanged", syncAuth);
    syncAuth();

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChanged", syncAuth);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
  store.logout();
  setUser(null);

  window.dispatchEvent(new Event("authChanged"));

  navigate("/auth");
  };

  const unreadNotifs = notifCount;

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0F4C3A] border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#0F4C3A]" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Community<span className="text-[#D4AF37]">Connect</span>
                <span className="text-[10px] ml-0.5 text-white/60 font-normal">NG</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.path;
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
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {/* Notifications */}
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => setNotifOpen(!notifOpen)}
                      className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadNotifs > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D4AF37] text-[#0F4C3A] text-[10px] font-bold rounded-full flex items-center justify-center">
                          {unreadNotifs}
                        </span>
                      )}
                    </button>
                    <AnimatePresence>
                      {notifOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                        >
                          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">Notifications</span>
                            {unreadNotifs > 0 && (
                              <button
                                onClick={() => { store.markAllNotificationsRead(user.id); setNotifCount(0); }}
                                className="text-xs text-[#0F4C3A] hover:underline font-medium"
                              >
                                Mark all read
                              </button>
                            )}
                          </div>
                          <div className="max-h-72 overflow-y-auto">
                            {store.getNotifications(user.id).length === 0 ? (
                              <div className="p-6 text-center text-sm text-gray-400">
                                No notifications yet
                              </div>
                            ) : (
                              store.getNotifications(user.id).slice(0, 5).map((n) => (
                                <button
                                  key={n.id}
                                  onClick={() => { store.markNotificationRead(n.id); setNotifCount(store.getUnreadNotificationCount(user.id)); }}
                                  className={`w-full text-left p-3 border-b border-gray-50 transition-colors ${
                                    n.read ? "bg-white" : "bg-[#D4AF37]/5"
                                  } hover:bg-gray-50`}
                                >
                                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                                </button>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                     onClick={() => {setNotifOpen(false); setUserMenuOpen((prev) => !prev);}}
                      className="flex items-center gap-2 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
                      <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                        <UserIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </div>
                      <span className="hidden sm:block text-sm text-white/80">{user.name.split(" ")[0]}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                        >
                          <div className="p-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-[#0F4C3A]/10 text-[#0F4C3A] text-[10px] font-medium rounded-full capitalize">
                              {user.role}
                            </span>
                          </div>
                          <button
                            onClick={() => { setUserMenuOpen(false); navigate("/dashboard"); }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Dashboard
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
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
                <Link
                  to="/auth"
                  className="px-4 py-2 bg-[#D4AF37] text-[#0F4C3A] text-sm font-semibold rounded-lg hover:bg-[#C5A032] transition-all"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#D4AF37]/10 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
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
                {user && (
                  <button
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

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0F4C3A] border-t border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-[#0F4C3A]" />
                </div>
                <span className="font-bold text-base text-white">CommunityConnect</span>
              </div>
              <p className="text-sm text-white/60 max-w-md leading-relaxed">
                Empowering Nigerian communities through transparent civic engagement, 
                real-time reporting, and collaborative governance.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors">Home</Link></li>
                <li><Link to="/dashboard" className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors">Dashboard</Link></li>
                <li>{user ? (
                  <button onClick={handleLogout} className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors">
                    Sign Out
                  </button>
                  ) : (
                  <Link to="/auth" className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors">
                    Sign In
                  </Link>
                )}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/devconsole" className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors">Developer Console</Link></li>
                <li><span className="text-sm text-white/60">Documentation</span></li>
                <li><span className="text-sm text-white/60">API Reference</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[#D4AF37]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} CommunityConnect NG. All rights reserved.
            </p>
            <p className="text-xs text-white/30">
              Built with integrity for the citizens of Nigeria.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}