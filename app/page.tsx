"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Play } from "lucide-react"
import Header from "@/components/Header"

export default function HomePage() {
  const [showWelcome, setShowWelcome] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    setShowWelcome(true)
    setTimeout(() => setShowButton(true), 500)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Video */}
        <video autoPlay loop muted className="absolute w-full h-full object-cover">
          <source src="\background-video.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-900 bg-opacity-50"></div>

        {/* Animated Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto pt-20 px-6">
          <div className="text-center mb-12">
            <h1
              className={`text-5xl font-bold text-white mb-4 transition-all duration-1000 transform
                ${showWelcome ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              Welcome back, Doctor
            </h1>
            <p
              className={`text-2xl text-blue-200 transition-all duration-1000 delay-300 transform
                ${showWelcome ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              Your patients are waiting for you
            </p>
          </div>

          <div className="flex justify-center">
            <Link href="/token-management">
              <button
                className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-xl 
                  font-semibold shadow-lg hover:shadow-xl transition-all duration-300 
                  hover:scale-105 transform
                  ${showButton ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                <Play className="inline-block mr-2 w-6 h-6" />
                Start Token System
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

