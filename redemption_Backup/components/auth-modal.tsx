"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser, registerUser } from "@/lib/api-client"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: any) => void
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      if (!isLoginMode) {
        // Enhanced signup validation
        if (password !== confirmPassword) {
          setError("Passwords do not match")
          return
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters")
          return
        }
        if (!name.trim() || name.trim().length < 2) {
          setError("Name must be at least 2 characters long")
          return
        }
        if (!email.includes("@")) {
          setError("Please enter a valid email address")
          return
        }

        const user = await registerUser(name.trim(), email.toLowerCase().trim(), password)
        setSuccess("Registration successful! Welcome to Redemption!")

        // Auto-login after successful registration
        setTimeout(() => {
          onLogin(user)
          onClose()
          resetForm()
        }, 1500)
      } else {
        const user = await loginUser(email.toLowerCase().trim(), password)
        onLogin(user)
        onClose()
        resetForm()
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setName("")
    setContactNumber("")
    setMarketingConsent(false)
    setError("")
    setSuccess("")
  }

  const switchMode = () => {
    setIsLoginMode(!isLoginMode)
    resetForm()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{isLoginMode ? "Login" : "Create Account"}</CardTitle>
          <CardDescription>
            {isLoginMode
              ? "Access your recycling credit account"
              : "Join Redemption and start earning credits for recycling"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required={!isLoginMode}
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLoginMode ? "Enter your password" : "Create a password (min 6 characters)"}
                required
                disabled={isLoading}
              />
            </div>

            {!isLoginMode && (
              <>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required={!isLoginMode}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="contactNumber">Phone Number (Optional)</Label>
                  <Input
                    id="contactNumber"
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="marketingConsent"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="rounded border-gray-300"
                    disabled={isLoading}
                  />
                  <Label htmlFor="marketingConsent" className="text-sm">
                    I agree to receive updates about recycling tips and rewards
                  </Label>
                </div>
              </>
            )}

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">{error}</div>
            )}

            {success && (
              <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">{success}</div>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600" disabled={isLoading}>
                {isLoading ? "Please wait..." : isLoginMode ? "Login" : "Create Account"}
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
              {isLoginMode ? "Don't have an account? Create one" : "Already have an account? Login"}
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
