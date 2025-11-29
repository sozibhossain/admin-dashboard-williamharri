"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  // if (status === "unauthenticated") {
  //   return children
  // }

  return (
    <div className="flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        <main className="flex-1 mt-16 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
