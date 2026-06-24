"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/image-upload";
import { Plus, Pencil, Trash2, Save, X, Star } from "lucide-react";
import { FaUpwork } from "react-icons/fa6";
import Image from "next/image";
import type { Testimonial } from "@/lib/testimonials/types";
import { TESTIMONIAL_PLATFORMS } from "@/lib/testimonials/types";

const emptyForm = {
  name: "",
  position: "",
  content: "",
  rating: 5,
  order: 0,
  screenshot: "",
  platform: "Upwork",
  projectTitle: "",
};

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials");
      const data = await response.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/testimonials/${editingId}`
        : "/api/testimonials";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save");

      setFormData(emptyForm);
      setEditingId(null);
      fetchTestimonials();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      alert("Failed to save testimonial");
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      content: testimonial.content,
      rating: testimonial.rating,
      order: testimonial.order,
      screenshot: testimonial.screenshot || "",
      platform: testimonial.platform || "Upwork",
      projectTitle: testimonial.projectTitle || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[#14a800] mb-2">
          <FaUpwork className="h-6 w-6" />
          <span className="text-sm font-medium">Client reviews</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Manage Testimonials
        </h1>
        <p className="text-gray-600">
          Upload Upwork review screenshots and client feedback for your About page
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Testimonial" : "Add Upwork Review"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="screenshot">Upwork review screenshot</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Screenshot the client&apos;s review from Upwork — this is shown prominently on your site
                </p>
                <ImageUpload
                  value={formData.screenshot}
                  onChange={(url) =>
                    setFormData({ ...formData, screenshot: url })
                  }
                  placeholder="Upload Upwork screenshot"
                />
              </div>

              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(v) =>
                    setFormData({ ...formData, platform: v })
                  }
                >
                  <SelectTrigger id="platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TESTIMONIAL_PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name">Client Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="position">Position / Company</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="e.g., CEO at Acme Inc."
                  required
                />
              </div>

              <div>
                <Label htmlFor="projectTitle">Project / Job title</Label>
                <Input
                  id="projectTitle"
                  value={formData.projectTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, projectTitle: e.target.value })
                  }
                  placeholder="e.g., E-commerce Website Redesign"
                />
              </div>

              <div>
                <Label htmlFor="content">Review text</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Paste or summarize what the client said…"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating (1–5 stars)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: Number.parseInt(e.target.value, 10) || 5,
                      })
                    }
                    className="w-20"
                  />
                  <div className="flex">
                    {Array.from({ length: formData.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="order">Display order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: Number.parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? (
                    <Save className="w-4 h-4 mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {editingId ? "Update" : "Add testimonial"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
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
            <CardTitle>Existing ({testimonials.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="border rounded-lg overflow-hidden"
                >
                  {testimonial.screenshot && (
                    <div className="relative h-32 bg-muted">
                      <Image
                        src={testimonial.screenshot}
                        alt=""
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                  )}
                  <div className="p-4 flex justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {testimonial.name}
                        </h3>
                        {testimonial.platform && (
                          <span className="text-xs text-[#14a800] font-medium shrink-0">
                            {testimonial.platform}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {testimonial.position}
                      </p>
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {testimonial.content}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(testimonial)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(testimonial.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No testimonials yet. Upload your first Upwork review screenshot!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
