"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { authAPI } from "@/lib/api"

export default function VerifyOTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authAPI.verifyOTP({ email, otp })
      toast.success("OTP verified successfully")
      router.push(`/auth/reset-password?email=${email}&otp=${otp}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter OTP</h1>
      <p className="text-gray-500 mb-8">
        We have share a code of your registered email address <br />
        {email}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Enter 6-digit OTP</label>
          <Input
            type="text"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.slice(0, 6))}
            required
            maxLength={6}
            className="h-12 text-center text-2xl tracking-widest"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </div>
  )
}
