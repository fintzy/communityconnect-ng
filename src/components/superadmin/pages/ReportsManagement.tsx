import { useMemo, useState } from "react";
import {
  FileText,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { store } from "../../../services/store";
import type { Report } from "../../../services/store";

export default function ReportsManagement() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | Report["status"]>("all");

  const reports = store.getAllReports();

  const filteredReports = useMemo(() => {
    const query = search.toLowerCase().trim();

    return reports.filter((report) => {
      const matchesSearch =
        !query ||
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.userName.toLowerCase().includes(query) ||
        report.lga.toLowerCase().includes(query);

      const matchesStatus =
        status === "all" || report.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [reports, search, status]);

  const statusClass = (reportStatus: Report["status"]) => {
    switch (reportStatus) {
      case "resolved":
        return "bg-green-100 text-green-700";

      case "under-review":
        return "bg-blue-100 text-blue-700";

      case "dismissed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const StatusIcon = ({ value }: { value: Report["status"] }) => {
    if (value === "resolved") {
      return <CheckCircle className="h-4 w-4" />;
    }

    if (value === "under-review") {
      return <Clock className="h-4 w-4" />;
    }

    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F4C3A]">
          Reports Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor all community incident reports.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5">
          <FileText className="mb-3 h-6 w-6 text-[#0F4C3A]" />
          <p className="text-2xl font-bold">{reports.length}</p>
          <p className="text-sm text-gray-500">Total Reports</p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <Clock className="mb-3 h-6 w-6 text-yellow-600" />
          <p className="text-2xl font-bold">
            {reports.filter((r) => r.status === "pending").length}
          </p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <CheckCircle className="mb-3 h-6 w-6 text-green-600" />
          <p className="text-2xl font-bold">
            {reports.filter((r) => r.status === "resolved").length}
          </p>
          <p className="text-sm text-gray-500">Resolved</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search reports..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#0F4C3A]"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as "all" | Report["status"]
              )
            }
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under-review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {report.category}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                      report.status
                    )}`}
                  >
                    <StatusIcon value={report.status} />

                    {report.status}
                  </span>
                </div>

                <h2 className="font-semibold text-gray-900">
                  {report.title}
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  {report.description}
                </p>

                <div className="mt-3 text-xs text-gray-400">
                  Reported by {report.userName} · {report.ward},{" "}
                  {report.lga}
                </div>
              </div>

              <div className="text-right text-xs text-gray-400">
                <p>{report.upvotes} upvotes</p>

                <p className="mt-1">
                  {new Date(report.createdAt).toLocaleDateString(
                    "en-NG"
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="rounded-2xl border bg-white p-10 text-center text-sm text-gray-500">
            No reports found.
          </div>
        )}
      </div>
    </div>
  );
}