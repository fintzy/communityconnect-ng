import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Database,
  FileJson,
  RefreshCw,
  Users,
  FileText,
  MessageCircle,
  Megaphone,
  ClipboardList,
  Shield,
  Key,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Bell,
   type LucideIcon,
} from "lucide-react";

//import DashboardCards from "../components/superadmin/pages/DashboardCards";
// import SystemHealth from "../components/superadmin/SystemHealth";
// import DatabaseOverview from "../components/superadmin/DatabaseOverview";
// import AuditOverview from "../components/superadmin/AuditOverview";
// import ApiOverview from "../components/superadmin/ApiOverview";
import { store } from "../services/store";
import type { AuditLog } from "../services/store";

type Tab = "schema" | "data" | "auth" | "audit" | "api";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "schema", label: "Schema", icon: Database },
  { id: "data", label: "Data Browser", icon: FileJson },
  { id: "auth", label: "Auth", icon: Key },
  { id: "audit", label: "Audit Logs", icon: ClipboardList },
  { id: "api", label: "API Docs", icon: Code },
];

const SCHEMA_TABLES = [
  {
    name: "users",
    icon: Users,
    columns: [
      { name: "id", type: "UUID", pk: true },
      { name: "email", type: "VARCHAR(255)", unique: true },
      { name: "name", type: "VARCHAR(255)" },
      { name: "role", type: "ENUM('resident','admin')" },
      { name: "ward", type: "VARCHAR(255)" },
      { name: "lga", type: "VARCHAR(255)" },
      { name: "state", type: "VARCHAR(255)" },
      { name: "avatar", type: "TEXT", nullable: true },
      { name: "created_at", type: "TIMESTAMPTZ" },
    ],
  },
  {
    name: "reports",
    icon: FileText,
    columns: [
      { name: "id", type: "UUID", pk: true },
      { name: "user_id", type: "UUID", fk: "users.id" },
      { name: "title", type: "VARCHAR(500)" },
      { name: "description", type: "TEXT" },
      { name: "category", type: "ENUM('roads','water','power','sanitation','health','education','security','other')" },
      { name: "status", type: "ENUM('pending','under-review','resolved','dismissed')" },
      { name: "ward", type: "VARCHAR(255)" },
      { name: "lga", type: "VARCHAR(255)" },
      { name: "upvotes", type: "INTEGER", default: 0 },
      { name: "resolution", type: "TEXT", nullable: true },
      { name: "created_at", type: "TIMESTAMPTZ" },
      { name: "updated_at", type: "TIMESTAMPTZ" },
    ],
  },
  {
    name: "comments",
    icon: MessageCircle,
    columns: [
      { name: "id", type: "UUID", pk: true },
      { name: "report_id", type: "UUID", fk: "reports.id" },
      { name: "user_id", type: "UUID", fk: "users.id" },
      { name: "content", type: "TEXT" },
      { name: "created_at", type: "TIMESTAMPTZ" },
    ],
  },
  {
    name: "announcements",
    icon: Megaphone,
    columns: [
      { name: "id", type: "UUID", pk: true },
      { name: "title", type: "VARCHAR(500)" },
      { name: "content", type: "TEXT" },
      { name: "author_name", type: "VARCHAR(255)" },
      { name: "created_at", type: "TIMESTAMPTZ" },
    ],
  },
  {
    name: "notifications",
    icon: Bell,
    columns: [
      { name: "id", type: "UUID", pk: true },
      { name: "user_id", type: "UUID", fk: "users.id" },
      { name: "title", type: "VARCHAR(255)" },
      { name: "message", type: "TEXT" },
      { name: "read", type: "BOOLEAN", default: false },
      { name: "created_at", type: "TIMESTAMPTZ" },
    ],
  },
  {
    name: "audit_logs",
    icon: ClipboardList,
    columns: [
      { name: "id", type: "UUID", pk: true },
      { name: "user_id", type: "UUID", fk: "users.id" },
      { name: "action", type: "VARCHAR(100)" },
      { name: "details", type: "TEXT" },
      { name: "created_at", type: "TIMESTAMPTZ" },
    ],
  },
];

const RLS_POLICIES = [
  {
    table: "reports",
    policies: [
      "SELECT: Authenticated users can view all reports",
      "INSERT: Authenticated users can create reports (user_id = auth.uid())",
      "UPDATE: Only admins and super-admins can update report status",
      "DELETE: Only admins and super-admins can delete reports",
    ],
  },
  {
    table: "comments",
    policies: [
      "SELECT: Authenticated users can view all comments",
      "INSERT: Authenticated users can comment on any report",
      "DELETE: Users can delete their own comments; admins and super-admins can delete any",
    ],
  },
  {
    table: "users",
    policies: [
      "SELECT: Users can view their own profile; admins and super-admins can view all",
      "UPDATE: Users can update their own profile",
    ],
  },
];

export default function DevConsole() {
  const [activeTab, setActiveTab] = useState<Tab>("schema");
  const [expandedTable, setExpandedTable] = useState<string | null>("users");
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setAuditLogs(store.getAuditLogs());
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jwtToken = store.getToken();

  return (
  <motion.div initial={{opacity: 0, y: 12,}}
    animate={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      duration: 0.35,
      ease: "easeOut",
    }}
    className="..."
  >      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#0F4C3A] flex items-center justify-center">
            <Code className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F4C3A]">Developer Console</h1>
            <p className="text-sm text-gray-500">Architecture reference, schema, auth, and API overview</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                active
                  ? "bg-[#0F4C3A] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Schema Tab */}
      {activeTab === "schema" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Database Tables</h2>
              {SCHEMA_TABLES.map((table) => {
                const expanded = expandedTable === table.name;
                const Icon = table.icon;
                return (
                  <div key={table.name} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setExpandedTable(expanded ? null : table.name)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0F4C3A]/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#0F4C3A]" />
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-semibold text-gray-900">{table.name}</span>
                          <p className="text-xs text-gray-400">{table.columns.length} columns</p>
                        </div>
                      </div>
                      {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                    </button>
                    {expanded && (
                      <div className="px-4 pb-4">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-t border-gray-100">
                              <th className="text-left py-2 pr-4 font-medium text-gray-500">Column</th>
                              <th className="text-left py-2 pr-4 font-medium text-gray-500">Type</th>
                              <th className="text-left py-2 font-medium text-gray-500">Constraints</th>
                            </tr>
                          </thead>
                          <tbody>
                            {table.columns.map((col) => (
                              <tr key={col.name} className="border-t border-gray-50">
                                <td className="py-2 pr-4 font-mono text-gray-900">{col.name}</td>
                                <td className="py-2 pr-4 font-mono text-gray-600">{col.type}</td>
                                <td className="py-2">
                                  <div className="flex gap-1">
                                    {"pk" in col && col.pk && (
                                    <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[9px] font-medium">
                                         PK
                                     </span>
                                    )}

                                    {"fk" in col && col.fk && (
                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-medium">
                                    FK→{col.fk}
                                    </span>
                                    )}

                                  {"unique" in col && col.unique && (
                                   <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-medium">
                                  UNIQUE
                                  </span>
                                  )}

                                  {"nullable" in col && col.nullable && (
                                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-medium">
                                 NULLABLE
                                 </span>
                                )}

                                {"default" in col && (
                                 <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-medium">
                                DEFAULT {String(col.default)}
                                </span>
                              )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RLS Policies Sidebar */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Row Level Security</h2>
              <div className="space-y-3">
                {RLS_POLICIES.map((item) => (
                  <div key={item.table} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-[#0F4C3A]" />
                      <span className="text-sm font-semibold text-gray-900 capitalize">{item.table}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {item.policies.map((policy, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                          {policy}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Data Browser Tab */}
      {activeTab === "data" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Data Browser</h2>
              <button
                onClick={() => setAuditLogs(store.getAuditLogs())}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Users", value: ((store as { getUsers?: () => unknown[] }).getUsers?.() ?? []).length, icon: Users, color: "text-[#0F4C3A]" },
                  { label: "Reports", value: store.getReports().length, icon: FileText, color: "text-[#D4AF37]" },
                  { label: "Comments", value: store.getStats().totalComments, icon: MessageCircle, color: "text-blue-600" },
                  { label: "Announcements", value: store.getStats().totalAnnouncements, icon: Megaphone, color: "text-purple-600" },
                  { label: "Notifications", value: store.getStats().totalNotifications, icon: Bell, color: "text-orange-600" },
                  { label: "Audit Logs", value: auditLogs.length, icon: ClipboardList, color: "text-gray-600" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-5 h-5 ${item.color}`} />
                        <span className="text-sm font-medium text-gray-900">{item.label}</span>
                      </div>
                      <p className="text-2xl font-bold text-[#0F4C3A]">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Auth Tab */}
      {activeTab === "auth" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-sm font-semibold text-gray-900">JWT Token</h2>
              </div>
              {jwtToken ? (
                <div className="relative">
                  <pre className="p-3 bg-gray-50 rounded-xl text-[11px] font-mono text-gray-600 break-all max-h-32 overflow-y-auto">
                    {jwtToken}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(jwtToken)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No active session. Sign in to see JWT.</p>
              )}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs text-amber-700">
                  <strong>Note:</strong> This is a simulated JWT for development purposes. 
                  In production, tokens are signed with HS256 and verified server-side.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#0F4C3A]" />
                <h2 className="text-sm font-semibold text-gray-900">Test Accounts</h2>
              </div>
              <div className="space-y-3">
                {[
                  { email: "okutu@communityconnect.ng", password: "!Hous3Mat37", role: "Super-Admin", name: "Okutu Anthony" },
                  { email: "admin@communityconnect.ng", password: "12345678", role: "Admin", name: "Adebayo Ogunlana" },
                  { email: "chioma@example.com", password: "12345678", role: "Resident", name: "Chioma Nwosu" },
                  { email: "emeka@example.com", password: "12345678", role: "Resident", name: "Emeka Okafor" },
                ].map((account) => (
                  <div key={account.email} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{account.name}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                        account.role === "Super-Admin" ? "bg-[#0F4C3A]/10 text-[#0F4C3A]" : account.role === "Admin" ? "bg-[#D4AF37]/10 text-[#8B6914]" : "bg-[#0F4C3A]/10 text-[#0F4C3A]"
                      }`}>
                        {account.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">{account.email}</p>
                    {import.meta.env.DEV && (
                    <p className="text-xs text-gray-400 font-mono">Password: ********</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === "audit" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Audit Trail</h2>
              <button
                onClick={() => setAuditLogs(store.getAuditLogs())}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Action</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Details</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No audit logs yet</td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-medium">{log.action}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-900">{log.userName}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{log.details}</td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* API Docs Tab */}
      {activeTab === "api" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="space-y-4">
            {[
              {
                method: "POST",
                path: "/api/auth/login",
                desc: "Authenticate user with email and password",
                body: JSON.stringify({ email: "user@example.com", password: "********" }, null, 2),
                response: JSON.stringify({ user: { id: "uuid", name: "Chioma", role: "resident" }, token: "jwt..." }, null, 2),
              },
              {
                method: "POST",
                path: "/api/auth/register",
                desc: "Create a new user account",
                body: JSON.stringify({ email: "user@example.com", name: "Chioma Nwosu", password: "********", role: "resident", ward: "Garki", lga: "Abuja Municipal", state: "FCT" }, null, 2),
                response: JSON.stringify({ user: { id: "uuid", name: "Chioma", role: "resident" }, token: "jwt..." }, null, 2),
              },
              {
                method: "GET",
                path: "/api/reports",
                desc: "Get all reports (sorted by newest first)",
                response: JSON.stringify({ data: [{ id: "rpt-001", title: "Burst water pipe", status: "under-review" }], count: 1 }, null, 2),
              },
              {
                method: "POST",
                path: "/api/reports",
                desc: "Create a new report",
                body: JSON.stringify({ title: "Pothole on Main Road", description: "Deep pothole...", category: "roads", ward: "Garki Unit 1", lga: "Abuja Municipal" }, null, 2),
                response: JSON.stringify({ data: { id: "rpt-004", status: "pending" } }, null, 2),
              },
              {
                method: "PATCH",
                path: "/api/reports/:id/status",
                desc: "Update report status (admin only)",
                body: JSON.stringify({ status: "resolved", resolution: "Fixed by maintenance team" }, null, 2),
                response: JSON.stringify({ data: { id: "rpt-001", status: "resolved" } }, null, 2),
              },
              {
                method: "POST",
                path: "/api/reports/:id/upvote",
                desc: "Upvote a report",
                response: JSON.stringify({ data: { id: "rpt-001", upvotes: 13 } }, null, 2),
              },
              {
                method: "GET",
                path: "/api/reports/:id/comments",
                desc: "Get comments for a report",
                response: JSON.stringify({ data: [{ id: "cmt-001", content: "I saw this too", userName: "Emeka" }] }, null, 2),
              },
              {
                method: "POST",
                path: "/api/reports/:id/comments",
                desc: "Add a comment to a report",
                body: JSON.stringify({ content: "Please fix this urgently" }, null, 2),
                response: JSON.stringify({ data: { id: "cmt-004", content: "Please fix this urgently" } }, null, 2),
              },
            ].map((endpoint, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      endpoint.method === "GET" ? "bg-green-100 text-green-700" :
                      endpoint.method === "POST" ? "bg-blue-100 text-blue-700" :
                      endpoint.method === "PATCH" ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono text-gray-900">{endpoint.path}</code>
                  </div>
                  <p className="text-xs text-gray-500">{endpoint.desc}</p>
                </div>
                {(endpoint.body || endpoint.response) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                    {endpoint.body && (
                      <div className="p-3 border-r border-gray-100">
                        <p className="text-[10px] font-semibold text-gray-400 mb-1 uppercase tracking-wider">Request Body</p>
                        <pre className="text-[11px] font-mono text-gray-600 whitespace-pre-wrap">{endpoint.body}</pre>
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-[10px] font-semibold text-gray-400 mb-1 uppercase tracking-wider">Response</p>
                      <pre className="text-[11px] font-mono text-gray-600 whitespace-pre-wrap">{endpoint.response}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}