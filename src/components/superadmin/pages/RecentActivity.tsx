import {
  ClipboardList,
  FileText,
} from "lucide-react";

import { store } from "../../../services/store";

export default function RecentActivity() {
  const reports = store.getRecentReports(5);

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">

      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="w-5 h-5 text-[#0F4C3A]" />
        <h2 className="text-lg font-semibold text-[#0F4C3A]">
          Recent Activity
        </h2>
      </div>

      <div className="space-y-5">

        {reports.map((report) => (

          <div
            key={report.id}
            className="flex items-start gap-4"
          >

            <div className="w-10 h-10 rounded-full bg-[#0F4C3A]/10 flex items-center justify-center">

              <FileText className="w-5 h-5 text-[#0F4C3A]" />

            </div>

            <div className="flex-1">

              <h3 className="font-medium text-gray-800">
                {report.title}
              </h3>

              <p className="text-sm text-gray-500">
                {report.category} • {report.lga}
              </p>

            </div>

            <span className="text-xs text-gray-400">
              {new Date(report.createdAt).toLocaleDateString()}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}