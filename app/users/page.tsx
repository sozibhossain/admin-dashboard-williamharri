"use client"

import { UserTable } from "@/components/user-table"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage all users and their roles</p>
      </div>

      <UserTable />
    </div>
  )
}
