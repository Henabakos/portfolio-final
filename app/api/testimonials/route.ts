import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      position,
      content,
      rating,
      order,
      screenshot,
      platform,
      projectTitle,
    } = body;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        position,
        content,
        rating: rating || 5,
        order: order || 0,
        screenshot: screenshot || null,
        platform: platform || "Upwork",
        projectTitle: projectTitle || null,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
