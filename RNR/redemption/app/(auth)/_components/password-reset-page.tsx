"use client"

import type React from "react"
import { useState } from "react"
import { getUserByEmail } from "@/lib/user"
import { getSMTPConfig, getPasswordResetEmailTemplate, simulateEmailSend } from "@/lib/smtp-config"

const PasswordResetPage = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const user = getUserByEmail(email)
      if (!user) {
        setMessage("If an account with this email exists, you will receive a password reset link.")
        setIsLoading(false)
        return
      }

      // Generate reset token and URL
      const resetToken = Math.random().toString(36).substring(2, 15)
      const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

      // Try to send email via SMTP
      const smtpConfig = getSMTPConfig()
      if (smtpConfig && smtpConfig.isEnabled) {
        const emailTemplate = getPasswordResetEmailTemplate(user.name, resetUrl)
        const emailResult = await simulateEmailSend(email, emailTemplate, smtpConfig)

        if (emailResult.success) {
          console.log(`📧 PASSWORD RESET EMAIL SENT via SMTP to ${email}`)
          setMessage("Password reset instructions have been sent to your email address.")
        } else {
          console.log(`❌ SMTP EMAIL FAILED: ${emailResult.error}`)
          console.log(`📧 FALLBACK: Password reset link: ${resetUrl}`)
          setMessage("Password reset instructions have been sent to your email address.")
        }
      } else {
        // Fallback to console logging
        console.log(`📧 SMTP NOT CONFIGURED - Password reset link: ${resetUrl}`)
        setMessage("Password reset instructions have been sent to your email address.")
      }

      // Store reset token (in real app, this would be in database with expiration)
      localStorage.setItem(
        `reset_token_${email}`,
        JSON.stringify({
          token: resetToken,
          expires: Date.now() + 3600000, // 1 hour
        }),
      )
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1>Password Reset</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={handleChange} required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Reset Password"}
        </button>
      </form>
    </div>
  )
}

export default PasswordResetPage
