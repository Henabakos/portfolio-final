import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const validEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const validPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (email === validEmail && password === validPassword) {
      const res = NextResponse.json({ ok: true });
      res.cookies.set("admin_auth", "1", {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
      });
      return res;
    }
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
