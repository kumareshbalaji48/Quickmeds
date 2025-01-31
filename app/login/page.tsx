"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BackgroundVideo from "@/components/BackgroundVideo"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically validate the credentials against a backend
        // For this example, we'll just simulate a successful login
        localStorage.setItem("isLoggedIn", "true")
        router.push("/")
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <BackgroundVideo videoSrc="/login-background.mp4" />
            <Card className="w-full max-w-md bg-white bg-opacity-90">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Doctor Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="doctor@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Log In
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

