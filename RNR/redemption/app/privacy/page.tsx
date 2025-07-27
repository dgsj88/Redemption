import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-green-600 transition-colors">
            REDEMPTION
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-green-600 font-medium">
              Privacy
            </Link>
          </nav>
          <Link href="/">
            <Button className="bg-green-500 hover:bg-green-600">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-blue-100">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
          <p className="text-blue-200 mt-4">Last updated: January 2024</p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Introduction */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-2xl text-blue-800">Introduction</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                At Redemption, we are committed to protecting your privacy and ensuring the security of your personal
                information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                when you use our recycling platform and services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this
                policy. We will not use or share your information with anyone except as described in this Privacy
                Policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-2xl text-green-800">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Account credentials (username, password)</li>
                    <li>Profile information and preferences</li>
                    <li>Payment and billing information</li>
                    <li>Communication history with our support team</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Recycling Activity Data</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Types and quantities of materials recycled</li>
                    <li>Trade-in submissions and transaction history</li>
                    <li>Credit balance and reward redemptions</li>
                    <li>Environmental impact metrics</li>
                    <li>Location data for collection services (with your consent)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data and analytics</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Log files and error reports</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-2xl text-purple-800">How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Provision</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Process recycling transactions</li>
                    <li>Manage your account and credits</li>
                    <li>Provide customer support</li>
                    <li>Send service-related notifications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Improvement & Analytics</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Analyze usage patterns</li>
                    <li>Improve our services</li>
                    <li>Develop new features</li>
                    <li>Generate environmental impact reports</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Communication</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Send important updates</li>
                    <li>Marketing communications (with consent)</li>
                    <li>Educational content</li>
                    <li>Community engagement</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Legal & Security</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Comply with legal obligations</li>
                    <li>Prevent fraud and abuse</li>
                    <li>Protect user safety</li>
                    <li>Enforce our terms of service</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-2xl text-orange-800">Information Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your
                consent, except in the following circumstances:
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Service Providers</h3>
                  <p className="text-gray-600 text-sm">
                    We may share information with trusted third-party service providers who assist us in operating our
                    platform, processing payments, or providing customer support.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Legal Requirements</h3>
                  <p className="text-gray-600 text-sm">
                    We may disclose information when required by law, court order, or government regulation, or to
                    protect our rights and the safety of our users.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Business Transfers</h3>
                  <p className="text-gray-600 text-sm">
                    In the event of a merger, acquisition, or sale of assets, user information may be transferred as
                    part of the business transaction.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Aggregated Data</h3>
                  <p className="text-gray-600 text-sm">
                    We may share aggregated, non-personally identifiable information for research, marketing, or
                    environmental impact reporting purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-2xl text-red-800">Data Security</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Technical Safeguards</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Encrypted data storage</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and authentication</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Organizational Measures</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Employee training on data protection</li>
                    <li>Limited access on a need-to-know basis</li>
                    <li>Regular privacy impact assessments</li>
                    <li>Incident response procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader className="bg-teal-50">
              <CardTitle className="text-2xl text-teal-800">Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                You have certain rights regarding your personal information. Depending on your location, these may
                include:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Access & Portability</h3>
                  <p className="text-gray-600 text-sm">
                    Request access to your personal data and receive a copy in a portable format.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Correction</h3>
                  <p className="text-gray-600 text-sm">
                    Request correction of inaccurate or incomplete personal information.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Deletion</h3>
                  <p className="text-gray-600 text-sm">
                    Request deletion of your personal information, subject to legal requirements.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Opt-out</h3>
                  <p className="text-gray-600 text-sm">
                    Opt-out of marketing communications and certain data processing activities.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">How to Exercise Your Rights</h3>
                <p className="text-blue-700 text-sm">
                  To exercise any of these rights, please contact us at privacy@redemption.com or through your account
                  settings. We will respond to your request within 30 days.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader className="bg-yellow-50">
              <CardTitle className="text-2xl text-yellow-800">Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our platform. You can
                control cookie settings through your browser preferences.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Essential Cookies</h3>
                  <p className="text-gray-600 text-sm">Required for basic platform functionality and security.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Analytics Cookies</h3>
                  <p className="text-gray-600 text-sm">Help us understand how users interact with our platform.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Marketing Cookies</h3>
                  <p className="text-gray-600 text-sm">
                    Used to deliver relevant advertisements and measure campaign effectiveness.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-2xl text-gray-800">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">General Inquiries</h3>
                  <p className="text-gray-600 text-sm">Email: privacy@redemption.com</p>
                  <p className="text-gray-600 text-sm">Phone: 1-800-RECYCLE</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Data Protection Officer</h3>
                  <p className="text-gray-600 text-sm">Email: dpo@redemption.com</p>
                  <p className="text-gray-600 text-sm">Response time: Within 48 hours</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Mailing Address</h3>
                <p className="text-green-700 text-sm">
                  Redemption Privacy Team
                  <br />
                  123 Green Street
                  <br />
                  Sustainability City, SC 12345
                  <br />
                  United States
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Updates to Policy */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="text-2xl text-indigo-800">Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal
                requirements. We will notify you of any material changes by:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Posting the updated policy on our website</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a prominent notice on our platform</li>
                <li>Requiring acknowledgment for significant changes</li>
              </ul>

              <p className="text-gray-700 leading-relaxed">
                Your continued use of our services after any changes indicates your acceptance of the updated Privacy
                Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Recycling?</h2>
          <p className="text-blue-100 mb-6">
            Join thousands of users making a positive environmental impact while earning rewards.
          </p>
          <Link href="/">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 Redemption. All rights reserved. |
            <Link href="/about" className="hover:text-green-400 transition-colors ml-1">
              About Us
            </Link>{" "}
            |
            <Link href="/" className="hover:text-green-400 transition-colors ml-1">
              Home
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
