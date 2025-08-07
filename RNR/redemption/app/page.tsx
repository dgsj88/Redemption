"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Heart, Users, Zap, CheckCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      <div className="relative min-h-screen">
        {/* Hero Background - Responsive Images */}
        <div className="absolute inset-0 z-0">
          {/* Mobile Image */}
          <div className="block sm:hidden">
            <Image
              src="/hero-bg-mobile.jpeg"
              alt="plant"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          </div>

          {/* Tablet Image */}
          <div className="hidden sm:block lg:hidden">
            <Image
              src="/hero-bg-tablet.jpeg"
              alt=""
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          </div>

          {/* Desktop Image */}
          <div className="hidden lg:block">
            <Image
              src="/hero-bg-desktop.jpeg"
              alt=""
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 via-green-200/30 to-green-400/40" />
        </div>

        {/* Header */}
        <header className="relative z-10 px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between" aria-label="Main navigation">
            <div className="flex items-center">
              <Link
                href="/"
                className="focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-wide">REDEMPTION</h1>
                <span className="sr-only">Redemption - Home</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="flex space-x-1">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="px-3 py-2 text-gray-700 hover:text-green-600 focus:text-green-600 transition-colors font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/shop"
                      className="px-3 py-2 text-gray-700 hover:text-green-600 focus:text-green-600 transition-colors font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Shop
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/about"
                      className="px-3 py-2 text-gray-700 hover:text-green-600 focus:text-green-600 transition-colors font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      About
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/privacy"
                      className="px-3 py-2 text-gray-700 hover:text-green-600 focus:text-green-600 transition-colors font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Privacy
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/signin"
                      className="px-3 py-2 text-gray-700 hover:text-green-600 focus:text-green-600 transition-colors font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Sign In
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden bg-white/90 hover:bg-white"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col space-y-4 mt-8" aria-label="Mobile navigation">
                  <Link
                    href="/"
                    className="px-3 py-2 text-gray-700 hover:text-green-600 focus:text-green-600 transition-colors font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Home
                  </Link>
                  <Link
                    href="/shop"
                    className="px-3 py-2 text-gray-700 hover:text-green-600 focus:text-green-600 transition-colors font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Shop
                  </Link>
                  <Link
                    href="/about"
                    className="px-3 py-2 text-gray-700 hover:text-green-600 focus:text-green-600 transition-colors font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    About
                  </Link>
                  <Link
                    href="/privacy"
                    className="px-3 py-2 text-gray-700 hover:text-green-600 focus:text-green-600 transition-colors font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Privacy
                  </Link>
                  <Link
                    href="/signin"
                    className="px-3 py-2 text-gray-700 hover:text-green-600 focus:text-green-600 transition-colors font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Sign In
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </header>

        {/* Hero Main Content */}
        <main
          id="main-content"
          className="relative z-10 flex flex-col items-start justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl">
            <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium mb-3 sm:mb-4 tracking-wider uppercase">
              Best Online Recycling Service
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-800 leading-tight mb-4 sm:mb-6 lg:mb-8">
              One Step Ahead
              <br />
              <span className="text-gray-700">For Our Children</span>
            </h2>

            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 focus:bg-green-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold rounded-md shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Recycle Now
            </Button>
          </div>
        </main>
      </div>

      {/* About Section */}
      <section className="bg-white py-12 sm:py-16 lg:py-24" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Mission Content */}
            <div>
              <h3 id="about-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                Our Mission
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                At Redemption, we believe that every small action today creates a better tomorrow for our children. Our
                mission is to make recycling accessible, convenient, and rewarding for everyone while building a
                sustainable future for generations to come.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                {
                  "We're not just a recycling service – we're environmental stewards committed to reducing waste, conserving resources, and educating communities about the power of sustainable living."
                }
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-start space-x-3">
                  <div
                    className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    aria-label="Zero waste goal icon"
                  >
                    <CheckCircle className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Zero Waste Goal</h4>
                    <p className="text-gray-600 text-sm">Working towards a circular economy</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div
                    className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    aria-label="Community impact icon"
                  >
                    <CheckCircle className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Community Impact</h4>
                    <p className="text-gray-600 text-sm">Educating and empowering local communities</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Impact Stats */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
                  Environmental Impact
                </h3>

                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="text-center">
                    <div
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2"
                      aria-label="2.5 million pounds recycled"
                    >
                      2.5M
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Pounds Recycled</div>
                  </div>

                  <div className="text-center">
                    <div
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2"
                      aria-label="15 thousand trees saved"
                    >
                      15K
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Trees Saved</div>
                  </div>

                  <div className="text-center">
                    <div
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2"
                      aria-label="850 tons CO2 reduced"
                    >
                      850
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Tons CO₂ Reduced</div>
                  </div>

                  <div className="text-center">
                    <div
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2"
                      aria-label="Over 50 thousand happy customers"
                    >
                      50K+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Happy Customers</div>
                  </div>
                </div>

                <Card className="mt-6 sm:mt-8 bg-white border-0 shadow-sm">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{"This Month's Achievement"}</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {"Together, we've diverted 125 tons of waste from landfills!"}
                    </p>
                    <div
                      className="w-full bg-gray-200 rounded-full h-2"
                      role="progressbar"
                      aria-valuenow={78}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="78% of monthly goal achieved"
                    >
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">78% of monthly goal achieved</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Values Section */}
          <div className="mt-12 sm:mt-16">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
              Our Core Values
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    aria-label="Sustainability icon"
                  >
                    <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" aria-hidden="true" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Sustainability</h4>
                  <p className="text-sm sm:text-base text-gray-600">
                    Every decision we make considers the long-term health of our planet and future generations.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    aria-label="Community icon"
                  >
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" aria-hidden="true" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Community</h4>
                  <p className="text-sm sm:text-base text-gray-600">
                    We believe in the power of collective action and work together to create positive change.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    aria-label="Innovation icon"
                  >
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" aria-hidden="true" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Innovation</h4>
                  <p className="text-sm sm:text-base text-gray-600">
                    We continuously improve our processes and technology to make recycling more efficient and
                    accessible.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 sm:py-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">REDEMPTION</h3>
              <p className="text-gray-300 mb-4 text-sm sm:text-base">
                Leading the way in sustainable recycling solutions for a better tomorrow.
              </p>
              <p className="text-gray-400 text-sm">One step ahead for our children.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <nav aria-label="Footer navigation">
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/"
                      className="text-gray-300 hover:text-green-400 focus:text-green-400 transition-colors text-sm focus:outline-none focus:underline"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-gray-300 hover:text-green-400 focus:text-green-400 transition-colors text-sm focus:outline-none focus:underline"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-gray-300 hover:text-green-400 focus:text-green-400 transition-colors text-sm focus:outline-none focus:underline"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-gray-300 hover:text-green-400 focus:text-green-400 transition-colors text-sm focus:outline-none focus:underline"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <nav aria-label="Services navigation">
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/recycling"
                      className="text-gray-300 hover:text-green-400 focus:text-green-400 transition-colors text-sm focus:outline-none focus:underline"
                    >
                      Recycling
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/trade-in"
                      className="text-gray-300 hover:text-green-400 focus:text-green-400 transition-colors text-sm focus:outline-none focus:underline"
                    >
                      Trade-In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/rewards"
                      className="text-gray-300 hover:text-green-400 focus:text-green-400 transition-colors text-sm focus:outline-none focus:underline"
                    >
                      Rewards
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/education"
                      className="text-gray-300 hover:text-green-400 focus:text-green-400 transition-colors text-sm focus:outline-none focus:underline"
                    >
                      Education
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2025 Redemption. All rights reserved. |{" "}
              <Link
                href="/privacy"
                className="hover:text-green-400 focus:text-green-400 transition-colors focus:outline-none focus:underline ml-1"
              >
                Privacy Policy
              </Link>{" "}
              |{" "}
              <Link
                href="/about"
                className="hover:text-green-400 focus:text-green-400 transition-colors focus:outline-none focus:underline ml-1"
              >
                About Us
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
