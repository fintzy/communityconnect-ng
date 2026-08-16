import {
  Activity,
  Server,
  ShieldCheck,
  Database,
} from "lucide-react";
import { store } from "../../../services/store";

export default function ApiOverview() {
  const health = store.getSystemHealth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F4C3A]">
          API Overview
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor application service availability and system health.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <HealthCard
          title="API"
          value={health.api}
          icon={Server}
        />

        <HealthCard
          title="Database"
          value={health.database}
          icon={Database}
        />

        <HealthCard
          title="System Uptime"
          value={health.uptime}
          icon={Activity}
        />

        <HealthCard
          title="Storage"
          value={health.storage}
          icon={Database}
        />

        <HealthCard
          title="Memory"
          value={health.memory}
          icon={Activity}
        />

        <HealthCard
          title="Security"
          value="Protected"
          icon={ShieldCheck}
        />
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900">
          Service Status
        </h2>

        <div className="mt-5 space-y-4">
          <StatusRow label="API Service" />
          <StatusRow label="Database Service" />
          <StatusRow label="Authentication Service" />
          <StatusRow label="Notification Service" />
        </div>
      </div>
    </div>
  );
}

function HealthCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: typeof Activity;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <p className="mt-2 text-xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
          <Icon className="h-5 w-5 text-green-600" />
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
      <span className="text-sm font-medium text-gray-700">
        {label}
      </span>

      <span className="inline-flex items-center gap-2 text-sm font-medium text-green-600">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Operational
      </span>
    </div>
  );
}