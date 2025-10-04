"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ServiceItem {
  id?: string;
  name: string;
  order: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  items: ServiceItem[];
}

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Services</h1>
          <p className="theme-text-secondary">
            Add, edit, or remove services from your portfolio
          </p>
        </div>
        <Link href="/admin/services/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services ({services.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <p className="text-sm theme-text-secondary mt-1">
                      {service.description}
                    </p>
                    {service.items && service.items.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium theme-text-secondary">
                          Items:
                        </p>
                        <ul className="text-xs theme-text-secondary ml-4 mt-1 list-disc">
                          {service.items.map((item) => (
                            <li key={item.id}>{item.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="text-xs theme-text-secondary mt-2">
                      Icon: {service.icon} | Order: {service.order}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/services/${service.id}`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <p className="text-center theme-text-secondary py-8">
                No services yet.{" "}
                <Link href="/admin/services/new" className="underline">
                  Add your first service
                </Link>
                !
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
