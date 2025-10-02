import type React from "react";
import { Sidebar } from "@/components/admin/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-end mb-4">
            <form action="/api/auth/logout" method="post">
              <Button type="submit" variant="outline">
                Logout
              </Button>
            </form>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
