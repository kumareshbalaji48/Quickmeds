"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import UpcomingAppointments from "./UpcomingAppointments"
import ProfileSection from "./ProfileSection"

export default function Header() {
  const [activeSection, setActiveSection] = useState<"appointments" | "profile">("appointments")

  return (
    <header className="bg-white shadow-md p-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-full">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-blue-800 mb-4">Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex space-x-4">
            <Button
              variant={activeSection === "appointments" ? "default" : "outline"}
              onClick={() => setActiveSection("appointments")}
              className="flex-1 text-lg"
            >
              Appointments
            </Button>
            <Button
              variant={activeSection === "profile" ? "default" : "outline"}
              onClick={() => setActiveSection("profile")}
              className="flex-1 text-lg"
            >
              Profile
            </Button>
          </div>
          <div className="mt-8 h-[calc(100vh-150px)] overflow-y-auto">
            {activeSection === "appointments" ? <UpcomingAppointments /> : <ProfileSection />}
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="text-2xl font-bold text-blue-800">
        Doctor Dashboard
      </Link>
    </header>
  )
}

