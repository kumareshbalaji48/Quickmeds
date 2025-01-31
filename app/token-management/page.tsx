"use client"

import { useState } from "react"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, CircleStopIcon as Stop, SkipForward } from "lucide-react"

export default function TokenManagementPage() {
  const [isActive, setIsActive] = useState(false)
  const [currentToken, setCurrentToken] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(false)
  }

  const handleStop = () => {
    setIsActive(false)
    setCurrentToken(0)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleNextToken = () => {
    if (isActive && !isPaused) {
      setCurrentToken(currentToken + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex flex-col">
      <Header />
      <main className="flex-grow p-8">
        <h1 className="text-6xl font-bold text-white mb-12 text-center animate-fade-in">
          Token Management
        </h1>
        
        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-8">
            <Button
              onClick={handleStart}
              disabled={isActive && !isPaused}
              className="w-full h-24 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white text-2xl font-bold flex items-center justify-center gap-4 transform hover:scale-105 transition-transform duration-300"
            >
              <Play size={24} /> Start
            </Button>
            <Button
              onClick={handlePause}
              disabled={!isActive}
              className="w-full h-24 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white text-2xl font-bold flex items-center justify-center gap-4 transform hover:scale-105 transition-transform duration-300"
            >
              {isPaused ? <Play size={24} /> : <Pause size={24} />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
          </div>

          <div className="space-y-8">
            <Button
              onClick={handleStop}
              disabled={!isActive}
              className="w-full h-24 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-2xl font-bold flex items-center justify-center gap-4 transform hover:scale-105 transition-transform duration-300"
            >
              <Stop size={24} /> Stop
            </Button>
            <Button 
              onClick={handleNextToken}
              disabled={!isActive || isPaused}
              className="w-full h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-2xl font-bold flex items-center justify-center gap-4 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center gap-2">
                <SkipForward size={24} />
                <span>Next Token - {currentToken}</span>
              </div>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
