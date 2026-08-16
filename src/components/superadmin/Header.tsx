import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Home,
  LayoutDashboard,
  ShieldCheck,
  Terminal,
  LogOut,
} from "lucide-react";

import { store } from "../../services/store";

export default function Header() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = store.getCurrentUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

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

  function navigateTo(path: string) {
    setOpen(false);
    navigate(path);
  }

  function handleLogout() {
    setOpen(false);

    store.logout();

    navigate("/auth", {
      replace: true,
    });
  }

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8">
      {/* LEFT SIDE */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#0F4C3A]">
          CommunityConnect NG
        </p>

        <h1 className="text-lg font-bold text-gray-900">
          Super Administration
        </h1>
      </div>

      {/* RIGHT SIDE */}
      <div
        className="relative"
        ref={dropdownRef}
      >
        <button
          type="button"
          onClick={() =>
            setOpen((previous) => !previous)
          }
          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
        >
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#0F4C3A] flex items-center justify-center">
            <span className="text-sm font-bold text-[#D4AF37]">
              {user?.name
                ?.charAt(0)
                .toUpperCase() || "S"}
            </span>
          </div>

          {/* User details */}
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-900">
              {user?.name || "Super Administrator"}
            </p>

            <p className="text-[10px] text-gray-400">
              Super Administrator
            </p>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* =====================================================
            DROPDOWN
        ====================================================== */}

        {open && (
          <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
            {/* Account header */}
            <div className="px-4 py-4 bg-[#0F4C3A]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
                  <span className="font-bold text-[#0F4C3A]">
                    {user?.name
                      ?.charAt(0)
                      .toUpperCase() || "S"}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.name || "Super Administrator"}
                  </p>

                  <p className="text-xs text-white/60 truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-2">

              {/* Public */}
              <button
                type="button"
                onClick={() => navigateTo("/")}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <Home className="w-4 h-4 text-[#0F4C3A]" />

                <div>
                  <p className="font-medium">
                    Public Home
                  </p>

                  <p className="text-[10px] text-gray-400">
                    View public CommunityConnect site
                  </p>
                </div>
              </button>

              {/* Main Dashboard */}
              <button
                type="button"
                onClick={() =>
                  navigateTo("/dashboard")
                }
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <LayoutDashboard className="w-4 h-4 text-[#0F4C3A]" />

                <div>
                  <p className="font-medium">
                    Main Dashboard
                  </p>

                  <p className="text-[10px] text-gray-400">
                    Return to your normal dashboard
                  </p>
                </div>
              </button>

              {/* Super Admin */}
              <button
                type="button"
                onClick={() =>
                  navigateTo("/super-admin")
                }
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-[#0F4C3A]/5 text-[#0F4C3A] transition-colors text-left"
              >
                <ShieldCheck className="w-4 h-4" />

                <div>
                  <p className="font-semibold">
                    Super Admin Portal
                  </p>

                  <p className="text-[10px] text-gray-500">
                    System administration
                  </p>
                </div>
              </button>

              {/* Dev Console */}
              <button
                type="button"
                onClick={() =>
                  navigateTo("/devconsole")
                }
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <Terminal className="w-4 h-4 text-[#0F4C3A]" />

                <div>
                  <p className="font-medium">
                    Dev Console
                  </p>

                  <p className="text-[10px] text-gray-400">
                    Developer tools
                  </p>
                </div>
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-100 p-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />

                <span className="font-medium">
                  Sign Out
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}