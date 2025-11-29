"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Briefcase } from "lucide-react"

// Sample data - replace with actual API calls
const jobPostedData = [
  { name: "Mon", value: 100 },
  { name: "Tue", value: 75 },
  { name: "Wed", value: 78 },
  { name: "Thurs", value: 25 },
  { name: "Fri", value: 30 },
  { name: "Sat", value: 55 },
  { name: "Sun", value: 40 },
]

const userGrowthData = [
  { name: "Day 1", value1: 700, value2: 350, value3: 0 },
  { name: "Day 2", value1: 690, value2: 360, value3: 0 },
  { name: "Day 3", value1: 685, value2: 365, value3: 0 },
  { name: "Day 4", value1: 680, value2: 370, value3: 0 },
  { name: "Day 5", value1: 675, value2: 375, value3: 0 },
  { name: "Day 6", value1: 670, value2: 380, value3: 0 },
  { name: "Day 7", value1: 665, value2: 385, value3: 0 },
]

export default function DashboardPage() {
  const isLoading = false

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600">
          <option>This month</option>
          <option>Last month</option>
          <option>This year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Total Staff</p>
                <p className="text-4xl font-bold text-gray-900">1203</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Manager</p>
                <p className="text-4xl font-bold text-gray-900">350</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Job Posted</p>
                <p className="text-4xl font-bold text-gray-900">742</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Posted</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jobPostedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1f2937" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <select className="text-sm text-gray-600 border border-gray-200 rounded px-2 py-1">
              <option>Last 15 days</option>
              <option>Last 30 days</option>
              <option>Last year</option>
            </select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value1" stroke="#ef4444" />
                <Line type="monotone" dataKey="value2" stroke="#3b82f6" />
                <Line type="monotone" dataKey="value3" stroke="#000000" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
