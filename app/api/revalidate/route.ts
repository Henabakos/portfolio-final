import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path") || "/";
    try {
      revalidatePath(path);
    } catch {}
    return NextResponse.json({ revalidated: true, path });
  } catch (e) {
    return NextResponse.json({ revalidated: false }, { status: 400 });
  }
}
