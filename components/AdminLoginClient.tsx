// app/admin/login/AdminLoginClient.js
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const [redirect, setRedirect] = useState("/admin");

  // Safely handle redirect param
  useEffect(() => {
    const redirectParam = params.get("redirect");
    console.log("Redirect param:", redirectParam);
    if (redirectParam) {
      setRedirect(redirectParam);
    }
  }, [params]);

  // Log cookies for debugging
  useEffect(() => {
    const cookies = document.cookie;
    console.log("Client cookies:", cookies);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensure cookies are sent/received
      });

      const data = await res.json();
      console.log("API Response:", {
        status: res.status,
        ok: res.ok,
        data,
        headers: Object.fromEntries(res.headers.entries()),
      });

      if (res.ok) {
        console.log("Redirecting to:", redirect);
        // Use window.location.href for a full reload to ensure cookie is sent
        window.location.href = redirect;
      } else {
        setError(data.message || "Invalid credentials");
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
