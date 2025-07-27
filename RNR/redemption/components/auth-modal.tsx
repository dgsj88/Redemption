"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (email: string, password: string, name?: string) => Promise<boolean>
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!isLoginMode) {
        // Signup validation
        if (password !== confirmPassword) {
          setError("Passwords do not match")
          return
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters")
          return
        }
        if (!name.trim()) {
          setError("Name is required")
          return
        }
      }

      const success = await onLogin(email, password, isLoginMode ? undefined : name)

      if (success) {
        onClose()
        // Reset form
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setName("")
        setError("")
      }
    } catch (err: any) {
      console.error("Authentication error:", err.message)

      // Show user-friendly error messages
      if (err.message.includes("suspended")) {
        setError("Your account has been suspended. Please contact support for assistance.")
      } else if (err.message.includes("pending")) {
        setError("Your account is pending approval. Please wait for administrator approval.")
      } else {
        setError(err.message || "Authentication failed. Please check your credentials.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setName("")
    setError("")
  }

  const switchMode = () => {
    setIsLoginMode(!isLoginMode)
    resetForm()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLoginMode ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLoginMode ? "Access your recycling credit account" : "Create an account to start earning credits"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLoginMode}
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {!isLoginMode && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLoginMode}
                  disabled={isLoading}
                />
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">{error}</div>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600" disabled={isLoading}>
                {isLoading ? "Please wait..." : isLoginMode ? "Login" : "Sign Up"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-green-600 hover:underline text-sm"
              disabled={isLoading}
            >
              {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>

          {isLoginMode && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">Demo Accounts:</p>
              <div className="text-xs text-blue-700 space-y-1">
                <div>john.smith@email.com / password123</div>
                <div>sarah.j@gmail.com / mypassword</div>
                <div>emily.davis@outlook.com / emily123</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
