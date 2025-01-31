"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"
import { User } from "lucide-react"

export default function ProfileSection() {
  const [profile, setProfile] = useState({
    name: "",
    specialization: "",
    experience: "",
    about: "",
  })
  const [photo, setPhoto] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updated profile:", profile)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center">
        <div className="relative w-32 h-32">
          {photo ? (
            <Image
              src={photo || "/placeholder.svg"}
              alt="Profile"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-16 w-16 text-gray-400" />
            </div>
          )}
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute bottom-0 right-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
          <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
        </div>
      </div>
      <div className="relative">
        <Input
          id="name"
          name="name"
          value={profile.name}
          onChange={handleChange}
          className="w-full p-4 bg-white border-2 border-black-200 rounded-lg focus:border-black-500 transition-all duration-300"
        />
        <Label
          htmlFor="name"
          className={`absolute left-4 top-4 transition-all duration-300 ${profile.name ? "text-xs -top-2 bg-white px-1" : "text-gray-500"
            }`}
        >
          Name
        </Label>
      </div>
      <div className="relative">
        <Input
          id="specialization"
          name="specialization"
          value={profile.specialization}
          onChange={handleChange}
          className="w-full p-4 bg-white border-2 border-black-200 rounded-lg focus:border-black-500 transition-all duration-300"
        />
        <Label
          htmlFor="specialization"
          className={`absolute left-4 top-4 transition-all duration-300 ${profile.specialization ? "text-xs -top-2 bg-white px-1" : "text-gray-500"
            }`}
        >
          Specialization
        </Label>
      </div>
      <div className="relative">
        <Input
          id="experience"
          name="experience"
          value={profile.experience}
          onChange={handleChange}
          className="w-full p-4 bg-white border-2 border-black-200 rounded-lg focus:border-black-500 transition-all duration-300"
        />
        <Label
          htmlFor="experience"
          className={`absolute left-4 top-4 transition-all duration-300 ${profile.experience ? "text-xs -top-2 bg-white px-1" : "text-gray-500"
            }`}
        >
          Experience
        </Label>
      </div>
      <div className="relative">
        <Textarea
          id="about"
          name="about"
          value={profile.about}
          onChange={handleChange}
          className="w-full p-4 bg-white border-2 border-black-200 rounded-lg focus:border-black-500 transition-all duration-300"
          rows={4}
        />
        <Label
          htmlFor="about"
          className={`absolute left-4 top-4 transition-all duration-300 ${profile.about ? "text-xs -top-2 bg-white px-1" : "text-gray-500"
            }`}
        >
          About
        </Label>
      </div>
      <Button type="submit" className="w-full bg-gray-400 hover:bg-gray-500 text-white text-lg py-3">
        Update Profile
      </Button>
    </form>
  )
}

