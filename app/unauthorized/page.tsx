"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
        <p className="text-gray-600 text-lg">You do not have permission to access this page.</p>
        <Link href="/dashboard">
          <Button className="bg-blue-600 hover:bg-blue-700">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
