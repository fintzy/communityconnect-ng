import { useMemo } from "react";
import { Link } from "react-router-dom";
import {  Users,  ShieldCheck,  UserCheck,  UserPlus,  FileText,  CheckCircle2,  Clock3,  AlertTriangle,  Activity,  ArrowUpRight,  ClipboardList,} from "lucide-react";
import { store } from "../../services/store";

export default function SuperAdminDashboard() {
  const stats = useMemo(() => store.getStats(), []);
  const recentUsers = useMemo(() => store.getRecentUsers(5), []);
  const recentReports = useMemo(() => store.getRecentReports(5), []);
  const auditLogs = useMemo(
    () => store.getAuditLogs().slice(0, 5),
    []
  );
  const systemHealth = useMemo(() => store.getSystemHealth(), []);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: `${stats.activeUsers} active accounts`,
    },
    {
      label: "Super Admins",
      value: stats.superAdmins,
      icon: ShieldCheck,
      description: "Highest privilege accounts",
    },
    {
      label: "Administrators",
      value: stats.admins,
      icon: UserCheck,
      description: "Administrative accounts",
    },
    {
      label: "Residents",
      value: stats.residents,
      icon: UserPlus,
      description: "Registered citizens",
    },
    {
      label: "Total Reports",
      value: stats.totalReports,
      icon: FileText,
      description: "Community reports",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      description: `${stats.resolutionRate}% resolution rate`,
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock3,
      description: "Awaiting action",
    },
    {
      label: "Under Review",
      value: stats.underReview,
      icon: AlertTriangle,
      description: "Currently being reviewed",
    },
  ];

  return (
    <div className="space-y-8">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />

            <span className="text-xs font-semibold uppercase tracking-wider text-[#0F4C3A]">
              Super Administrator
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            System Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor users, reports, activity, and platform health.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0F4C3A]/5 rounded-xl">
          <Activity className="w-4 h-4 text-[#0F4C3A]" />

          <span className="text-sm font-medium text-[#0F4C3A]">
            System Operational
          </span>
        </div>
      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      {card.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {card.value}
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      {card.description}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#0F4C3A]/5 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#0F4C3A]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          RECENT USERS / REPORTS
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Users */}
        <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Recent Users
              </h2>

              <p className="text-xs text-gray-400 mt-0.5">
                Latest registered accounts
              </p>
            </div>

            <Link
              to="/super-admin/users"
              className="flex items-center gap-1 text-xs font-medium text-[#0F4C3A] hover:text-[#8B6914] transition-colors"
            >
              Manage
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">

            {recentUsers.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">
                No users found.
              </div>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-9 h-9 shrink-0 rounded-full bg-[#0F4C3A] flex items-center justify-center">
                      <span className="text-xs font-bold text-[#D4AF37]">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>

                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                  </div>

                  <span
                    className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-semibold capitalize ${
                      user.role === "super-admin"
                        ? "bg-[#D4AF37]/15 text-[#8B6914]"
                        : user.role === "admin"
                        ? "bg-[#0F4C3A]/10 text-[#0F4C3A]"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))
            )}

          </div>
        </section>

        {/* Recent Reports */}
        <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Recent Reports
              </h2>

              <p className="text-xs text-gray-400 mt-0.5">
                Latest community activity
              </p>
            </div>

            <Link
              to="/super-admin/reports"
              className="flex items-center gap-1 text-xs font-medium text-[#0F4C3A] hover:text-[#8B6914] transition-colors"
            >
              View all
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">

            {recentReports.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">
                No reports found.
              </div>
            ) : (
              recentReports.map((report) => (
                <div
                  key={report.id}
                  className="px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {report.title}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {report.lga} · {report.category}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-semibold ${
                        report.status === "resolved"
                          ? "bg-green-50 text-green-700"
                          : report.status === "under-review"
                          ? "bg-amber-50 text-amber-700"
                          : report.status === "dismissed"
                          ? "bg-red-50 text-red-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {report.status}
                    </span>

                  </div>
                </div>
              ))
            )}

          </div>
        </section>

      </div>

      {/* =====================================================
          AUDIT / SYSTEM HEALTH
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Audit Activity */}
        <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-[#0F4C3A]/5 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-[#0F4C3A]" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Recent Audit Activity
              </h2>

              <p className="text-xs text-gray-400 mt-0.5">
                Administrative actions
              </p>
            </div>

          </div>

          <div className="divide-y divide-gray-100">

            {auditLogs.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">
                No audit activity found.
              </div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="px-5 py-4"
                >
                  <div className="flex items-start gap-3">

                    <div className="w-2 h-2 mt-1.5 rounded-full bg-[#D4AF37] shrink-0" />

                    <div className="min-w-0">

                      <p className="text-xs font-semibold text-gray-800">
                        {log.action}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {log.details}
                      </p>

                      <p className="text-[10px] text-gray-400 mt-1.5">
                        {log.userName}
                      </p>

                    </div>

                  </div>
                </div>
              ))
            )}

          </div>
        </section>

        {/* System Health */}
        <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <Activity className="w-4 h-4 text-green-600" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                System Health
              </h2>

              <p className="text-xs text-gray-400 mt-0.5">
                Current platform status
              </p>
            </div>

          </div>

          <div className="p-5 space-y-4">

            <HealthRow
              label="Uptime"
              value={systemHealth.uptime}
              status="healthy"
            />

            <HealthRow
              label="Database"
              value={systemHealth.database}
              status="healthy"
            />

            <HealthRow
              label="API"
              value={systemHealth.api}
              status="healthy"
            />

            <HealthRow
              label="Storage"
              value={systemHealth.storage}
              status="warning"
            />

            <HealthRow
              label="Memory"
              value={systemHealth.memory}
              status="healthy"
            />

            <HealthRow
              label="CPU"
              value={systemHealth.cpu}
              status="healthy"
            />

          </div>
        </section>

      </div>

    </div>
  );
}

/* ============================================================
   HEALTH ROW
============================================================ */

type HealthStatus = "healthy" | "warning";

interface HealthRowProps {
  label: string;
  value: string;
  status: HealthStatus;
}

function HealthRow({
  label,
  value,
  status,
}: HealthRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="text-sm text-gray-600">
        {label}
      </span>

      <div className="flex items-center gap-2">

        <span
          className={`w-2 h-2 rounded-full ${
            status === "healthy"
              ? "bg-green-500"
              : "bg-amber-500"
          }`}
        />

        <span className="text-sm font-medium text-gray-900">
          {value}
        </span>

      </div>

    </div>
  );
}