import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { store } from "../../../services/store";

const data = store.getAnalytics().monthlyReports;

export default function AnalyticsChart() {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">

      <h2 className="text-lg font-semibold text-[#0F4C3A] mb-6">
        Reports Trend
      </h2>

      <div className="h-72">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={data}>

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="reports"
              stroke="#0F4C3A"
              fill="#D4AF37"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}