"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "sonner";
import axios from "axios";

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  isPublic: boolean;
  bio: string;
  city: string;
  country: string;
  dob: string;
  profilePicture: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch profile data when component mounts
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3002/profile", {
          withCredentials: true,
        });
        const profileData = response.data;
        console.log(profileData);
        setProfile(profileData);
        setIsPublic(profileData.is_public);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const formatTimeSince = (createdAt) => {
    if (!createdAt) return "just now";

    const now = new Date();
    const created = new Date(createdAt);
    const seconds = Math.floor((now - created) / 1000);

    // Time intervals in seconds
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    let counter;
    let unit;

    if (seconds < 60) {
      return "just now";
    }

    for (const [key, value] of Object.entries(intervals)) {
      counter = Math.floor(seconds / value);
      if (counter > 0) {
        unit = key;
        break;
      }
    }

    return `Member since ${counter} ${unit}${counter === 1 ? "" : "s"}`;
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfilePicture(e.target.files[0]);
    }
  };

  const handleisPublicChange = (pressed: boolean) => {
    setIsPublic(pressed);
    setProfile((prev) => (prev ? { ...prev, isPublic: pressed } : null));
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      let data: any = {
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
        city: profile.city,
        country: profile.country,
        dob: profile.dob,
        is_public: isPublic,
      };

      if (newProfilePicture) {
        const formData = new FormData();
        formData.append("profilePicture", newProfilePicture);

        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
        data = formData;
      }

      console.log("Profile data:", data);

      await axios.put("http://localhost:3002/profile", data, {
        withCredentials: true,
        headers: newProfilePicture
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setNewProfilePicture(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-10 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="mt-2">Unable to load profile information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="relative group">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profile.profilePicture || ""}
                    alt={profile.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {profile.name
                      ? profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : profile.user_id?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <label
                      htmlFor="profile-picture"
                      className="cursor-pointer text-white text-xs text-center p-2"
                    >
                      Change Picture
                      <input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                      />
                    </label>
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                <CardDescription>@{profile.user_id}</CardDescription>
                <p className="text-sm text-muted-foreground mt-2">
                  {profile.city}, {profile.country}
                </p>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm font-medium">{profile.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm font-medium">{profile.email}</p>
                )}
              </div>

              <div className="flex items-center w-max">
                <div className="flex-grow">
                  <Label htmlFor="privacy">Profile Privacy</Label>
                  <p className="text-sm text-muted-foreground">
                    {isPublic
                      ? "Your profile is visible to everyone"
                      : "Profile visible to your followings"}
                  </p>
                </div>
                {isEditing && (
                  <Toggle
                    className="ml-4 cursor-pointer"
                    aria-label="Toggle profile visibility"
                    pressed={isPublic}
                    onPressedChange={handleisPublicChange}
                  >
                    {isPublic ? "Public" : "Private"}
                  </Toggle>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                {isEditing ? (
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formatDateForInput(profile.dob)}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm font-medium">
                    {new Date(profile.dob).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_id">Username</Label>
                <p className="text-sm font-medium">@{profile.user_id}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                {isEditing ? (
                  <Input
                    id="city"
                    name="city"
                    value={profile.city}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm font-medium">{profile.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                {isEditing ? (
                  <Input
                    id="country"
                    name="country"
                    value={profile.country}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm font-medium">{profile.country}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  rows={4}
                />
              ) : (
                <p className="text-sm">{profile.bio}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <p className="text-xs text-muted-foreground">
              {formatTimeSince(profile.created_at)}
            </p>

            {isEditing && (
              <Button variant="default" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
