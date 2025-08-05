"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, ExternalLink, AlertCircle } from "lucide-react"

interface GmailSetupGuideProps {
  onBack: () => void
}

export function GmailSetupGuide({ onBack }: GmailSetupGuideProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((n) => n !== stepNumber) : [...prev, stepNumber],
    )
  }

  const steps = [
    {
      id: 1,
      title: "Enable 2-Factor Authentication",
      description: "Gmail requires 2FA to generate app passwords",
      action: "Go to Google Account Security",
      url: "https://myaccount.google.com/security",
      details: [
        "Click on '2-Step Verification'",
        "Follow the setup process",
        "Verify with your phone number",
        "Complete the setup",
      ],
    },
    {
      id: 2,
      title: "Generate App Password",
      description: "Create a specific password for the Redemption Portal",
      action: "Go to App Passwords",
      url: "https://myaccount.google.com/apppasswords",
      details: [
        "Select 'Mail' from the app dropdown",
        "Select 'Other (Custom name)' from device dropdown",
        "Enter 'Redemption Portal' as the name",
        "Click 'Generate'",
        "Copy the 16-character password",
      ],
    },
    {
      id: 3,
      title: "Configure SMTP Settings",
      description: "Use these exact settings for Gmail",
      details: [
        "Host: smtp.gmail.com",
        "Port: 587",
        "SSL/TLS: Disabled (STARTTLS is used)",
        "Username: your-email@gmail.com",
        "Password: [16-character App Password]",
      ],
    },
    {
      id: 4,
      title: "Test Configuration",
      description: "Verify everything works correctly",
      details: [
        "Save your SMTP configuration",
        "Click 'Test Connection'",
        "Send a test email to yourself",
        "Check your inbox for the test email",
      ],
    },
  ]

  const completionRate = (completedSteps.length / steps.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gmail SMTP Setup Guide</h1>
            <p className="text-gray-600">Step-by-step instructions to configure Gmail for email notifications</p>
          </div>
          <Button onClick={onBack} variant="outline">
            ← Back to Configuration
          </Button>
        </div>

        {/* Progress Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Setup Progress
              <Badge variant={completionRate === 100 ? "default" : "secondary"}>
                {Math.round(completionRate)}% Complete
              </Badge>
            </CardTitle>
            <CardDescription>Track your progress through the Gmail SMTP setup process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {completedSteps.length} of {steps.length} steps completed
            </p>
          </CardContent>
        </Card>

        {/* Setup Steps */}
        <div className="space-y-6">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id)

            return (
              <Card
                key={step.id}
                className={`transition-all ${isCompleted ? "ring-2 ring-green-200 bg-green-50" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <button onClick={() => toggleStep(step.id)} className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    <span className="flex items-center gap-2">
                      Step {step.id}: {step.title}
                      {step.id <= 2 && (
                        <Badge variant="outline" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </span>
                  </CardTitle>
                  <CardDescription className="ml-9">{step.description}</CardDescription>
                </CardHeader>
                <CardContent className="ml-9">
                  {step.url && (
                    <div className="mb-4">
                      <Button asChild variant="outline" size="sm">
                        <a href={step.url} target="_blank" rel="noopener noreferrer">
                          {step.action}
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    {step.details.map((detail, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{detail}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Troubleshooting */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Troubleshooting
            </CardTitle>
            <CardDescription>Common issues and solutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Connection Failed</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Make sure 2FA is enabled on your Google account</li>
                <li>• Use the 16-character App Password, not your regular password</li>
                <li>• Verify the SMTP settings are exactly as specified</li>
                <li>• Check that port 587 is not blocked by your firewall</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Can't Generate App Password</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• 2-Step Verification must be enabled first</li>
                <li>• Make sure you're signed in to the correct Google account</li>
                <li>• Try using a different browser or incognito mode</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Emails Not Sending</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Check spam/junk folders</li>
                <li>• Verify the "From Email" matches your Gmail address</li>
                <li>• Make sure the email system is enabled in configuration</li>
                <li>• Test with a simple email address first</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        {completionRate === 100 && (
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">🎉 Setup Complete!</CardTitle>
              <CardDescription className="text-green-700">
                Your Gmail SMTP configuration is ready to use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-green-700">Next steps:</p>
                <ul className="text-sm text-green-600 space-y-1 ml-4">
                  <li>• Go back to SMTP Configuration</li>
                  <li>• Enter your Gmail credentials</li>
                  <li>• Test the connection</li>
                  <li>• Send a test email</li>
                  <li>• Enable the email system</li>
                </ul>
              </div>
              <Button onClick={onBack} className="mt-4 bg-green-600 hover:bg-green-700">
                Continue to Configuration
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
