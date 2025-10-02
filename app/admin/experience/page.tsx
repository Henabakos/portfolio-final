"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { LoadingScreen } from "@/components/loading-screen";

interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
  logo?: string;
  order: number;
}

export default function ExperienceAdmin() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    period: "",
    description: "",
    logo: "",
    order: 0,
  });

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const response = await fetch("/api/experience");
      const data = await response.json();
      setExperience(data);
    } catch (error) {
      console.error("Error fetching experience:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/experience/${editingId}`
        : "/api/experience";
      const method = editingId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setFormData({
        company: "",
        position: "",
        period: "",
        description: "",
        logo: "",
        order: 0,
      });
      setEditingId(null);
      fetchExperience();
    } catch (error) {
      console.error("Error saving experience:", error);
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setFormData({
      company: exp.company,
      position: exp.position,
      period: exp.period,
      description: exp.description,
      logo: exp.logo || "",
      order: exp.order,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?"))
      return;

    try {
      await fetch(`/api/experience/${id}`, { method: "DELETE" });
      fetchExperience();
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      company: "",
      position: "",
      period: "",
      description: "",
      logo: "",
      order: 0,
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Experience</h1>
        <p className="text-gray-600">
          Add, edit, or remove work experience entries from your portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Experience" : "Add New Experience"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="e.g., Envato"
                  required
                />
              </div>

              <div>
                <Label htmlFor="position">Position/Role</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="e.g., UX/UI Designer"
                  required
                />
              </div>

              <div>
                <Label htmlFor="period">Period</Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) =>
                    setFormData({ ...formData, period: e.target.value })
                  }
                  placeholder="e.g., July - 2017"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your role and responsibilities..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="logo">Company Logo URL</Label>
                <Input
                  id="logo"
                  value={formData.logo}
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.value })
                  }
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the URL of the company logo image
                </p>
              </div>

              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: Number.parseInt(e.target.value),
                    })
                  }
                  placeholder="0"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? (
                    <Save className="w-4 h-4 mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {editingId ? "Update Experience" : "Add Experience"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Experience ({experience.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {exp.logo && (
                        <img
                          src={exp.logo || "/placeholder.svg"}
                          alt={exp.company}
                          className="w-12 h-12 object-contain mb-2 rounded"
                        />
                      )}
                      <h3 className="font-semibold text-lg">{exp.company}</h3>
                      <p className="text-sm text-gray-600">{exp.position}</p>
                      <p className="text-xs text-gray-400 mt-1">{exp.period}</p>
                      <p className="text-sm text-gray-700 mt-2">
                        {exp.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Order: {exp.order}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(exp)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(exp.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {experience.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No experience entries yet. Add your first one!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
