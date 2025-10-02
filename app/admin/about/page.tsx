"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/admin/image-upload";
import { Save, Plus, X } from "lucide-react";
import { LoadingScreen } from "@/components/loading-screen";

interface AboutData {
  id: string;
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  resumeLink?: string;
  skills: string[];
  experience: string;
  projectsCount: string;
  available: boolean;
}

export default function AboutAdmin() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch("/api/about");
      const data = await response.json();
      if (data) setAboutData(data);
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!aboutData) return;

    setSaving(true);
    try {
      await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aboutData),
      });

      alert("About section updated successfully!");
    } catch (error) {
      console.error("Error saving about data:", error);
      alert("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && aboutData) {
      setAboutData({
        ...aboutData,
        skills: [...aboutData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    if (aboutData) {
      setAboutData({
        ...aboutData,
        skills: aboutData.skills.filter((_, i) => i !== index),
      });
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!aboutData) {
    setAboutData({
      id: "",
      name: "",
      title: "",
      bio: "",
      profileImage: "",
      resumeLink: "",
      skills: [],
      experience: "",
      projectsCount: "",
      available: true,
    });
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">About Section</h1>
          <p className="text-gray-600">
            Manage your personal information and bio
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={aboutData.name}
                onChange={(e) =>
                  setAboutData({ ...aboutData, name: e.target.value })
                }
                placeholder="Your full name"
              />
            </div>

            <div>
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={aboutData.title}
                onChange={(e) =>
                  setAboutData({ ...aboutData, title: e.target.value })
                }
                placeholder="e.g., Product Designer"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={aboutData.bio}
                onChange={(e) =>
                  setAboutData({ ...aboutData, bio: e.target.value })
                }
                placeholder="Tell your story..."
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="resumeLink">Resume Link (Optional)</Label>
              <Input
                id="resumeLink"
                value={aboutData.resumeLink || ""}
                onChange={(e) =>
                  setAboutData({ ...aboutData, resumeLink: e.target.value })
                }
                placeholder="https://example.com/resume.pdf"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Profile Image</Label>
              <ImageUpload
                value={aboutData.profileImage}
                onChange={(url) =>
                  setAboutData({ ...aboutData, profileImage: url })
                }
                placeholder="Upload profile image"
              />
            </div>

            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                value={aboutData.experience}
                onChange={(e) =>
                  setAboutData({ ...aboutData, experience: e.target.value })
                }
                placeholder="e.g., 12 Years Experience"
              />
            </div>

            <div>
              <Label htmlFor="projectsCount">Projects Completed</Label>
              <Input
                id="projectsCount"
                value={aboutData.projectsCount}
                onChange={(e) =>
                  setAboutData({ ...aboutData, projectsCount: e.target.value })
                }
                placeholder="e.g., 1.5k Projects Complete"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={aboutData.available}
                onCheckedChange={(checked) =>
                  setAboutData({ ...aboutData, available: checked })
                }
              />
              <Label htmlFor="available">Available for work</Label>
            </div>

            <div>
              <Label>Skills</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {aboutData.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeSkill(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
