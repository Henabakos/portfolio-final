// app/admin/login/page.js (Server Component)
import { Suspense } from "react";
import AdminLogin from "@/components/AdminLoginClient";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLogin />
    </Suspense>
  );
}
