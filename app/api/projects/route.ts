import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      image,
      category,
      link,
      tags,
      featured,
      order,
      client,
      timeline,
      serviceArea,
      introduction,
      goal,
      challenge,
      challengeImages,
      outcomes,
      testimonial,
      conclusion,
    } = body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        image,
        category,
        link,
        tags: tags || [],
        featured: featured || false,
        order: order || 0,
        client,
        timeline,
        serviceArea: serviceArea || [],
        introduction,
        goal,
        challenge,
        challengeImages: challengeImages || [],
        outcomes: outcomes || [],
        testimonial,
        conclusion,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
