"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ProfileSection() {
  const [profile, setProfile] = useState({
    name: "",
    specialization: "",
    experience: "",
    about: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updated profile:", profile)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-3xl font-bold text-black-800 mb-6">Edit Profile</h2>
      <div className="relative">
        <Input
          id="name"
          name="name"
          value={profile.name}
          onChange={handleChange}
          className="w-full p-4 bg-white border-2 border-black-200 rounded-lg focus:border-blue-500 transition-all duration-300"
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
          className="w-full p-4 bg-white border-2 border-black-200 rounded-lg focus:border-blue-500 transition-all duration-300"
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
          className="w-full p-4 bg-white border-2 border-black-200 rounded-lg focus:border-blue-500 transition-all duration-300"
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
          className="w-full p-4 bg-white border-2 border-black-200 rounded-lg focus:border-blue-500 transition-all duration-300"
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
      <Button type="submit" className="w-full bg-gray-400 hover:bg-gray-500 text-black text-lg py-3">
        Update Profile
      </Button>
    </form>
  )
}

