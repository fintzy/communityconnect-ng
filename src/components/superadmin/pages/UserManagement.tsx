import { useMemo, useState } from "react";
import {
  Search,
  Users,
  Shield,
  UserRound,
  Crown,
} from "lucide-react";
import { store } from "../../../services/store";
import type { User } from "../../../services/store";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | User["role"]>("all");

  const users = store.getAllUsers();

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.lga.toLowerCase().includes(query) ||
        user.state.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter, users]);

  const getRoleBadge = (role: User["role"]) => {
    if (role === "super-admin") {
      return "bg-purple-100 text-purple-700";
    }

    if (role === "admin") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-green-100 text-green-700";
  };

  const getRoleIcon = (role: User["role"]) => {
    if (role === "super-admin") {
      return Crown;
    }

    if (role === "admin") {
      return Shield;
    }

    return UserRound;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F4C3A]">
          User Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and monitor all CommunityConnect NG accounts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5">
          <Users className="mb-3 h-6 w-6 text-[#0F4C3A]" />
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <Shield className="mb-3 h-6 w-6 text-blue-600" />
          <p className="text-2xl font-bold">
            {users.filter((user) => user.role === "admin").length}
          </p>
          <p className="text-sm text-gray-500">Administrators</p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <UserRound className="mb-3 h-6 w-6 text-green-600" />
          <p className="text-2xl font-bold">
            {users.filter((user) => user.role === "resident").length}
          </p>
          <p className="text-sm text-gray-500">Residents</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#0F4C3A]"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as "all" | User["role"])
            }
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0F4C3A]"
          >
            <option value="all">All Roles</option>
            <option value="resident">Residents</option>
            <option value="admin">Administrators</option>
            <option value="super-admin">Super Admins</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  User
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Role
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Location
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Created
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);

                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F4C3A]/10 font-semibold text-[#0F4C3A]">
                          {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        <RoleIcon className="h-3.5 w-3.5" />

                        {user.role === "super-admin"
                          ? "Super Admin"
                          : user.role === "admin"
                          ? "Admin"
                          : "Resident"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {user.ward}, {user.lga}, {user.state}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString(
                        "en-NG"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-10 text-center text-sm text-gray-500">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}