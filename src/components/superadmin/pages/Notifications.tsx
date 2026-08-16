import {
  Bell,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useMemo } from "react";
import { store } from "../../../services/store";

export default function Notifications() {
  const users = useMemo(
    () => store.getAllUsers(),
    []
  );

  const notifications = useMemo(
    () => store.getAllNotifications(),
    []
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#D4AF37]" />

          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F4C3A]">
            Super Administrator
          </span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
          Notifications
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor notifications generated for registered users.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Notifications
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {notifications.length}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-500">
            Unread
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {
              notifications.filter(
                (notification) =>
                  !notification.read
              ).length
            }
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-500">
            Registered Users
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {users.length}
          </p>
        </div>

      </div>

      {/* Notifications */}
      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            Notification Activity
          </h2>

          <p className="text-xs text-gray-400 mt-1">
            Latest system notifications
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <Bell className="w-8 h-8 mx-auto text-gray-300" />

            <p className="mt-3 text-sm text-gray-500">
              No notifications found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {notifications.map(
              (notification) => (
                <div
                  key={notification.id}
                  className="px-5 py-5"
                >
                  <div className="flex items-start gap-4">

                    <div className="w-9 h-9 shrink-0 rounded-xl bg-[#0F4C3A]/5 flex items-center justify-center">
                      {notification.read ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#D4AF37]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </h3>

                          <p className="mt-1 text-sm text-gray-600">
                            {notification.message}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-semibold ${
                            notification.read
                              ? "bg-gray-100 text-gray-500"
                              : "bg-[#D4AF37]/15 text-[#8B6914]"
                          }`}
                        >
                          {notification.read
                            ? "Read"
                            : "Unread"}
                        </span>

                      </div>

                      <div className="flex flex-wrap gap-3 mt-3">

                        <span className="text-[11px] text-gray-400">
                          User: {notification.userId}
                        </span>

                        <span className="text-[11px] text-gray-400">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </span>

                      </div>

                    </div>

                  </div>
                </div>
              )
            )}

          </div>
        )}

      </section>
    </div>
  );
}