"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import { UserDashboard } from "@/components/user-dashboard"
import { AccountPage } from "@/components/account-page"
import { TradeInModal } from "@/components/trade-in-modal"
import { AdminLogin } from "@/components/admin-login"
import { AdminDashboard } from "@/components/admin-dashboard"
import { updateUserProfile, submitTradeIn, type User } from "@/lib/api-client"
import { useState } from "react"

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showTradeInModal, setShowTradeInModal] = useState(false)
  const [showAccountPage, setShowAccountPage] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const handleLogin = (authenticatedUser: User) => {
    setUser(authenticatedUser)
  }

  const handleAdminLogin = (username: string, password: string) => {
    // Simple admin authentication - in real app, this would be more secure
    if (username === "admin" && password === "admin123") {
      setIsAdmin(true)
      setShowAdminLogin(false)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setUser(null)
    setShowAccountPage(false)
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
  }

  const handleTradeIn = () => {
    setShowTradeInModal(true)
  }

  const handleViewAccount = () => {
    setShowAccountPage(true)
  }

  const handleBackToDashboard = () => {
    setShowAccountPage(false)
  }

  const handleUpdateUser = async (updatedUser: User) => {
    if (user) {
      try {
        const updated = await updateUserProfile(user.id, updatedUser)
        setUser(updated)
      } catch (error) {
        console.error("Failed to update user:", error)
      }
    }
  }

  const handleTradeInSubmit = async (submission: any) => {
    if (user) {
      try {
        const updatedUser = await submitTradeIn(
          user.id,
          submission.type,
          submission.quantity,
          submission.estimatedCredits,
          submission.description,
        )
        setUser(updatedUser)
      } catch (error) {
        console.error("Failed to submit trade-in:", error)
      }
    }
  }

  // Admin access
  if (showAdminLogin) {
    return <AdminLogin onAdminLogin={handleAdminLogin} />
  }

  if (isAdmin) {
    return <AdminDashboard onLogout={handleAdminLogout} />
  }

  if (user && showAccountPage) {
    return <AccountPage user={user} onBack={handleBackToDashboard} onUpdateUser={handleUpdateUser} />
  }

  if (user) {
    return (
      <>
        <UserDashboard
          user={user}
          onLogout={handleLogout}
          onTradeIn={handleTradeIn}
          onViewAccount={handleViewAccount}
        />
        <TradeInModal
          isOpen={showTradeInModal}
          onClose={() => setShowTradeInModal(false)}
          onSubmit={handleTradeInSubmit}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <div className="relative min-h-screen">
        {/* Hero Background - Limited to hero section only */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpeg"
            alt="Young plant seedling growing from soil with beautiful morning light representing new growth and environmental hope"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 via-green-200/30 to-green-400/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 md:px-12">
            <div className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-wide">REDEMPTION</h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Shop
              </Link>
              <Link href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                About
              </Link>
              <Button onClick={() => setShowAuthModal(true)} className="bg-green-500 hover:bg-green-600 text-white">
                {user ? "My Account" : "Login"}
              </Button>
              <Button
                onClick={() => setShowAdminLogin(true)}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                size="sm"
              >
                Admin
              </Button>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </header>

          {/* Hero Main Content */}
          <main className="flex flex-col items-start justify-center min-h-[80vh] px-6 md:px-12">
            <div className="max-w-2xl">
              <p className="text-gray-600 text-sm md:text-base font-medium mb-4 tracking-wider uppercase">
                Best Online Recycling Service
              </p>

              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight mb-8">
                One Step Ahead
                <br />
                <span className="text-gray-700">For Our Children</span>
              </h2>

              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-semibold rounded-md shadow-lg transition-all duration-200 hover:shadow-xl"
                onClick={() => setShowAuthModal(true)}
              >
                Recycle Now
              </Button>
            </div>
          </main>
        </div>
      </div>

      {/* About Section - Clean white background */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Mission Content */}
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Mission</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At Redemption, we believe that every small action today creates a better tomorrow for our children. Our
                mission is to make recycling accessible, convenient, and rewarding for everyone while building a
                sustainable future for generations to come.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're not just a recycling service – we're environmental stewards committed to reducing waste,
                conserving resources, and educating communities about the power of sustainable living.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Zero Waste Goal</h4>
                    <p className="text-gray-600 text-sm">Working towards a circular economy</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Community Impact</h4>
                    <p className="text-gray-600 text-sm">Educating and empowering local communities</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Impact Stats */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Environmental Impact</h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">2.5M</div>
                  <div className="text-sm text-gray-600 font-medium">Pounds Recycled</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">15K</div>
                  <div className="text-sm text-gray-600 font-medium">Trees Saved</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">850</div>
                  <div className="text-sm text-gray-600 font-medium">Tons CO₂ Reduced</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50K+</div>
                  <div className="text-sm text-gray-600 font-medium">Happy Customers</div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">This Month's Achievement</h4>
                <p className="text-sm text-gray-600 mb-3">Together, we've diverted 125 tons of waste from landfills!</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">78% of monthly goal achieved</p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mt-16">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Our Core Values</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Sustainability</h4>
                <p className="text-gray-600">
                  Every decision we make considers the long-term health of our planet and future generations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Community</h4>
                <p className="text-gray-600">
                  We believe in the power of collective action and work together to create positive change.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h4>
                <p className="text-gray-600">
                  We continuously improve our processes and technology to make recycling more efficient and accessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />

      {/* Trade-In Modal */}
      <TradeInModal
        isOpen={showTradeInModal}
        onClose={() => setShowTradeInModal(false)}
        onSubmit={handleTradeInSubmit}
      />
    </div>
  )
}
