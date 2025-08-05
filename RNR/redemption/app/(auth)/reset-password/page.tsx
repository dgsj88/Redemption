"use client"

import { Suspense } from "react"
import { PasswordResetPage } from "@/app/(auth)/_components/password-reset-page"

function PasswordResetContent() {
  return <PasswordResetPage />
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PasswordResetContent />
    </Suspense>
  )
}
