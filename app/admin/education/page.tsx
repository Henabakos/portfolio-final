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

interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description: string;
  logo?: string;
  order: number;
}

export default function EducationAdmin() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    period: "",
    description: "",
    logo: "",
    order: 0,
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await fetch("/api/education");
      const data = await response.json();
      setEducation(data);
    } catch (error) {
      console.error("Error fetching education:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/education/${editingId}` : "/api/education";
      const method = editingId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setFormData({
        institution: "",
        degree: "",
        period: "",
        description: "",
        logo: "",
        order: 0,
      });
      setEditingId(null);
      fetchEducation();
    } catch (error) {
      console.error("Error saving education:", error);
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      period: edu.period,
      description: edu.description,
      logo: edu.logo || "",
      order: edu.order,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?"))
      return;

    try {
      await fetch(`/api/education/${id}`, { method: "DELETE" });
      fetchEducation();
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      institution: "",
      degree: "",
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
        <h1 className="text-3xl font-bold text-gray-900">Manage Education</h1>
        <p className="text-gray-600">
          Add, edit, or remove education entries from your portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Education" : "Add New Education"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={formData.institution}
                  onChange={(e) =>
                    setFormData({ ...formData, institution: e.target.value })
                  }
                  placeholder="e.g., Google Design School"
                  required
                />
              </div>

              <div>
                <Label htmlFor="degree">Degree/Program</Label>
                <Input
                  id="degree"
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  placeholder="e.g., Master in Interaction Design"
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
                  placeholder="e.g., 2016 - 2018"
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
                  placeholder="Describe what you learned..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="logo">Institution Logo URL</Label>
                <Input
                  id="logo"
                  value={formData.logo}
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.value })
                  }
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the URL of the institution logo image
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
                  {editingId ? "Update Education" : "Add Education"}
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
            <CardTitle>Existing Education ({education.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {edu.logo && (
                        <img
                          src={edu.logo || "/placeholder.svg"}
                          alt={edu.institution}
                          className="w-12 h-12 object-contain mb-2 rounded"
                        />
                      )}
                      <h3 className="font-semibold text-lg">
                        {edu.institution}
                      </h3>
                      <p className="text-sm text-gray-600">{edu.degree}</p>
                      <p className="text-xs text-gray-400 mt-1">{edu.period}</p>
                      <p className="text-sm text-gray-700 mt-2">
                        {edu.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Order: {edu.order}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(edu)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(edu.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {education.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No education entries yet. Add your first one!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
