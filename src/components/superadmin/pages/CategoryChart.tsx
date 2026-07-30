import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { store } from "../../../services/store";

const data = store.getAnalytics().categoryReports;

const COLORS = [
  "#0F4C3A",
  "#D4AF37",
  "#2563EB",
  "#F97316",
  "#DC2626",
];

export default function CategoryChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 h-[380px]">

      <h2 className="text-lg font-semibold text-[#0F4C3A] mb-6">
        Reports by Category
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}