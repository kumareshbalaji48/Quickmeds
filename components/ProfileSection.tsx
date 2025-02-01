"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, User } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth, storage } from "@/lib/firebase"; // Ensure storage is imported
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "@/components/ui/use-toast";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage functions

export default function ProfileSection() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState({
    name: "",
    specialization: "",
    experience: "",
    about: "",
    profileImage: "", // Add profileImage field
  });
  const [photo, setPhoto] = useState<string | null>(null); // State for uploaded photo
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", "hospital", user.uid, "details");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data as typeof profile);
          if (data.profileImage) {
            setPhoto(data.profileImage); // Set photo URL if it exists
          }
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!user) {
      console.error("User is not authenticated.");
      toast({
        title: "Upload Failed",
        description: "Please log in before uploading an image.",
        variant: "destructive",
      });
      return;
    }

    if (file) {
      try {
        // Create a reference to the file in Firebase Storage
        const storageRef = ref(storage, `profile-images/${user.uid}/${file.name}`);

        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, file);

        // Get the download URL of the uploaded file
        const downloadURL = await getDownloadURL(storageRef);

        // Update the profile state with the new image URL
        setPhoto(downloadURL);
        setProfile((prev) => ({ ...prev, profileImage: downloadURL }));
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Upload Failed",
          description: "There was an error uploading your image. Please try again.",
          variant: "destructive",
        });
      }
    }
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
      {/* Profile Photo Upload Section */}
      <div className="flex justify-center">
        <div className="relative w-32 h-32">
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
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
            aria-label="Upload profile photo"
          >
            <Camera className="h-4 w-4" />
          </Button>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            aria-describedby="photo-upload-description"
          />
          <span id="photo-upload-description" className="sr-only">
            Upload a profile photo
          </span>
        </div>
      </div>

      {/* Name Input */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={profile.name}
          onChange={handleChange}
          className="w-full p-4 bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 transition-all duration-300"
        />
      </div>

      {/* Specialization Input */}
      <div className="space-y-2">
        <Label htmlFor="specialization">Specialization</Label>
        <Input
          id="specialization"
          name="specialization"
          value={profile.specialization}
          onChange={handleChange}
          className="w-full p-4 bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 transition-all duration-300"
        />
      </div>

      {/* Experience Input */}
      <div className="space-y-2">
        <Label htmlFor="experience">Experience</Label>
        <Input
          id="experience"
          name="experience"
          value={profile.experience}
          onChange={handleChange}
          className="w-full p-4 bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 transition-all duration-300"
        />
      </div>

      {/* About Textarea */}
      <div className="space-y-2">
        <Label htmlFor="about">About</Label>
        <Textarea
          id="about"
          name="about"
          value={profile.about}
          onChange={handleChange}
          className="w-full p-4 bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 transition-all duration-300"
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3">
        Update Profile
      </Button>
    </form>
  );
}