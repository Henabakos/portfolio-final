"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { CustomArrow } from "@/components/custom-arrow";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export function InfiniteScrollProjects() {
  const { data: projects } = useSWR<Project[]>("/api/projects", fetcher);
  const [duplicatedProjects, setDuplicatedProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      // only two copies are needed for seamless looping
      const duplicated = [...projects, ...projects];
      setDuplicatedProjects(duplicated);
    }
  }, [projects]);

  if (!projects || projects.length === 0) return null;

  return (
    <Card
      className="gradient-card dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]
      border border-gray-100/10 hover:gradient-hover transition-all duration-300 
      hover:scale-[1.02] hover:shadow-lg group overflow-hidden"
    >
      <div className="flex flex-col">
        <div className="relative overflow-hidden w-full">
          <div className="flex gap-4 animate-infinite-scroll-smooth whitespace-nowrap py-3">
            {duplicatedProjects.map((project, index) => (
              <div
                key={`${project.id}-${index}`}
                className="inline-block flex-shrink-0 w-[280px] sm:w-[340px] h-[220px] sm:h-[240px] rounded-md border-3 border-gray-400 overflow-hidden bg-muted"
              >
                <img
                  src={project.image || "/placeholder.svg?height=200&width=320"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-card via-card/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card via-card/80 to-transparent" />
        </div>

        <div className="flex justify-between items-center mt-5 sm:mt-7 px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <div className="space-y-2">
            <p className="text-muted-foreground/60 text-xs sm:text-[14px]">
              RECENT WORKS
            </p>
            <h2 className="text-base sm:text-[18px] font-semibold">
              All Projects
            </h2>
          </div>
          <div className="flex items-center justify-center hover:text-muted-foreground">
            <CustomArrow className="h-10 w-10 shrink-0 transition-transform group-hover:translate-x-1 text-muted-foreground" />
          </div>
        </div>
      </div>
    </Card>
  );
}
