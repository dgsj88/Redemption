export interface SMTPConfig {
  id: string
  name: string
  provider: "gmail" | "outlook" | "yahoo" | "sendgrid" | "mailgun" | "custom"
  host: string
  port: number
  secure: boolean
  username: string
  password: string
  fromEmail: string
  fromName: string
  isEnabled: boolean
  enabled: boolean // Alias for backward compatibility
  isDefault: boolean
  createdDate: string
  lastUpdated: string
  lastTested?: string
  testResult?: "success" | "failed"
  testError?: string
  testEmailsSent: number
  successfulSends: number
  failedSends: number
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
  category: "password_reset" | "submission_approval" | "welcome" | "notification" | "custom"
  isActive: boolean
  createdDate: string
  lastUsed?: string
}

export interface EmailLog {
  id: string
  configId: string
  templateId?: string
  to: string
  from: string
  subject: string
  status: "pending" | "sent" | "failed" | "bounced"
  sentDate: string
  deliveredDate?: string
  errorMessage?: string
  retryCount: number
  variables?: Record<string, any>
}

// SMTP Provider Configurations
export const SMTP_PROVIDERS = {
  gmail: {
    name: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    helpUrl: "https://support.google.com/accounts/answer/185833",
    setupInstructions: [
      "Enable 2-Factor Authentication on your Google Account",
      "Generate an App Password for your application",
      "Use your Gmail address as username",
      "Use the App Password (not your regular password)",
    ],
  },
  outlook: {
    name: "Outlook/Hotmail",
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    helpUrl:
      "https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-8361e398-8af4-4e97-b147-6c6c4ac95353",
    setupInstructions: [
      "Enable 2-Factor Authentication on your Microsoft Account",
      "Generate an App Password for SMTP",
      "Use your Outlook email as username",
      "Use the App Password for authentication",
    ],
  },
  yahoo: {
    name: "Yahoo Mail",
    host: "smtp.mail.yahoo.com",
    port: 587,
    secure: false,
    helpUrl: "https://help.yahoo.com/kb/SLN4075.html",
    setupInstructions: [
      "Enable 2-Factor Authentication on your Yahoo Account",
      "Generate an App Password for SMTP",
      "Use your Yahoo email as username",
      "Use the App Password for authentication",
    ],
  },
  sendgrid: {
    name: "SendGrid",
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    helpUrl: "https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api",
    setupInstructions: [
      "Create a SendGrid account and verify your domain",
      "Generate an API Key with Mail Send permissions",
      "Use 'apikey' as the username",
      "Use your API Key as the password",
    ],
  },
  mailgun: {
    name: "Mailgun",
    host: "smtp.mailgun.org",
    port: 587,
    secure: false,
    helpUrl: "https://documentation.mailgun.com/en/latest/user_manual.html#sending-via-smtp",
    setupInstructions: [
      "Create a Mailgun account and add your domain",
      "Find your SMTP credentials in the Mailgun dashboard",
      "Use your Mailgun SMTP username",
      "Use your Mailgun SMTP password",
    ],
  },
  custom: {
    name: "Custom SMTP",
    host: "",
    port: 587,
    secure: false,
    helpUrl: "",
    setupInstructions: [
      "Contact your email provider for SMTP settings",
      "Enter the correct host and port information",
      "Configure authentication as required",
      "Test the connection before saving",
    ],
  },
}

// In-memory storage (in real app, this would be a database)
let currentSMTPConfig: SMTPConfig | null = null
const smtpConfigs: SMTPConfig[] = []
const emailTemplates: EmailTemplate[] = [
  {
    id: "template_password_reset",
    name: "Password Reset",
    subject: "Reset Your Password - Redemption Portal",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Password Reset Request</h2>
        <p>Hello {{userName}},</p>
        <p>We received a request to reset your password for your Redemption Portal account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{resetUrl}}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will expire in 24 hours for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The Redemption Portal Team
        </p>
      </div>
    `,
    textContent: `
Password Reset Request

Hello {{userName}},

We received a request to reset your password for your Redemption Portal account.

Reset your password by clicking this link: {{resetUrl}}

This link will expire in 24 hours for security reasons.

If you didn't request this password reset, please ignore this email.

Best regards,
The Redemption Portal Team
    `,
    variables: ["userName", "resetUrl"],
    category: "password_reset",
    isActive: true,
    createdDate: "2024-01-01",
  },
  {
    id: "template_submission_approval",
    name: "Submission Approved",
    subject: "Your Recycling Submission Has Been Approved! 🎉",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Submission Approved! 🎉</h2>
        <p>Hello {{userName}},</p>
        <p>Great news! Your recycling submission has been approved and credits have been added to your account.</p>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #16a34a; margin-top: 0;">Submission Details:</h3>
          <p><strong>Item Type:</strong> {{itemType}}</p>
          <p><strong>Description:</strong> {{description}}</p>
          <p><strong>Credits Awarded:</strong> {{creditsAwarded}}</p>
          <p><strong>Review Notes:</strong> {{reviewNotes}}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{dashboardUrl}}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Dashboard</a>
        </div>

        <p>You can now use your credits to purchase items from our marketplace!</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Keep up the great work in helping the environment!<br>
          The Redemption Portal Team
        </p>
      </div>
    `,
    textContent: `
Submission Approved! 🎉

Hello {{userName}},

Great news! Your recycling submission has been approved and credits have been added to your account.

Submission Details:
- Item Type: {{itemType}}
- Description: {{description}}
- Credits Awarded: {{creditsAwarded}}
- Review Notes: {{reviewNotes}}

You can now use your credits to purchase items from our marketplace!

View your dashboard: {{dashboardUrl}}

Keep up the great work in helping the environment!
The Redemption Portal Team
    `,
    variables: ["userName", "itemType", "description", "creditsAwarded", "reviewNotes", "dashboardUrl"],
    category: "submission_approval",
    isActive: true,
    createdDate: "2024-01-01",
  },
  {
    id: "template_welcome",
    name: "Welcome Email",
    subject: "Welcome to Redemption Portal! 🌱",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Welcome to Redemption Portal! 🌱</h2>
        <p>Hello {{userName}},</p>
        <p>Welcome to the Redemption Portal! We're excited to have you join our community of environmental champions.</p>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #16a34a; margin-top: 0;">Getting Started:</h3>
          <ul style="color: #374151;">
            <li>Submit photos of your recyclable items</li>
            <li>Earn credits when your submissions are approved</li>
            <li>Use credits to purchase eco-friendly products</li>
            <li>Track your environmental impact</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{loginUrl}}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Get Started</a>
        </div>

        <p>Together, we can make a positive impact on our environment, one recyclable item at a time!</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Thank you for joining our mission!<br>
          The Redemption Portal Team
        </p>
      </div>
    `,
    textContent: `
Welcome to Redemption Portal! 🌱

Hello {{userName}},

Welcome to the Redemption Portal! We're excited to have you join our community of environmental champions.

Getting Started:
- Submit photos of your recyclable items
- Earn credits when your submissions are approved
- Use credits to purchase eco-friendly products
- Track your environmental impact

Get started: {{loginUrl}}

Together, we can make a positive impact on our environment, one recyclable item at a time!

Thank you for joining our mission!
The Redemption Portal Team
    `,
    variables: ["userName", "loginUrl"],
    category: "welcome",
    isActive: true,
    createdDate: "2024-01-01",
  },
]

const emailLogs: EmailLog[] = []

// SMTP Configuration Functions
export function getSMTPConfig(): SMTPConfig | null {
  return currentSMTPConfig ? { ...currentSMTPConfig } : null
}

export function createSMTPConfig(
  configData: Omit<
    SMTPConfig,
    "id" | "createdDate" | "lastUpdated" | "testEmailsSent" | "successfulSends" | "failedSends"
  >,
): SMTPConfig {
  // If this is set as default, remove default from others
  if (configData.isDefault) {
    smtpConfigs.forEach((config) => {
      config.isDefault = false
    })
  }

  const now = new Date().toISOString().split("T")[0]
  const newConfig: SMTPConfig = {
    id: `smtp_${Date.now()}`,
    createdDate: now,
    lastUpdated: now,
    testEmailsSent: 0,
    successfulSends: 0,
    failedSends: 0,
    enabled: configData.isEnabled, // Keep both properties in sync
    ...configData,
  }

  smtpConfigs.push(newConfig)

  // Set as current config if it's the default or first config
  if (configData.isDefault || !currentSMTPConfig) {
    currentSMTPConfig = { ...newConfig }
  }

  console.log(`📧 SMTP CONFIG CREATED: ${newConfig.name} (${newConfig.provider})`)
  return newConfig
}

export function updateSMTPConfig(config: Omit<SMTPConfig, "id" | "createdDate" | "lastUpdated">): SMTPConfig {
  const now = new Date().toISOString().split("T")[0]

  if (currentSMTPConfig) {
    currentSMTPConfig = {
      ...currentSMTPConfig,
      ...config,
      enabled: config.isEnabled, // Keep both properties in sync
      lastUpdated: now,
    }
  } else {
    currentSMTPConfig = {
      id: `smtp_${Date.now()}`,
      createdDate: now,
      lastUpdated: now,
      enabled: config.isEnabled, // Keep both properties in sync
      testEmailsSent: 0,
      successfulSends: 0,
      failedSends: 0,
      ...config,
    }
  }

  console.log(`📧 SMTP CONFIG UPDATED: ${config.provider} - ${config.isEnabled ? "Enabled" : "Disabled"}`)
  return { ...currentSMTPConfig }
}

export function getAllSMTPConfigs(): SMTPConfig[] {
  return [...smtpConfigs]
}

export function getSMTPConfigById(id: string): SMTPConfig | null {
  const config = smtpConfigs.find((c) => c.id === id)
  return config ? { ...config } : null
}

export function getDefaultSMTPConfig(): SMTPConfig | null {
  const config = smtpConfigs.find((c) => c.isDefault && c.isEnabled)
  return config ? { ...config } : currentSMTPConfig
}

export function deleteSMTPConfig(id: string): boolean {
  const configIndex = smtpConfigs.findIndex((c) => c.id === id)
  if (configIndex === -1) return false

  const deletedConfig = smtpConfigs.splice(configIndex, 1)[0]

  // If this was the current config, clear it
  if (currentSMTPConfig && currentSMTPConfig.id === id) {
    currentSMTPConfig = null
  }

  console.log(`📧 SMTP CONFIG DELETED: ${deletedConfig.name}`)
  return true
}

export function testSMTPConnection(
  config?: SMTPConfig,
): Promise<{ success: boolean; message: string; responseTime?: number }> {
  const testConfig = config || currentSMTPConfig
  if (!testConfig) {
    return Promise.resolve({ success: false, message: "No SMTP configuration found" })
  }

  console.log(`🔧 TESTING SMTP CONNECTION: ${testConfig.provider} (${testConfig.host}:${testConfig.port})`)

  return new Promise((resolve) => {
    const startTime = Date.now()

    setTimeout(() => {
      const responseTime = Date.now() - startTime
      const hasRequiredFields = testConfig.host && testConfig.port && testConfig.username && testConfig.password

      if (hasRequiredFields) {
        if (currentSMTPConfig && currentSMTPConfig.id === testConfig.id) {
          currentSMTPConfig.lastTested = new Date().toISOString().split("T")[0]
          currentSMTPConfig.testResult = "success"
          currentSMTPConfig.testError = undefined
        }

        console.log(`✅ SMTP CONNECTION TEST: Success for ${testConfig.provider} (${responseTime}ms)`)
        resolve({
          success: true,
          message: `Successfully connected to ${testConfig.host}:${testConfig.port}`,
          responseTime,
        })
      } else {
        if (currentSMTPConfig && currentSMTPConfig.id === testConfig.id) {
          currentSMTPConfig.lastTested = new Date().toISOString().split("T")[0]
          currentSMTPConfig.testResult = "failed"
          currentSMTPConfig.testError = "Missing required configuration fields"
        }

        console.log(`❌ SMTP CONNECTION TEST: Failed for ${testConfig.provider}`)
        resolve({
          success: false,
          message: "Connection failed: Missing required configuration fields",
          responseTime,
        })
      }
    }, 2000) // 2 second delay to simulate real connection test
  })
}

export function sendTestEmail(
  config: SMTPConfig,
  testEmail: string,
): Promise<{ success: boolean; message: string; messageId?: string; error?: string }> {
  return new Promise((resolve) => {
    // Check if config is enabled
    if (!config.isEnabled && !config.enabled) {
      console.log(`❌ TEST EMAIL FAILED: SMTP config ${config.name} is disabled`)
      resolve({
        success: false,
        message: "SMTP configuration is disabled",
        error: "CONFIG_DISABLED",
      })
      return
    }

    console.log(`🧪 SENDING TEST EMAIL to ${testEmail} via ${config.provider}`)

    // Simulate email sending with realistic delay
    setTimeout(
      () => {
        // 95% success rate simulation
        const success = Math.random() > 0.05
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

        if (success) {
          // Update config stats
          if (currentSMTPConfig && currentSMTPConfig.id === config.id) {
            currentSMTPConfig.testEmailsSent++
            currentSMTPConfig.successfulSends++
            currentSMTPConfig.lastUpdated = new Date().toISOString().split("T")[0]
          }

          // Log the email
          const emailLog: EmailLog = {
            id: `log_${Date.now()}`,
            configId: config.id,
            to: testEmail,
            from: `${config.fromName} <${config.fromEmail}>`,
            subject: "Test Email from Redemption Portal SMTP Configuration",
            status: "sent",
            sentDate: new Date().toISOString(),
            deliveredDate: new Date().toISOString(),
            retryCount: 0,
          }
          emailLogs.push(emailLog)

          console.log(`✅ TEST EMAIL SENT: ${testEmail} via ${config.name} (${messageId})`)
          resolve({
            success: true,
            message: `Test email sent successfully to ${testEmail}`,
            messageId,
          })
        } else {
          // Update config stats
          if (currentSMTPConfig && currentSMTPConfig.id === config.id) {
            currentSMTPConfig.testEmailsSent++
            currentSMTPConfig.failedSends++
          }

          // Log the failed email
          const emailLog: EmailLog = {
            id: `log_${Date.now()}`,
            configId: config.id,
            to: testEmail,
            from: `${config.fromName} <${config.fromEmail}>`,
            subject: "Test Email from Redemption Portal SMTP Configuration",
            status: "failed",
            sentDate: new Date().toISOString(),
            errorMessage: "SMTP server temporarily unavailable",
            retryCount: 0,
          }
          emailLogs.push(emailLog)

          console.log(`❌ TEST EMAIL FAILED: ${testEmail} via ${config.name}`)
          resolve({
            success: false,
            message: "Failed to send test email. Please check your SMTP configuration.",
            error: "SMTP_ERROR",
          })
        }
      },
      Math.random() * 3000 + 2000,
    ) // 2-5 second delay
  })
}

// Email Template Functions
export function getAllEmailTemplates(): EmailTemplate[] {
  return [...emailTemplates]
}

export function getEmailTemplateById(id: string): EmailTemplate | null {
  const template = emailTemplates.find((t) => t.id === id)
  return template ? { ...template } : null
}

export function getEmailTemplateByName(name: string): EmailTemplate | null {
  const template = emailTemplates.find((t) => t.name.toLowerCase() === name.toLowerCase())
  return template ? { ...template } : null
}

export function getEmailTemplatesByCategory(category: EmailTemplate["category"]): EmailTemplate[] {
  return emailTemplates.filter((t) => t.category === category && t.isActive)
}

export function getSubmissionApprovalEmailTemplate(): EmailTemplate | null {
  return getEmailTemplateById("template_submission_approval")
}

export function getPasswordResetEmailTemplate(): EmailTemplate | null {
  return getEmailTemplateById("template_password_reset")
}

export function getWelcomeEmailTemplate(): EmailTemplate | null {
  return getEmailTemplateById("template_welcome")
}

export function createEmailTemplate(templateData: Omit<EmailTemplate, "id" | "createdDate">): EmailTemplate {
  const newTemplate: EmailTemplate = {
    id: `template_${Date.now()}`,
    createdDate: new Date().toISOString().split("T")[0],
    ...templateData,
  }

  emailTemplates.push(newTemplate)
  console.log(`📧 EMAIL TEMPLATE CREATED: ${newTemplate.name}`)
  return newTemplate
}

export function updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): EmailTemplate | null {
  const templateIndex = emailTemplates.findIndex((t) => t.id === id)
  if (templateIndex === -1) return null

  emailTemplates[templateIndex] = { ...emailTemplates[templateIndex], ...updates }
  console.log(`📧 EMAIL TEMPLATE UPDATED: ${emailTemplates[templateIndex].name}`)
  return emailTemplates[templateIndex]
}

export function deleteEmailTemplate(id: string): boolean {
  const templateIndex = emailTemplates.findIndex((t) => t.id === id)
  if (templateIndex === -1) return false

  const deletedTemplate = emailTemplates.splice(templateIndex, 1)[0]
  console.log(`📧 EMAIL TEMPLATE DELETED: ${deletedTemplate.name}`)
  return true
}

// Email Processing Functions
export function processEmailTemplate(
  template: EmailTemplate,
  variables: Record<string, any>,
): { subject: string; htmlContent: string; textContent: string } {
  let processedSubject = template.subject
  let processedHtml = template.htmlContent
  let processedText = template.textContent

  // Replace variables in all content
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    processedSubject = processedSubject.replace(new RegExp(placeholder, "g"), String(value))
    processedHtml = processedHtml.replace(new RegExp(placeholder, "g"), String(value))
    processedText = processedText.replace(new RegExp(placeholder, "g"), String(value))
  })

  return {
    subject: processedSubject,
    htmlContent: processedHtml,
    textContent: processedText,
  }
}

export function sendEmail(
  to: string,
  templateId: string,
  variables: Record<string, any>,
  configId?: string,
): Promise<{ success: boolean; message: string; emailId?: string }> {
  return new Promise((resolve) => {
    // Get SMTP config
    const config = configId ? getSMTPConfigById(configId) : currentSMTPConfig || getDefaultSMTPConfig()
    if (!config || (!config.isEnabled && !config.enabled)) {
      resolve({
        success: false,
        message: "SMTP not configured or disabled",
      })
      return
    }

    // Get email template
    const template = getEmailTemplateById(templateId)
    if (!template || !template.isActive) {
      resolve({
        success: false,
        message: "Email template not found or inactive",
      })
      return
    }

    // Process template
    const processedEmail = processEmailTemplate(template, variables)

    // Create email log entry
    const emailLog: EmailLog = {
      id: `log_${Date.now()}`,
      configId: config.id,
      templateId: template.id,
      to: to,
      from: `${config.fromName} <${config.fromEmail}>`,
      subject: processedEmail.subject,
      status: "pending",
      sentDate: new Date().toISOString(),
      retryCount: 0,
      variables,
    }
    emailLogs.push(emailLog)

    // Simulate email sending
    setTimeout(
      () => {
        // Simulate 95% success rate
        const success = Math.random() > 0.05

        if (success) {
          emailLog.status = "sent"
          emailLog.deliveredDate = new Date().toISOString()

          if (currentSMTPConfig && currentSMTPConfig.id === config.id) {
            currentSMTPConfig.successfulSends++
            currentSMTPConfig.lastUpdated = new Date().toISOString().split("T")[0]
          }

          template.lastUsed = new Date().toISOString().split("T")[0]

          console.log(`✅ EMAIL SENT: ${processedEmail.subject} to ${to}`)
          resolve({
            success: true,
            message: "Email sent successfully",
            emailId: emailLog.id,
          })
        } else {
          emailLog.status = "failed"
          emailLog.errorMessage = "SMTP server error"

          if (currentSMTPConfig && currentSMTPConfig.id === config.id) {
            currentSMTPConfig.failedSends++
          }

          console.log(`❌ EMAIL FAILED: ${processedEmail.subject} to ${to}`)
          resolve({
            success: false,
            message: "Failed to send email",
          })
        }
      },
      Math.random() * 2000 + 1000,
    ) // 1-3 second delay
  })
}

// Convenience functions for common email types
export function sendPasswordResetEmail(
  userEmail: string,
  userName: string,
  resetUrl: string,
): Promise<{ success: boolean; message: string }> {
  return sendEmail(userEmail, "template_password_reset", {
    userName,
    resetUrl,
  })
}

export function sendSubmissionApprovalEmail(
  userEmail: string,
  userName: string,
  itemType: string,
  description: string,
  creditsAwarded: number,
  reviewNotes: string,
  dashboardUrl: string,
): Promise<{ success: boolean; message: string }> {
  return sendEmail(userEmail, "template_submission_approval", {
    userName,
    itemType,
    description,
    creditsAwarded: creditsAwarded.toString(),
    reviewNotes,
    dashboardUrl,
  })
}

export function sendWelcomeEmail(
  userEmail: string,
  userName: string,
  loginUrl: string,
): Promise<{ success: boolean; message: string }> {
  return sendEmail(userEmail, "template_welcome", {
    userName,
    loginUrl,
  })
}

// Email Log Functions
export function getAllEmailLogs(): EmailLog[] {
  return [...emailLogs].sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime())
}

export function getEmailLogById(id: string): EmailLog | null {
  const log = emailLogs.find((l) => l.id === id)
  return log ? { ...log } : null
}

export function getEmailLogsByStatus(status: EmailLog["status"]): EmailLog[] {
  return emailLogs.filter((l) => l.status === status)
}

export function getEmailLogsByRecipient(email: string): EmailLog[] {
  return emailLogs.filter((l) => l.to.toLowerCase() === email.toLowerCase())
}

export function getEmailLogsByConfig(configId: string): EmailLog[] {
  return emailLogs.filter((l) => l.configId === configId)
}

// Email Statistics Functions
export function getEmailStats() {
  const totalEmails = emailLogs.length
  const sentEmails = emailLogs.filter((l) => l.status === "sent").length
  const failedEmails = emailLogs.filter((l) => l.status === "failed").length
  const pendingEmails = emailLogs.filter((l) => l.status === "pending").length
  const successRate = totalEmails > 0 ? (sentEmails / totalEmails) * 100 : 0

  return {
    totalEmails,
    sentEmails,
    failedEmails,
    pendingEmails,
    successRate: Math.round(successRate * 100) / 100,
  }
}

export function getSMTPStats() {
  const totalConfigs = smtpConfigs.length
  const enabledConfigs = smtpConfigs.filter((c) => c.isEnabled).length
  const totalSends = smtpConfigs.reduce((sum, c) => sum + c.successfulSends + c.failedSends, 0)
  const successfulSends = smtpConfigs.reduce((sum, c) => sum + c.successfulSends, 0)
  const failedSends = smtpConfigs.reduce((sum, c) => sum + c.failedSends, 0)

  return {
    totalConfigs,
    enabledConfigs,
    totalSends,
    successfulSends,
    failedSends,
    successRate: totalSends > 0 ? (successfulSends / totalSends) * 100 : 0,
  }
}

// Utility Functions
export function validateSMTPConfig(config: Partial<SMTPConfig>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.name?.trim()) errors.push("Configuration name is required")
  if (!config.host?.trim()) errors.push("SMTP host is required")
  if (!config.port || config.port < 1 || config.port > 65535) errors.push("Valid port number is required")
  if (!config.username?.trim()) errors.push("Username is required")
  if (!config.password?.trim()) errors.push("Password is required")
  if (!config.fromEmail?.trim()) errors.push("From email is required")
  if (!config.fromName?.trim()) errors.push("From name is required")

  // Validate email format
  if (config.fromEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.fromEmail)) {
    errors.push("From email must be a valid email address")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function getProviderConfig(provider: keyof typeof SMTP_PROVIDERS) {
  return SMTP_PROVIDERS[provider]
}

export function clearEmailLogs(): void {
  emailLogs.length = 0
  console.log(`🗑️ EMAIL LOGS CLEARED`)
}

export function resetSMTPConfig(): void {
  currentSMTPConfig = null
  smtpConfigs.length = 0
  console.log(`🔄 SMTP CONFIG RESET`)
}

// Simulate email sending for testing
export function simulateEmailSend(
  to: string,
  emailContent: { subject: string; html: string; text: string },
  config?: SMTPConfig,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const useConfig = config || currentSMTPConfig

  if (!useConfig || (!useConfig.isEnabled && !useConfig.enabled)) {
    console.log(`📧 EMAIL SIMULATION: SMTP not configured or disabled`)
    return Promise.resolve({ success: false, error: "SMTP not configured or disabled" })
  }

  console.log(`📧 SENDING EMAIL via ${useConfig.provider}:`)
  console.log(`   To: ${to}`)
  console.log(`   From: ${useConfig.fromName} <${useConfig.fromEmail}>`)
  console.log(`   Subject: ${emailContent.subject}`)

  // Log the email attempt
  const emailLog: EmailLog = {
    id: `email_${Date.now()}`,
    configId: useConfig.id,
    to: to,
    from: `${useConfig.fromName} <${useConfig.fromEmail}>`,
    subject: emailContent.subject,
    status: "pending",
    sentDate: new Date().toISOString(),
    retryCount: 0,
  }
  emailLogs.push(emailLog)

  // Simulate email sending with realistic delay and occasional failures
  return new Promise((resolve) => {
    setTimeout(() => {
      // 95% success rate simulation
      const success = Math.random() > 0.05
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

      // Update email log
      const logIndex = emailLogs.findIndex((log) => log.id === emailLog.id)
      if (logIndex !== -1) {
        emailLogs[logIndex].status = success ? "sent" : "failed"
        if (success) {
          emailLogs[logIndex].deliveredDate = new Date().toISOString()
        } else {
          emailLogs[logIndex].errorMessage = "Simulated delivery failure"
        }
      }

      if (success) {
        console.log(`✅ EMAIL SENT: Message ID ${messageId}`)
        resolve({ success: true, messageId })
      } else {
        console.log(`❌ EMAIL FAILED: Delivery error`)
        resolve({ success: false, error: "Simulated delivery failure" })
      }
    }, 1500) // 1.5 second delay to simulate real email sending
  })
}
