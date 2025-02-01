"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundVideo from "@/components/BackgroundVideo";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);

            router.push("/");
        } catch (error) {
            setError("Failed to log in. Please check your credentials.");
            console.error(error);
        }
    };

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
                        {error && <p className="text-red-500">{error}</p>}
                        <Button type="submit" className="w-full">
                            Log In
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link href="/register" className="text-blue-600 hover:underline">
                            Don't have an account? Register now
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}