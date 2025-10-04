"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { LoadingScreen } from "@/components/loading-screen";
import { CustomArrow } from "@/components/custom-arrow";

export default function ProjectsPage() {
  const [isHovered, setIsHovered] = useState({});
  const { data: projects, error } = useSWR("/api/projects", fetcher);

  if (!projects && !error) return <LoadingScreen />;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8">Failed to load projects</div>
    );

  // Group projects by layout for the grid
  const featuredProjects = projects.filter((p: any) => p.featured);
  const regularProjects = projects.filter((p: any) => !p.featured);

  return (
    <div className="min-h-screen text-foreground">
      <main className="container mx-auto px-4 ">
        {featuredProjects.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-6 mb-8">
            {featuredProjects.slice(0, 2).map((project: any, index: number) => (
              <div
                key={project.id}
                className={
                  index === 0
                    ? "lg:col-span-7 lg:row-span-2"
                    : "lg:col-span-5 lg:row-span-2"
                }
              >
                <Link href={`/projects/${project.id}`}>
                  <Card
                    className="p-2 h-full sm:p-2 lg:p-2 gradient-card dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]
    border border-gray-100/2 hover:gradient-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-4 sm:mb-2 flex-1 cursor-pointer"
                  >
                    <div className="flex flex-col h-full space-y-2">
                      <div className="h-48 sm:h-80">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full rounded-sm object-cover bg-[rgb(245,247,249)]"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-4 sm:mt-6 px-5 pb-4">
                        <div className="space-y-1">
                          <p className="text-[14px] sm:text-[16px] text-[] text-[rgb(172,176,188)] leading-[24px] sm:leading-[30px]">
                            {project.category.toUpperCase()}
                          </p>
                          <h2 className="text-base sm:text-[18px] font-semibold">
                            {project.title}
                          </h2>
                          {project.description && (
                            <p className="text-[14px] sm:text-[16px] gray-text leading-[24px] sm:leading-[30px] line-clamp-2">
                              {project.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-center hover:text-gray-500">
                          <CustomArrow className="h-10 w-10 shrink-0 transition-transform group-hover:translate-x-1 text-gray-400 hover:text-gray-600 " />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}

            {featuredProjects.slice(2, 4).map((project: any, index: number) => (
              <div
                key={project.id}
                className={
                  index === 0
                    ? "lg:col-span-5 lg:row-span-2"
                    : "lg:col-span-7 lg:row-span-2"
                }
              >
                <Link href={`/projects/${project.id}`}>
                  <Card
                    className="p-4 h-full sm:p-6 lg:p-2 gradient-card dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]
    border border-gray-100/2 hover:gradient-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-4 sm:mb-2 flex-1 cursor-pointer"
                  >
                    <div className="flex flex-col h-full space-y-2">
                      <div className="h-48 sm:h-80">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full rounded-sm object-cover bg-[#f5f7f9]"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-4 sm:mt-6 px-5">
                        <div className="space-y-1">
                          <p className="text-muted-foreground/60 text-xs sm:text-[14px]">
                            {project.category.toUpperCase()}
                          </p>
                          <h2 className="text-base sm:text-[18px] font-semibold">
                            {project.title}
                          </h2>
                          {project.description && (
                            <p className="text-sm text-muted-foreground">
                              {project.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-center hover:text-gray-500">
                          <CustomArrow className="h-10 w-10 shrink-0 transition-transform group-hover:translate-x-1 text-gray-400 " />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}

        {regularProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
            {regularProjects.map((project: any) => (
              <div key={project.id} className="lg:col-span-1 md:col-span-1">
                <Link href={`/projects/${project.id}`}>
                  <Card
                    className="p-4 h-full sm:p-6 lg:p-2 gradient-card dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]
    border border-gray-100/2 hover:gradient-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-4 sm:mb-2 flex-1 cursor-pointer"
                  >
                    <div className="flex flex-col h-full space-y-2">
                      <div className="h-48 sm:h-80">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full rounded-sm object-cover bg-[#f5f7f9]"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-4 sm:mt-6 px-5">
                        <div className="space-y-1">
                          <p className="text-muted-foreground/60 text-xs sm:text-[14px]">
                            {project.category.toUpperCase()}
                          </p>
                          <h2 className="text-base sm:text-[18px] font-semibold">
                            {project.title}
                          </h2>
                          {project.description && (
                            <p className="text-sm text-muted-foreground">
                              {project.description}
                            </p>
                          )}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.tags.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-muted px-2 py-1 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-center hover:text-gray-500">
                          <CustomArrow className="h-10 w-10 shrink-0 transition-transform group-hover:translate-x-1 text-gray-400 " />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button - can be enhanced later */}
        <div className="text-center mt-10">
          <Button className="bg-white/50 text-[#2F3236] hover:bg-[#2F3236] dark:bg-gradient-to-b dark:from-[#303131] dark:to-[#1E1E1F] dark:border-[#252627] dark:text-white hover:text-white border border-gray-100 px-6 sm:px-10 py-5 rounded-full text-[14px] sm:text-base">
            {" "}
            Load More Projects
          </Button>
        </div>
      </main>
    </div>
  );
}
