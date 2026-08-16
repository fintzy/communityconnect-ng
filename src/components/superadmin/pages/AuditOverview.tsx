import {
  Activity,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { store } from "../../../services/store";

export default function AuditOverview() {
  const logs = store.getAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F4C3A]">
          Audit Logs
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor important activities performed across the system.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5">
          <Activity className="mb-3 h-6 w-6 text-[#0F4C3A]" />
          <p className="text-2xl font-bold">{logs.length}</p>
          <p className="text-sm text-gray-500">Total Events</p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <ShieldCheck className="mb-3 h-6 w-6 text-green-600" />
          <p className="text-2xl font-bold">Active</p>
          <p className="text-sm text-gray-500">Audit Monitoring</p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <Clock className="mb-3 h-6 w-6 text-blue-600" />
          <p className="text-2xl font-bold">
            {logs.length > 0
              ? new Date(logs[0].createdAt).toLocaleDateString(
                  "en-NG"
                )
              : "N/A"}
          </p>
          <p className="text-sm text-gray-500">Latest Activity</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            System Activity
          </h2>
        </div>

        <div className="divide-y">
          {logs.map((log) => (
            <div key={log.id} className="p-5 hover:bg-gray-50">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F4C3A]/10">
                  <Activity className="h-5 w-5 text-[#0F4C3A]" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row">
                    <p className="font-medium text-gray-900">
                      {log.action}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleString(
                        "en-NG"
                      )}
                    </p>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">
                    {log.details}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    Performed by {log.userName}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="p-10 text-center text-sm text-gray-500">
              No audit activity recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}