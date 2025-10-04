"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface ServiceItem {
  name: string;
  order: number;
}

export default function NewService() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [service, setService] = useState({
    name: "",
    description: "",
    icon: "Layout",
    order: 0,
    items: [] as ServiceItem[],
  });

  const handleSave = async () => {
    if (!service.name || !service.description) {
      alert("Please fill in name and description");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service),
      });

      if (response.ok) {
        router.push("/admin/services");
      } else {
        throw new Error("Failed to create service");
      }
    } catch (error) {
      console.error("Error creating service:", error);
      alert("Error creating service");
    } finally {
      setSaving(false);
    }
  };

  const addServiceItem = () => {
    if (!newItemName.trim()) return;
    setService({
      ...service,
      items: [
        ...service.items,
        { name: newItemName, order: service.items.length },
      ],
    });
    setNewItemName("");
  };

  const removeServiceItem = (index: number) => {
    setService({
      ...service,
      items: service.items.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/services">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Service</h1>
          <p className="theme-text-secondary">Create a new service</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={service.name}
                  onChange={(e) =>
                    setService({ ...service, name: e.target.value })
                  }
                  placeholder="e.g., Product Design"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={service.description}
                  onChange={(e) =>
                    setService({ ...service, description: e.target.value })
                  }
                  placeholder="Describe the service..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon Name (Lucide React)</Label>
                <Input
                  id="icon"
                  value={service.icon}
                  onChange={(e) =>
                    setService({ ...service, icon: e.target.value })
                  }
                  placeholder="e.g., Layout, Palette, Code, Smartphone"
                />
                <p className="text-xs theme-text-secondary mt-1">
                  Browse icons at{" "}
                  <a
                    href="https://lucide.dev/icons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    lucide.dev
                  </a>
                </p>
              </div>

              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={service.order}
                  onChange={(e) =>
                    setService({
                      ...service,
                      order: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Add service item"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addServiceItem();
                    }
                  }}
                />
                <Button
                  onClick={addServiceItem}
                  size="sm"
                  disabled={!newItemName.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {service.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center p-2 border rounded"
                  >
                    <span className="flex-1 text-sm">{item.name}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeServiceItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {service.items.length === 0 && (
                  <p className="text-sm theme-text-secondary text-center py-4">
                    No items added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/admin/services">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Creating..." : "Create Service"}
        </Button>
      </div>
    </div>
  );
}
