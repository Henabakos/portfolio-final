"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  User,
  Mail,
  Settings,
  Home,
  Star,
  GraduationCap,
  Layout,
  GripVertical,
  Briefcase,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderOpen },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { name: "About", href: "/admin/about", icon: User },
  { name: "Contact", href: "/admin/contact", icon: Mail },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Testimonials", href: "/admin/testimonials", icon: Star },
  { name: "Tools", href: "/admin/tools", icon: GripVertical },
  { name: "Services", href: "/admin/services", icon: Layout },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Home className="w-6 h-6" />
          Portfolio Admin
        </Link>
      </div>

      <nav className="px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* <div className="absolute bottom-4 left-4 right-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
        >
          <Home className="w-4 h-4" />
          Back to Site
        </Link>
      </div> */}
    </div>
  );
}
