import { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Database,
  Save,
} from "lucide-react";

export default function SettingsPanel() {
  const [notifications, setNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [auditLogging, setAuditLogging] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem(
      "ccng_system_settings",
      JSON.stringify({
        notifications,
        maintenanceMode,
        auditLogging,
      })
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F4C3A]">
          System Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Configure basic CommunityConnect NG system preferences.
        </p>
      </div>

      {saved && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          Settings saved successfully.
        </div>
      )}

      <div className="rounded-2xl border bg-white">
        <div className="flex items-center gap-3 border-b p-5">
          <Settings className="h-5 w-5 text-[#0F4C3A]" />

          <div>
            <h2 className="font-semibold text-gray-900">
              General Settings
            </h2>

            <p className="text-sm text-gray-500">
              Application behaviour preferences.
            </p>
          </div>
        </div>

        <div className="divide-y">
          <SettingRow
            icon={Bell}
            title="System Notifications"
            description="Enable system notifications."
            enabled={notifications}
            onChange={setNotifications}
          />

          <SettingRow
            icon={Shield}
            title="Audit Logging"
            description="Record important administrative activities."
            enabled={auditLogging}
            onChange={setAuditLogging}
          />

          <SettingRow
            icon={Database}
            title="Maintenance Mode"
            description="Temporarily place the application into maintenance mode."
            enabled={maintenanceMode}
            onChange={setMaintenanceMode}
          />
        </div>

        <div className="flex justify-end border-t p-5">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C3A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a3a2c]"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
          <Icon className="h-5 w-5 text-[#0F4C3A]" />
        </div>

        <div>
          <p className="font-medium text-gray-900">{title}</p>

          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-[#0F4C3A]" : "bg-gray-300"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}