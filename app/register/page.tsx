"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundVideo from "@/components/BackgroundVideo";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import bcrypt from "bcryptjs";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Store credentials in Firestore
            await setDoc(doc(db, "users", "hospital", user.uid, "credentials"), {
                email: user.email,
                hashedPassword,
                uid: user.uid,
            });

            // Store initial empty details in Firestore
            await setDoc(doc(db, "users", "hospital", user.uid, "details"), {
                name: "",
                specialization: "",
                experience: "",
                about: "",
            });

            // Redirect to dashboard
            router.push("/");
        } catch (error) {
            setError("Failed to create an account. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <BackgroundVideo videoSrc="/register-background.mp4" />
            <Card className="w-full max-w-md bg-white bg-opacity-90">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Doctor Registration</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
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
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link href="/login" className="text-blue-600 hover:underline">
                            Already have an account? Log in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}