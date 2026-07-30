import {
  Bell,
  Search,
  Clock3,
} from "lucide-react";

export default function Header() {
  const date = new Date();

  return (
    <div className="bg-white rounded-2xl shadow-sm border px-8 py-5 mb-6 flex justify-between items-center">

      {/* Left */}

      <div>

        <h2 className="text-2xl font-bold text-[#0F4C3A]">
          Super Admin Dashboard
        </h2>

        <p className="text-gray-500 text-sm">
          Welcome back, Anthony.
        </p>

      </div>

      {/* Center */}

      <div className="relative w-[350px]">

        <Search
          className="absolute left-4 top-3 text-gray-400"
          size={18}
        />

        <input
          placeholder="Search reports, users..."
          className="
            w-full
            pl-11
            pr-4
            py-3
            rounded-xl
            border
            focus:outline-none
            focus:ring-2
            focus:ring-[#0F4C3A]
          "
        />

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <div className="flex items-center gap-2 text-gray-600">

          <Clock3 size={18} />

          <span className="text-sm">
            {date.toLocaleTimeString()}
          </span>

        </div>

        <button className="relative">

          <Bell size={22} />

          <span className="
            absolute
            -top-1
            -right-1
            bg-red-500
            text-white
            rounded-full
            w-4
            h-4
            text-[10px]
            flex
            items-center
            justify-center
          ">
            3
          </span>

        </button>

        <div className="flex items-center gap-3">

          <img
            src="https://ui-avatars.com/api/?name=Anthony&background=0F4C3A&color=fff"
            className="w-11 h-11 rounded-full"
          />

          <div>

            <p className="font-semibold">
              Anthony
            </p>

            <p className="text-xs text-gray-500">
              Super Admin
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}