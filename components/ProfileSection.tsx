"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, User } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "@/components/ui/use-toast";

export default function ProfileSection() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState({
    name: "",
    specialization: "",
    experience: "",
    about: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", "hospital", user.uid, "details");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as typeof profile);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        const docRef = doc(db, "users", "hospital", user.uid, "details");
        await updateDoc(docRef, profile);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        router.push("/");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Update Failed",
          description: "There was an error updating your profile. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <Input
          id="name"
          name="name"
          value={profile.name}
          onChange={handleChange}
          className="w-full p-4 bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 transition-all duration-300"
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
          className="w-full p-4 bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 transition-all duration-300"
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
          className="w-full p-4 bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 transition-all duration-300"
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
          className="w-full p-4 bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 transition-all duration-300"
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
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3">
        Update Profile
      </Button>
    </form>
  );
}