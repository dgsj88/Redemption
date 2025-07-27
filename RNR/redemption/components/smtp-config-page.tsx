"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Notification } from "@/components/notification"
import { getSMTPConfig, updateSMTPConfig, testSMTPConnection, sendTestEmail, type SMTPConfig } from "@/lib/smtp-config"

interface SMTPConfigPageProps {
  onBack: () => void
}

interface NotificationState {
  message: string
  type: "success" | "error" | "info"
  id: number
}

const SMTP_PROVIDERS = {
  gmail: {
    name: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    instructions: "Use your Gmail address and App Password (not regular password). Enable 2FA first.",
  },
  outlook: {
    name: "Outlook/Hotmail",
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    instructions: "Use your Outlook.com or Hotmail address and regular password.",
  },
  yahoo: {
    name: "Yahoo Mail",
    host: "smtp.mail.yahoo.com",
    port: 587,
    secure: false,
    instructions: "Use your Yahoo address and App Password. Enable 2FA first.",
  },
  sendgrid: {
    name: "SendGrid",
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    instructions: "Use 'apikey' as username and your SendGrid API key as password.",
  },
  mailgun: {
    name: "Mailgun",
    host: "smtp.mailgun.org",
    port: 587,
    secure: false,
    instructions: "Use your Mailgun SMTP credentials from your domain settings.",
  },
  custom: {
    name: "Custom SMTP",
    host: "",
    port: 587,
    secure: false,
    instructions: "Enter your custom SMTP server details.",
  },
}

export function SMTPConfigPage({ onBack }: SMTPConfigPageProps) {
  const [config, setConfig] = useState<SMTPConfig>({
    id: "",
    enabled: false,
    isEnabled: false,
    host: "",
    port: 587,
    secure: false,
    username: "",
    password: "",
    fromEmail: "",
    fromName: "Redemption Portal",
    createdDate: "",
    updatedDate: "",
  })

  const [selectedProvider, setSelectedProvider] = useState<keyof typeof SMTP_PROVIDERS>("gmail")
  const [showPassword, setShowPassword] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [notifications, setNotifications] = useState<NotificationState[]>([])

  useEffect(() => {
    // Load existing configuration
    const existingConfig = getSMTPConfig()
    if (existingConfig) {
      setConfig(existingConfig)
    }
  }, [])

  const addNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { message, type, id }])
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleProviderChange = (provider: keyof typeof SMTP_PROVIDERS) => {
    setSelectedProvider(provider)
    const providerConfig = SMTP_PROVIDERS[provider]
    setConfig((prev) => ({
      ...prev,
      host: providerConfig.host,
      port: providerConfig.port,
      secure: providerConfig.secure,
    }))
  }

  const handleSaveConfig = () => {
    try {
      const updatedConfig = updateSMTPConfig(config)
      setConfig(updatedConfig)
      addNotification("SMTP configuration saved successfully!", "success")
      console.log("📧 SMTP CONFIG SAVED:", {
        enabled: updatedConfig.enabled,
        host: updatedConfig.host,
        port: updatedConfig.port,
        secure: updatedConfig.secure,
        username: updatedConfig.username,
        fromEmail: updatedConfig.fromEmail,
        fromName: updatedConfig.fromName,
      })
    } catch (error) {
      addNotification("Failed to save SMTP configuration", "error")
      console.error("❌ SMTP CONFIG SAVE ERROR:", error)
    }
  }

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    setConnectionStatus("idle")

    try {
      console.log("🔍 TESTING SMTP CONNECTION:", {
        host: config.host,
        port: config.port,
        secure: config.secure,
        username: config.username,
      })

      const result = await testSMTPConnection(config)

      if (result.success) {
        setConnectionStatus("success")
        addNotification("SMTP connection successful!", "success")
        console.log("✅ SMTP CONNECTION SUCCESS")

        // Refresh config to get updated test status
        const updatedConfig = getSMTPConfig()
        if (updatedConfig) {
          setConfig(updatedConfig)
        }
      } else {
        setConnectionStatus("error")
        addNotification(`Connection failed: ${result.error}`, "error")
        console.error("❌ SMTP CONNECTION FAILED:", result.error)
      }
    } catch (error) {
      setConnectionStatus("error")
      addNotification("Connection test failed", "error")
      console.error("❌ SMTP CONNECTION ERROR:", error)
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      addNotification("Please enter a test email address", "error")
      return
    }

    setIsSendingTest(true)

    try {
      console.log("📧 SENDING TEST EMAIL TO:", testEmail)

      const result = await sendTestEmail(config, testEmail)

      if (result.success) {
        addNotification(`Test email sent successfully to ${testEmail}!`, "success")
        console.log("✅ TEST EMAIL SENT SUCCESSFULLY")
      } else {
        addNotification(`Failed to send test email: ${result.error}`, "error")
        console.error("❌ TEST EMAIL FAILED:", result.error)
      }
    } catch (error) {
      addNotification("Failed to send test email", "error")
      console.error("❌ TEST EMAIL ERROR:", error)
    } finally {
      setIsSendingTest(false)
    }
  }

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Not Tested</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Notifications */}
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={5000}
            onClose={() => removeNotification(notification.id)}
          />
        ))}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Email Configuration</h1>
            <p className="text-gray-600">Configure SMTP settings for email notifications</p>
          </div>
          <Button onClick={onBack} variant="outline">
            ← Back to Dashboard
          </Button>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Email System Status
              {getConnectionStatusBadge()}
            </CardTitle>
            <CardDescription>Current email system configuration and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">System Status</Label>
                <p className="text-lg font-semibold">
                  {config.enabled || config.isEnabled ? (
                    <span className="text-green-600">Enabled</span>
                  ) : (
                    <span className="text-red-600">Disabled</span>
                  )}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">SMTP Server</Label>
                <p className="text-lg font-semibold">{config.host || "Not configured"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">From Email</Label>
                <p className="text-lg font-semibold">{config.fromEmail || "Not configured"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>SMTP Configuration</CardTitle>
            <CardDescription>Configure your email server settings for sending notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable/Disable Switch */}
            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={config.enabled || config.isEnabled}
                onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, enabled: checked, isEnabled: checked }))}
              />
              <Label htmlFor="enabled" className="text-sm font-medium">
                Enable Email System
              </Label>
            </div>

            {/* Provider Selection */}
            <div className="space-y-2">
              <Label htmlFor="provider">Email Provider</Label>
              <Select value={selectedProvider} onValueChange={handleProviderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select email provider" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SMTP_PROVIDERS).map(([key, provider]) => (
                    <SelectItem key={key} value={key}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600">{SMTP_PROVIDERS[selectedProvider].instructions}</p>
            </div>

            {/* SMTP Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">SMTP Host</Label>
                <Input
                  id="host"
                  value={config.host}
                  onChange={(e) => setConfig((prev) => ({ ...prev, host: e.target.value }))}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  type="number"
                  value={config.port}
                  onChange={(e) => setConfig((prev) => ({ ...prev, port: Number.parseInt(e.target.value) || 587 }))}
                  placeholder="587"
                />
              </div>
            </div>

            {/* Security */}
            <div className="flex items-center space-x-2">
              <Switch
                id="secure"
                checked={config.secure}
                onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, secure: checked }))}
              />
              <Label htmlFor="secure" className="text-sm font-medium">
                Use SSL/TLS (Port 465)
              </Label>
            </div>

            {/* Authentication */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username/Email</Label>
                <Input
                  id="username"
                  value={config.username}
                  onChange={(e) => setConfig((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="your-email@gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={config.password}
                    onChange={(e) => setConfig((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="App Password or regular password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* From Email Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  value={config.fromEmail}
                  onChange={(e) => setConfig((prev) => ({ ...prev, fromEmail: e.target.value }))}
                  placeholder="noreply@yourcompany.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  value={config.fromName}
                  onChange={(e) => setConfig((prev) => ({ ...prev, fromName: e.target.value }))}
                  placeholder="Redemption Portal"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={handleSaveConfig} className="bg-blue-600 hover:bg-blue-700">
                Save Configuration
              </Button>
              <Button
                onClick={handleTestConnection}
                disabled={isTestingConnection || !config.host || !config.username}
                variant="outline"
              >
                {isTestingConnection ? "Testing..." : "Test Connection"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Email */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Email</CardTitle>
            <CardDescription>Send a test email to verify your configuration works</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testEmail">Test Email Address</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <Button
              onClick={handleSendTestEmail}
              disabled={isSendingTest || !testEmail || !config.host}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSendingTest ? "Sending..." : "Send Test Email"}
            </Button>
          </CardContent>
        </Card>

        {/* Gmail Setup Guide */}
        {selectedProvider === "gmail" && (
          <Card>
            <CardHeader>
              <CardTitle>Gmail Setup Guide</CardTitle>
              <CardDescription>Follow these steps to configure Gmail SMTP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Enable 2-Factor Authentication</p>
                    <p className="text-sm text-gray-600">
                      Go to{" "}
                      <a
                        href="https://myaccount.google.com/security"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Google Account Security
                      </a>{" "}
                      and enable 2-Step Verification
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Generate App Password</p>
                    <p className="text-sm text-gray-600">
                      Go to{" "}
                      <a
                        href="https://myaccount.google.com/apppasswords"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        App Passwords
                      </a>{" "}
                      and create a new app password for "Mail"
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Use App Password</p>
                    <p className="text-sm text-gray-600">
                      Use the 16-character app password (not your regular Gmail password) in the password field above
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
