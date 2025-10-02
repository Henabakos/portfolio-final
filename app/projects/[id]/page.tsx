"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Quote } from "lucide-react";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { LoadingScreen } from "@/components/loading-screen";
import { use } from "react";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: project, error } = useSWR(
    `/api/projects/${resolvedParams.id}`,
    fetcher
  );

  if (!project && !error) return <LoadingScreen />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Button asChild>
            <a href="/projects">Back to Projects</a>
          </Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Button asChild>
            <a href="/projects">Back to Projects</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground">
      <main className="container mx-auto px-4 py-8">
        {/* Project Header */}
        <Card className="p-4 sm:p-6 lg:p-10 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] group mb-4 sm:mb-10 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-5">
            <div className="lg:col-span-2">
              <h1 className="text-[48px] leading-[48px] lg:text-5xl font-bold mb-6 text-balance black-text">
                {project.title}
              </h1>
              <p className="text-[18px] gray-text leading-[33.75px]">
                {project.description}
              </p>
            </div>

            <div className="space-y-6">
              {project.serviceArea && project.serviceArea.length > 0 && (
                <div>
                  <h3 className="text-[16px] leading-[30px] gray-text mb-3">
                    Service Area
                  </h3>
                  <ul className="space-y-2">
                    {project.serviceArea.map(
                      (service: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center text-[18px] leading-[30px] black-text font-[600]"
                        >
                          <div className="w-1.5 h-1.5 bg-foreground rounded-full mr-3" />
                          {service}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Client Info and Live Demo */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            {project.client && (
              <div>
                <p className="text-[14px] text-gray-400 mb-1 uppercase">
                  CLIENT NAME
                </p>
                <p className="font-[400] text-[18px] leading-[30px] black-text">
                  {project.client}
                </p>
              </div>
            )}
            {project.timeline && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">TIMELINE</p>
                <p className="font-[400] text-[18px] leading-[30px] black-text">
                  {project.timeline}
                </p>
              </div>
            )}
            {project.link && (
              <Button
                asChild
                variant={"outline"}
                className="rounded-full px-20 py-5 w-[250px] border text-[#2F3236] hover:bg-[#2F3236] hover:text-white transition-all duration-300 bg-transparent flex items-center justify-center border-[#2F3236]/50"
              >
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </Card>

        {project.image && (
          <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden mb-12">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content Sections */}
        <div className="w-full mx-auto space-y-12">
          {project.introduction && (
            <section>
              <h2 className="text-[24px] leading-[32px] font-bold mb-4 black-text">
                Introduction
              </h2>
              <div
                className="text-[16px] leading-[30px] gray-text font-[400] prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: project.introduction }}
              />
            </section>
          )}

          {project.goal && (
            <Card className="p-4 sm:p-6 lg:p-10 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] group mb-4 sm:mb-10 flex-1">
              <section>
                <h2 className="text-[24px] leading-[32px] font-bold mb-4 black-text">
                  Goal
                </h2>
                <div
                  className="text-[16px] leading-[30px] gray-text font-[400] prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.goal }}
                />
              </section>
            </Card>
          )}

          {project.challenge && (
            <section>
              <h2 className="text-[24px] leading-[32px] font-bold mb-4 black-text">
                Challenge
              </h2>
              <div
                className="text-[16px] leading-[30px] gray-text font-[400] prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: project.challenge }}
              />

              {project.challengeImages &&
                project.challengeImages.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                    {project.challengeImages.map(
                      (image: string, index: number) => (
                        <div
                          key={index}
                          className="relative h-[300px] rounded-xl overflow-hidden"
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Challenge image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
            </section>
          )}

          {project.outcomes && project.outcomes.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-8">Outcome</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.outcomes.map((outcome: any, index: number) => (
                  <Card
                    key={index}
                    className="p-4 sm:p-6 lg:p-10 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] group mb-4 sm:mb-10 flex-1"
                  >
                    <div>
                      <div className="text-4xl lg:text-[48px] leading-[48px] font-[700] black-text mb-2">
                        {outcome.percentage}
                      </div>
                      <h3 className="text-[20px] leading-[24px] font-[600] black-text mb-2">
                        {outcome.title}
                      </h3>
                      <p className="text-[16px] leading-[30px] gray-text font-[400]">
                        {outcome.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {project.testimonial && (
            <Card className="p-4 sm:p-6 lg:p-10 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] group mb-4 sm:mb-10 flex-1">
              <section>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {project.testimonial.image && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={project.testimonial.image || "/placeholder.svg"}
                        alt={project.testimonial.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="text-4xl text-muted-foreground mb-4">
                      <Quote />
                    </div>
                    <blockquote className="text-[18px] leading-[33.75px] font-[400] mb-4 gray-text">
                      {project.testimonial.quote}
                    </blockquote>
                    <div>
                      <p className="text-[18px] leading-[30px] font-[600] black-text">
                        {project.testimonial.author}
                      </p>
                      <p className="text-[14px] leading-[20px] font-[400] text-gray-400">
                        {project.testimonial.position}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </Card>
          )}

          {project.conclusion && (
            <section>
              <h2 className="text-[24px] leading-[32px] font-bold mb-4 black-text">
                Conclusion
              </h2>
              <div
                className="text-[16px] leading-[30px] gray-text font-[400] prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: project.conclusion }}
              />
            </section>
          )}

          {/* Next Project Button */}
          <div className="text-center pt-8">
            <Button
              asChild
              className="bg-white/50 text-[#2F3236] hover:bg-[#2F3236] hover:text-white border border-gray-100 px-6 sm:px-10 py-5 rounded-full text-[14px] sm:text-base"
            >
              <a href="/projects">Back to Projects</a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
