"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white shadow-md p-4">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-blue-800 mb-4">Menu</SheetTitle>
          </SheetHeader>
          <nav className="mt-8 space-y-4">
            <Link href="/appointments" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-lg">
                Appointments
              </Button>
            </Link>
            <Link href="/profile" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-lg">
                Profile
              </Button>
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <Link href="/" className="text-2xl font-bold text-blue-800">
        Doctor Dashboard
      </Link>
    </header>
  )
}

