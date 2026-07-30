import {
  Database,
  Cpu,
  HardDrive,
  Wifi,
} from "lucide-react";

import { store } from "../../../services/store";

export default function SystemHealth() {

  const health = store.getSystemHealth();

  const stats = [
    {
      icon: Database,
      title: "Database",
      value: health.database,
    },
    {
      icon: Wifi,
      title: "API",
      value: health.api,
    },
    {
      icon: HardDrive,
      title: "Storage",
      value: health.storage,
    },
    {
      icon: Cpu,
      title: "CPU",
      value: health.cpu,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">

      <h2 className="text-lg font-semibold text-[#0F4C3A] mb-6">
        System Health
      </h2>

      <div className="space-y-5">

        {stats.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="flex items-center justify-between"
            >

              <div className="flex items-center gap-3">

                <Icon className="w-5 h-5 text-[#0F4C3A]" />

                <span>{item.title}</span>

              </div>

              <span className="font-semibold">
                {item.value}
              </span>

            </div>

          );

        })}

      </div>

    </div>
  );
}