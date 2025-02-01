"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Play } from "lucide-react";
import Header from "@/components/Header";
import BackgroundVideo from "@/components/BackgroundVideo";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function HomePage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        setShowWelcome(true);
        setTimeout(() => setShowButton(true), 500);
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchDoctorName = async () => {
      if (user) {
        // Fetch doctor details from the updated Firestore structure
        const docRef = doc(db, "users", "hospital", user.uid, "details");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDoctorName(docSnap.data().name || "");
        }
      }
    };
    fetchDoctorName();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundVideo videoSrc="/doctor-background.mp4" />
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center relative">
        {/* Animated Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto pt-20 px-6">
          <div className="text-center mb-12">
            <h1
              className={`text-5xl font-bold text-white mb-4 transition-all duration-1000 transform
                ${showWelcome ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              Welcome back, {doctorName || "Doctor"}
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
  );
}