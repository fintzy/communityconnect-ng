import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  iconClassName?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconClassName = "text-[#0F4C3A]",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#0F4C3A]">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-gray-400">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F4C3A]/5">
          <Icon className={`h-5 w-5 ${iconClassName}`} />
        </div>
      </div>
    </div>
  );
}