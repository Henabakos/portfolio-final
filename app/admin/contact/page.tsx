"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Plus, X } from "lucide-react";
import { LoadingScreen } from "@/components/loading-screen";

interface ContactData {
  id: string;
  email: string;
  phone?: string;
  location?: string;
  socials: {
    [key: string]: string;
  };
}

interface Social {
  id: string;
  platform: string;
  username: string;
  followers: string;
  url: string;
  icon: string;
}

export default function ContactAdmin() {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [socials, setSocials] = useState<Social[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactData();
    fetchSocials();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch("/api/contact");
      const data = await response.json();
      if (data) setContactData(data);
    } catch (error) {
      console.error("Error fetching contact data:", error);
    }
  };

  const fetchSocials = async () => {
    try {
      const response = await fetch("/api/socials");
      const data = await response.json();
      setSocials(data);
    } catch (error) {
      console.error("Error fetching socials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContact = async () => {
    if (!contactData) return;

    setSaving(true);
    try {
      await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });

      alert("Contact information updated successfully!");
    } catch (error) {
      console.error("Error saving contact data:", error);
      alert("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSocial = async (social: Social) => {
    try {
      const method = social.id ? "PUT" : "POST";
      const url = social.id ? `/api/socials/${social.id}` : "/api/socials";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(social),
      });

      fetchSocials(); // Refresh the list
    } catch (error) {
      console.error("Error saving social:", error);
    }
  };

  const deleteSocial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social media account?"))
      return;

    try {
      await fetch(`/api/socials/${id}`, { method: "DELETE" });
      setSocials(socials.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting social:", error);
    }
  };

  const addNewSocial = () => {
    const newSocial: Social = {
      id: "",
      platform: "",
      username: "",
      followers: "",
      url: "",
      icon: "",
    };
    setSocials([...socials, newSocial]);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!contactData) {
    setContactData({
      id: "",
      email: "",
      phone: "",
      location: "",
      socials: {},
    });
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Contact Information
          </h1>
          <p className="text-gray-600">
            Manage your contact details and social media
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={contactData.email}
                onChange={(e) =>
                  setContactData({ ...contactData, email: e.target.value })
                }
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={contactData.phone || ""}
                onChange={(e) =>
                  setContactData({ ...contactData, phone: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={contactData.location || ""}
                onChange={(e) =>
                  setContactData({ ...contactData, location: e.target.value })
                }
                placeholder="San Francisco, CA"
              />
            </div>

            <Button onClick={handleSaveContact} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Contact Info"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Social Media Accounts
              <Button onClick={addNewSocial} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Social
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {socials.map((social, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Platform</Label>
                    <Input
                      value={social.platform}
                      onChange={(e) => {
                        const updated = [...socials];
                        updated[index].platform = e.target.value;
                        setSocials(updated);
                      }}
                      placeholder="Instagram"
                    />
                  </div>
                  <div>
                    <Label>Username</Label>
                    <Input
                      value={social.username}
                      onChange={(e) => {
                        const updated = [...socials];
                        updated[index].username = e.target.value;
                        setSocials(updated);
                      }}
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Followers</Label>
                    <Input
                      value={social.followers}
                      onChange={(e) => {
                        const updated = [...socials];
                        updated[index].followers = e.target.value;
                        setSocials(updated);
                      }}
                      placeholder="50.8k followers"
                    />
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <Input
                      value={social.icon}
                      onChange={(e) => {
                        const updated = [...socials];
                        updated[index].icon = e.target.value;
                        setSocials(updated);
                      }}
                      placeholder="Instagram"
                    />
                  </div>
                </div>

                <div>
                  <Label>URL</Label>
                  <Input
                    value={social.url}
                    onChange={(e) => {
                      const updated = [...socials];
                      updated[index].url = e.target.value;
                      setSocials(updated);
                    }}
                    placeholder="https://instagram.com/username"
                  />
                </div>

                <div className="flex justify-between">
                  <Button onClick={() => handleSaveSocial(social)} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  {social.id && (
                    <Button
                      onClick={() => deleteSocial(social.id)}
                      size="sm"
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {socials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No social media accounts added yet</p>
                <Button onClick={addNewSocial} className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Social Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
