"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { UserDashboard } from "@/components/user-dashboard";
import { AccountPage } from "@/components/account-page";
import { TradeInModal } from "@/components/trade-in-modal";
import { AdminLogin } from "@/components/admin-login";
import { AdminDashboard } from "@/components/admin-dashboard";
import { ApproverDashboard } from "@/components/approver-dashboard";
import {
  //authenticateUser,
  registerUser,
  updateUser,
  getUserCount,
  isUserAdmin,
  isUserApprover,
  setCurrentUser,
  User,
  login,
} from "@/lib/user-database";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTradeInModal, setShowTradeInModal] = useState(false);
  const [showAccountPage, setShowAccountPage] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isApprover, setIsApprover] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Check if we should show account page (e.g., returning from change password)
    if (typeof window !== "undefined") {
      const shouldShowAccountPage = localStorage.getItem("showAccountPage");
      if (shouldShowAccountPage === "true") {
        setShowAccountPage(true);
        localStorage.removeItem("showAccountPage"); // Clear the flag
      }
    }
  }, []);

  const handleLogin = async (
    email: string,
    password: string,
    name?: string
  ): Promise<boolean> => {
    try {
      if (name) {
        // Registration logic (unchanged)
        // ...existing registration code...
        // If registration logic is not implemented, return false for now
        return false;
      } else {
        // Login via API route
        const response = await fetch("/api/users/Login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          throw new Error("Invalid email or password");
        }
        const user = await response.json();
        setUser(user);
        setCurrentUser(user);

        // Check if user is admin and redirect accordingly
        if (isUserAdmin(user.id)) {
          setIsAdmin(true);
        } else if (isUserApprover(user.id)) {
          setIsApprover(true);
        }

        return true;
      }
    } catch (error: unknown) {
      // ...existing error handling...
      if (error instanceof Error) {
        console.error("Authentication error:", error.message);
        throw error;
      } else {
        console.error("Authentication error:", error);
        throw error;
      }
    }
    // try {
    //   if (name) {
    //     // This is a signup
    //     const userCountBefore = getUserCount();
    //     console.log("Users in database before registration:", userCountBefore);

    //     const newUser = registerUser({ name, email, password });

    //     const userCountAfter = getUserCount();
    //     console.log("Users in database after registration:", userCountAfter);
    //     console.log("Successfully registered new user:", {
    //       id: newUser.user?.id,
    //       name: newUser.user?.name,
    //       email: newUser.user?.email,
    //       userRole: newUser.user?.role,
    //       accountStatus: newUser.user?.isActive,
    //     });

    //     setUser(newUser.user ?? null);
    //     setCurrentUser(newUser.user ?? null);
    //     return true;
    //   } else {
    //     // This is a login
    //     const authenticatedUser = authenticateUser(email, password);
    //     if (authenticatedUser) {
    //       console.log("User logged in:", {
    //         id: authenticatedUser.id,
    //         name: authenticatedUser.name,
    //         email: authenticatedUser.email,
    //         role: authenticatedUser.role,
    //       });
    //       setUser(authenticatedUser); // setUser expects a User object
    //       setCurrentUser(authenticatedUser);

    //       // Check if user is admin and redirect accordingly
    //       if (isUserAdmin(authenticatedUser.id)) {
    //         setIsAdmin(true);
    //       } else if (isUserApprover(authenticatedUser.id)) {
    //         setIsApprover(true);
    //       }

    //       return true;
    //     } else {
    //       throw new Error("Invalid email or password");
    //     }
    //   }
    // } catch (error: unknown) {
    //   if (error instanceof Error) {
    //     console.error("Authentication error:", error.message);
    //     throw error;
    //   } else {
    //     console.error("Authentication error:", error);
    //     throw error;
    //   }
    // }
    return false;
  };

  const handleBackToLanding = () => {
    setShowAdminLogin(false);
  };

  const handleAdminLogin = (username: string, password: string) => {
    // Simple admin authentication - in real app, this would be more secure
    if (username === "admin" && password === "admin123") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      return true;
    }
    return false;
  };

  const handleAdminAccess = () => {
    if (user && isUserAdmin(user.id)) {
      setIsAdmin(true);
    } else {
      // Show admin login for non-admin users or when not logged in
      setShowAdminLogin(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setIsApprover(false);
    setShowAccountPage(false);
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUserId");
      localStorage.removeItem("showAccountPage");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    // If user is logged in as admin user, keep them logged in but exit admin mode
    if (user && isUserAdmin(user.id)) {
      // Stay logged in as user
    } else {
      // If accessed via admin login, log out completely
      setUser(null);
    }
  };

  const handleApproverLogout = () => {
    setIsApprover(false);
    // If user is logged in as approver user, keep them logged in but exit approver mode
    if (user && isUserApprover(user.id)) {
      // Stay logged in as user
    } else {
      // If accessed via approver login, log out completely
      setUser(null);
    }
  };

  const handleTradeIn = () => {
    setShowTradeInModal(true);
  };

  const handleViewAccount = () => {
    setShowAccountPage(true);
  };

  const handleBackToDashboard = () => {
    setShowAccountPage(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    if (user) {
      const updated = updateUser(user.id, updatedUser);
      if (updated) {
        setUser(updated);
      }
    }
  };

  const handleTradeInSubmit = (submission: any) => {
    // In real app, this would submit to API
    console.log("Trade-in submitted:", submission);
    // Update user credits (simulated)
    if (user) {
      const updatedUser = {
        ...user,
        creditBalance: user.creditBalance + submission.estimatedCredits,
        totalItemsTraded: user.totalItemsTraded + submission.quantity,
        totalCreditsEarned:
          user.totalCreditsEarned + submission.estimatedCredits,
      };
      const updated = updateUser(user.id, updatedUser);
      if (updated) {
        setUser(updated);
      }
    }
  };

  const handlePasswordReset = () => {};

  // Password reset page

  // Admin access
  if (showAdminLogin) {
    return (
      <AdminLogin
        onAdminLogin={handleAdminLogin}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  if (isApprover) {
    return <ApproverDashboard user={user!} onLogout={handleApproverLogout} />;
  }

  if (isAdmin) {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  if (user && showAccountPage) {
    // Ensure all required properties are present for AccountPage
    const completeUser = {
      ...user,
      contactNumber: user.contactNumber ?? "",
      creditBalance: user.creditBalance ?? 0,
      totalItemsTraded: user.totalItemsTraded ?? 0,
      memberSince: user.memberSince ?? "",
      accountStatus: user.accountStatus ?? "active",
    };
    return (
      <AccountPage
        user={completeUser}
        onBack={handleBackToDashboard}
        onUpdateUser={handleUpdateUser}
      />
    );
  }

  if (user) {
    return (
      <>
        <UserDashboard
          user={user}
          onLogout={handleLogout}
          onTradeIn={handleTradeIn}
          onViewAccount={handleViewAccount}
          onUserUpdate={setUser} // Add this line
        />
        <TradeInModal
          isOpen={showTradeInModal}
          onClose={() => setShowTradeInModal(false)}
          onSubmit={handleTradeInSubmit}
        />
      </>
    );
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-wide">
                REDEMPTION
              </h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="#"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Privacy
              </Link>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {user ? "My Account" : "Login"}
              </Button>
              <Button
                onClick={handleAdminAccess}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                size="sm"
              >
                Admin
              </Button>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </header>

          {/* Mobile Menu Overlay */}
          {showMobileMenu && (
            <div className="md:hidden fixed inset-0 z-50">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowMobileMenu(false)}
              />

              {/* Sliding Menu Panel */}
              <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/20 backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
                    aria-label="Close menu"
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Menu Content */}
                <nav className="flex flex-col p-6 space-y-6 backdrop-blur-sm h-full">
                  <Link
                    href="#"
                    className="flex items-center space-x-3 text-white hover:text-green-300 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span>Home</span>
                  </Link>

                  <Link
                    href="#"
                    className="flex items-center space-x-3 text-white hover:text-green-300 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span>Shop</span>
                  </Link>

                  <Link
                    href="/about"
                    className="flex items-center space-x-3 text-white hover:text-green-300 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>About</span>
                  </Link>

                  <Link
                    href="/privacy"
                    className="flex items-center space-x-3 text-white hover:text-green-300 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>Privacy</span>
                  </Link>

                  <div className="border-t border-white/30 pt-6">
                    <Button
                      onClick={() => {
                        setShowAuthModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="bg-green-500/70 hover:bg-green-600/70 text-white w-full mb-4 flex items-center justify-center space-x-2 backdrop-blur-sm border border-white/10"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>{user ? "My Account" : "Login"}</span>
                    </Button>

                    <Button
                      onClick={() => {
                        handleAdminAccess();
                        setShowMobileMenu(false);
                      }}
                      variant="outline"
                      className="text-red-500 border-white/30 hover:bg-white/10 hover:text-red-400 w-full flex items-center justify-center space-x-2 backdrop-blur-sm"
                      size="sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span>Admin</span>
                    </Button>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-8 p-4 bg-green-500/10 backdrop-blur-sm rounded-lg border border-green-300/20">
                    <h3 className="font-semibold text-green-200 mb-2">
                      Start Recycling Today!
                    </h3>
                    <p className="text-sm text-green-100">
                      Join thousands of users making a difference for our
                      environment.
                    </p>
                  </div>
                </nav>
              </div>
            </div>
          )}

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
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Our Mission
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At Redemption, we believe that every small action today creates
                a better tomorrow for our children. Our mission is to make
                recycling accessible, convenient, and rewarding for everyone
                while building a sustainable future for generations to come.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're not just a recycling service – we're environmental
                stewards committed to reducing waste, conserving resources, and
                educating communities about the power of sustainable living.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Zero Waste Goal
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Working towards a circular economy
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Community Impact
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Educating and empowering local communities
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Impact Stats */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                Environmental Impact
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                    2.5M
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Pounds Recycled
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                    15K
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Trees Saved
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                    850
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Tons CO₂ Reduced
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                    50K+
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Happy Customers
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">
                  This Month's Achievement
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Together, we've diverted 125 tons of waste from landfills!
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  78% of monthly goal achieved
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mt-16">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              Our Core Values
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Sustainability
                </h4>
                <p className="text-gray-600">
                  Every decision we make considers the long-term health of our
                  planet and future generations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Community
                </h4>
                <p className="text-gray-600">
                  We believe in the power of collective action and work together
                  to create positive change.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Innovation
                </h4>
                <p className="text-gray-600">
                  We continuously improve our processes and technology to make
                  recycling more efficient and accessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">REDEMPTION</h3>
              <p className="text-gray-300 mb-4">
                Leading the way in sustainable recycling solutions for a better
                tomorrow.
              </p>
              <p className="text-gray-400 text-sm">
                One step ahead for our children.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    Recycling
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    Trade-In
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    Rewards
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    Education
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Redemption. All rights reserved. |
              <Link
                href="/privacy"
                className="hover:text-green-400 transition-colors ml-1"
              >
                Privacy Policy
              </Link>{" "}
              |
              <Link
                href="/about"
                className="hover:text-green-400 transition-colors ml-1"
              >
                About Us
              </Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />

      {/* Trade-In Modal */}
      <TradeInModal
        isOpen={showTradeInModal}
        onClose={() => setShowTradeInModal(false)}
        onSubmit={handleTradeInSubmit}
      />
    </div>
  );
}
