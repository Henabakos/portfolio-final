"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  icon: string;
  category: string;
  order: number;
}

export default function ToolsAdmin() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "Wrench",
    category: "Design",
    order: 0,
  });

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await fetch("/api/tools");
      const data = await response.json();
      setTools(data);
    } catch (error) {
      console.error("Error fetching tools:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/tools/${editingId}` : "/api/tools";
      const method = editingId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setFormData({ name: "", icon: "Wrench", category: "Design", order: 0 });
      setEditingId(null);
      fetchTools();
    } catch (error) {
      console.error("Error saving tool:", error);
    }
  };

  const handleEdit = (tool: Tool) => {
    setEditingId(tool.id);
    setFormData({
      name: tool.name,
      icon: tool.icon,
      category: tool.category,
      order: tool.order,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tool?")) return;

    try {
      await fetch(`/api/tools/${id}`, { method: "DELETE" });
      fetchTools();
    } catch (error) {
      console.error("Error deleting tool:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", icon: "Wrench", category: "Design", order: 0 });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Tools</h1>
        <p className="text-gray-600">
          Add, edit, or remove tools from your portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Tool" : "Add New Tool"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Tool Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Figma, Webflow, Framer"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Design, Development, Prototyping"
                  required
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon Name (Lucide React)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="e.g., Figma, Code, Palette, Wrench"
                />
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
                  {editingId ? "Update Tool" : "Add Tool"}
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
            <CardTitle>Existing Tools ({tools.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tools.map((tool) => (
                <div key={tool.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{tool.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Category: {tool.category}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Icon: {tool.icon} | Order: {tool.order}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(tool)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(tool.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {tools.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No tools yet. Add your first tool!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
