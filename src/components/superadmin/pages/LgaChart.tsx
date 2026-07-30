import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { store } from "../../../services/store";

export default function LgaChart() {
  const data = store.getAnalytics().lgaReports;

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 h-[380px]">

      <h2 className="text-lg font-semibold text-[#0F4C3A] mb-6">
        Reports by LGA
      </h2>

      <ResponsiveContainer width="100%" height="90%">

        <BarChart data={data} layout="vertical">

          <XAxis type="number" />

          <YAxis
            dataKey="name"
            type="category"
            width={120}
          />

          <Tooltip />

          <Bar
            dataKey="reports"
            fill="#0F4C3A"
            radius={[0, 8, 8, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}