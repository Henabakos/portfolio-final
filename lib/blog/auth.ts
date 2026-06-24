import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

export function isAdminAuthenticated(request?: NextRequest): boolean {
  if (request) {
    return request.cookies.get("admin_auth")?.value === "1";
  }
  return false;
}

export async function isAdminAuthenticatedServer(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_auth")?.value === "1";
}
