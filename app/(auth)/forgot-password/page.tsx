"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { authAPI } from "@/lib/api"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authAPI.forgetPassword(email)
      toast.success("OTP sent to your email")
      router.push(`/auth/verify-otp?email=${email}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
      <p className="text-gray-500 mb-8">
        Enter your registered email address. we'll send you a code to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
          <Input
            type="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
        >
          {isLoading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-700">
          Back to Login
        </Link>
      </div>
    </div>
  )
}
