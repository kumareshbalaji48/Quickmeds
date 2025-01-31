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
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Header />
      <main className="flex-grow p-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-8">Token Management</h1>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="h-64 flex items-center justify-center">
              <CardContent className="w-full h-full flex flex-col items-center justify-center">
                <Button
                  onClick={handleStart}
                  disabled={isActive && !isPaused}
                  className="w-48 h-48 rounded-2xl bg-green-600 hover:bg-green-700 text-white text-2xl font-bold flex flex-col items-center justify-center gap-4"
                >
                  <Play size={48} />
                  Start
                </Button>
              </CardContent>
            </Card>
            <Card className="h-64 flex items-center justify-center">
              <CardContent className="w-full h-full flex flex-col items-center justify-center">
                <Button
                  onClick={handleStop}
                  disabled={!isActive}
                  className="w-48 h-48 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-2xl font-bold flex flex-col items-center justify-center gap-4"
                >
                  <Stop size={48} />
                  Stop
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card className="h-64 flex items-center justify-center">
              <CardContent className="w-full h-full flex flex-col items-center justify-center">
                <Button
                  onClick={handlePause}
                  disabled={!isActive}
                  className="w-48 h-48 rounded-2xl bg-yellow-600 hover:bg-yellow-700 text-white text-2xl font-bold flex flex-col items-center justify-center gap-4"
                >
                  {isPaused ? <Play size={48} /> : <Pause size={48} />}
                  {isPaused ? "Resume" : "Pause"}
                </Button>
              </CardContent>
            </Card>
            <Card className="h-64 flex items-center justify-center">
              <CardContent className="w-full h-full flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-blue-800 mb-4">{currentToken}</div>
                <Button
                  onClick={handleNextToken}
                  disabled={!isActive || isPaused}
                  className="w-48 h-16 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold flex items-center justify-center gap-2"
                >
                  <SkipForward size={24} />
                  Next Token
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

