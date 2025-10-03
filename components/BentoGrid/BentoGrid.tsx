"use client";

import {
  ArrowRight,
  Atom,
  Code,
  CurlyBraces,
  Figma,
  Frame,
  Github,
  Globe,
  Instagram,
  Layout,
  Rocket,
  Twitter,
  Target,
  Youtube,
  Linkedin,
  Feather,
  Server,
  Database,
  CodeXml,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { LoadingScreen } from "@/components/loading-screen";
import { CustomArrow } from "@/components/custom-arrow";

// Define fallback data constants outside the component
const FALLBACK_ABOUT = {
  name: "Henok Assefa",
  title: "Product Designer",
  bio: "As a product designer, I specialize in creating magical visual identities for digital products.",
  profileImage: "/user.jpg",
  experience: "4",
  projectsCount: "100+",
  available: true,
  skills: [
    "Product Strategy",
    "UX Design",
    "Graphics",
    "Backend Development",
    "System Architecture",
  ],
};

const FALLBACK_SOCIALS = [
  {
    platform: "Instagram",
    username: "@henaman49",
    followers: "300 followers",
    icon: "Instagram",
  },
  {
    platform: "Github",
    username: "Henabakos",
    followers: "",
    icon: "Youtube",
  },
  {
    platform: "Linkedin",
    username: "Henok Assefa",
    followers: "3.5k followers",
    icon: "Twitter",
  },
];

const FALLBACK_TOOLS = [
  { name: "Figma", icon: "Figma" },
  { name: "Web Development", icon: "CodeXml" },
  { name: "Database Design", icon: "Database" },
];

const FALLBACK_SERVICES = [
  { name: "Product Design", icon: "CurlyBraces" },
  { name: "Product Strategy", icon: "Rocket" },
  { name: "System Architecture", icon: "Atom" },
  { name: "Development", icon: "Code" },
];

export function BentoGrid() {
  // Use SWR and capture the loading state for each fetch
  const { data: aboutData, isLoading: loadingAbout } = useSWR(
    "/api/about",
    fetcher
  );
  const { data: socialsData, isLoading: loadingSocials } = useSWR(
    "/api/socials",
    fetcher
  );
  const { data: toolsData, isLoading: loadingTools } = useSWR(
    "/api/tools",
    fetcher
  );
  const { data: servicesData, isLoading: loadingServices } = useSWR(
    "/api/services",
    fetcher
  );

  // Determine overall loading state: true if ANY request is loading
  const isLoading =
    loadingAbout || loadingSocials || loadingTools || loadingServices;

  // Use fetched data or fall back to static data if loading fails (data is undefined)
  const about = aboutData || FALLBACK_ABOUT;
  const socials = socialsData || FALLBACK_SOCIALS;
  const tools = toolsData || FALLBACK_TOOLS;
  const services = servicesData || FALLBACK_SERVICES;

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Instagram,
      Youtube,
      Twitter,
      Figma,
      Globe,
      Target,
      Frame,
      Feather,
      CurlyBraces,
      Layout,
      Rocket,
      Atom,
      Code,
      Server,
      Database,
      Linkedin,
      Github,
      CodeXml,
    };
    return icons[iconName] || Code;
  };

  // --- LOADING CHECK ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingScreen />
      </div>
    );
  }
  // --- END LOADING CHECK ---

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 h-full px-4 sm:px-0">
      {/* Column 1 */}
      <div className="flex flex-col h-full">
        <Card className="p-4 sm:p-6 lg:p-8 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-4 sm:mb-5 flex-1">
          <div className="flex flex-col h-full space-y-4 sm:space-y-6">
            <div className="relative">
              <img
                src={about.profileImage || "/placeholder.svg"}
                alt={about.name}
                className="w-full aspect-square rounded-2xl object-cover bg-[#F5F7F9]"
              />
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 lg:p-8 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-4 sm:mb-5 flex-1">
          <div className="flex flex-col h-full space-y-4 sm:space-y-6">
            <div className="space-y-3">
              <div className="flex flex-row justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  Hello there, I am
                </p>
                {about.available && (
                  <div className="flex items-center gap-1 gradient-card black-text  rounded-full border  px-5 py-2 text-sm font-medium self-start sm:self-auto">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Available for hire
                  </div>
                )}
              </div>

              <h2 className="text-[36px] sm:text-[36px] font-bold">
                {about.name}
              </h2>
              <p className="text-[16px] text-muted-foreground leading-relaxed">
                As a{" "}
                <span className="font-semibold text-foreground">
                  {about.title.toLowerCase()}
                </span>
                , I specialize in creating magical visual identities for{" "}
                <span className="font-semibold text-foreground">
                  digital products
                </span>
                .
              </p>
            </div>

            <div className="flex justify-between items-center mt-auto">
              <div className="space-y-2">
                <h2 className="text-base sm:text-lg font-semibold">
                  About Myself
                </h2>
              </div>
              <Link href={"/about"}>
                <div className="flex items-center justify-center hover:text-muted-foreground">
                  <CustomArrow className="h-10 w-10 shrink-0 transition-transform group-hover:translate-x-1 text-muted-foreground" />
                </div>
              </Link>
            </div>
          </div>
        </Card>
        <Card className="px-4 sm:px-6 lg:px-8 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-4 sm:mb-5 flex-1">
          {socials.map((social: any, index: number) => {
            const IconComponent = getIconComponent(social.icon);
            const isLast = index === socials.length - 1;
            return (
              <Link href={social.url} key={social.platform}>
                <div
                  key={social.platform}
                  className={`${
                    !isLast ? "border-b border-border" : ""
                  } py-3 sm:py-4 flex gap-3`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-foreground bg-background rounded-full p-2 border border-border" />
                  </div>
                  <div>
                    <span className="font-medium text-sm">
                      {social.platform}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {social.username}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </Card>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col h-full">
        <Card className="p-4 sm:p-6 lg:p-8 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-4 sm:mb-5 flex-1">
          <div className="flex gap-6 sm:gap-8 lg:gap-12 w-full items-center justify-center mt-3 sm:mt-5">
            {tools.map((tool: any) => {
              const IconComponent = getIconComponent(tool.icon);
              return (
                <div
                  key={tool.name}
                  className="text-center space-y-3 sm:space-y-5 lg:space-y-7"
                >
                  <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto text-foreground font-light" />
                  <p className="font-[400] text-sm sm:text-lg lg:text-[16px] text-muted-foreground leading-[30px]">
                    {tool.name}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-5 sm:mt-7">
            <div className="space-y-2">
              <p className="text-muted-foreground/60 text-xs sm:text-[14px]">
                TOOLS AND TECHNOLOGY
              </p>
              <h2 className="text-base sm:text-lg font-semibold">
                My Credentials
              </h2>
            </div>
            <Link href={"/about"}>
              <div className="flex items-center justify-center hover:text-muted-foreground">
                <CustomArrow className="h-10 w-10 shrink-0 transition-transform group-hover:translate-x-1 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 lg:p-8 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-4 sm:mb-5 flex-1">
          <div className="flex flex-col h-full space-y-4 sm:space-y-6">
            <div>
              <img
                src="/project-image.svg"
                alt="Project showcase"
                className="w-full rounded-2xl object-contain"
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-5 sm:mt-7">
            <div className="space-y-2">
              <p className="text-muted-foreground/60 text-xs sm:text-[14px]">
                RECENT WORKS
              </p>
              <h2 className="text-base sm:text-[18px] font-semibold">
                All Projects
              </h2>
            </div>
            <Link href={"/projects"}>
              <div className="flex items-center justify-center hover:text-muted-foreground">
                <CustomArrow className="h-10 w-10 shrink-0 transition-transform group-hover:translate-x-1 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 lg:p-8 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-4 sm:mb-5 flex-1">
          <div className="flex justify-center gap-8 sm:gap-12 lg:gap-16 mt-3">
            <div className="space-y-1 text-center">
              <h3 className="text-3xl sm:text-4xl lg:text-[48px] font-bold">
                {about.experience}
              </h3>
              <p className="text-sm sm:text-[16px] text-muted-foreground">
                Years Experience
              </p>
            </div>

            <div className="space-y-1 text-center">
              <h3 className="text-3xl sm:text-4xl lg:text-[48px] font-bold">
                {about.projectsCount}
              </h3>
              <p className="text-sm sm:text-[16px] text-muted-foreground">
                Projects Complete
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-5 sm:mt-7">
            <div className="space-y-2">
              <p className="text-muted-foreground/60 text-xs sm:text-[14px]">
                CAREER STATS
              </p>
              <h2 className="text-base sm:text-lg font-semibold">
                My Credentials
              </h2>
            </div>
            <Link href={"/about"}>
              <div className="flex items-center justify-center hover:text-muted-foreground">
                <CustomArrow className="h-10 w-10 shrink-0 transition-transform group-hover:translate-x-1 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </Card>
      </div>

      {/* Column 3 */}
      <div className="flex flex-col h-full">
        <Card className="gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-4 sm:mb-5 flex-1">
          <div className="flex flex-col h-full overflow-hidden">
            <div className="w-[120%] overflow-hidden -rotate-4 bg-muted mt-3 sm:mt-5">
              <div className="flex animate-marquee whitespace-nowrap text-foreground/80 text-xs sm:text-sm md:text-base font-medium py-3 sm:py-4">
                {about.skills?.map((skill: string, index: number) => (
                  <span key={index}>💡 {skill}&nbsp;–&nbsp;</span>
                ))}
                {about.skills?.map((skill: string, index: number) => (
                  <span key={`repeat-${index}`}>💡 {skill}&nbsp;–&nbsp;</span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 sm:mt-8 lg:mt-10 mx-4 sm:mx-6 lg:mx-8">
              <div className="space-y-2">
                <p className="text-muted-foreground/60 text-xs sm:text-[14px] uppercase">
                  Have Proposal?
                </p>
                <h2 className="text-base sm:text-[18px] font-semibold">
                  Let's Start
                </h2>
              </div>
              <Link href={"/contact"}>
                <div className="flex items-center justify-center hover:text-muted-foreground">
                  <CustomArrow className="h-10 w-10 shrink-0 transition-transform group-hover:translate-x-1 text-muted-foreground" />
                </div>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 lg:p-8 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-4 sm:mb-5 flex-1">
          <div className="flex flex-col h-full space-y-4 sm:space-y-6">
            <div>
              <img
                src="/blog-img.svg"
                alt="Blog illustration"
                className="w-full rounded-2xl object-contain"
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-5 sm:mt-7">
            <div className="space-y-2">
              <p className="text-muted-foreground/60 text-xs sm:text-[14px]">
                ARTICLES
              </p>
              <h2 className="text-base sm:text-[18px] font-semibold">
                All Blogs
              </h2>
            </div>
            <Link href={"/blog"}>
              <div className="flex items-center justify-center hover:text-muted-foreground">
                <CustomArrow className="h-10 w-10 shrink-0 transition-transform group-hover:translate-x-1 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 lg:p-8 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-4 sm:mb-5 flex-1">
          <div className="flex flex-col h-full space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2">
              {services.slice(0, 4).map((service: any, index: number) => {
                const IconComponent = getIconComponent(service.icon);
                const isTopRow = index < 2;
                const isLeftColumn = index % 2 === 0;

                return (
                  <div
                    key={service.name}
                    className={`flex flex-col items-center justify-center space-y-2 p-3 sm:p-4 lg:p-6 ${
                      isTopRow ? "border-b border-border" : ""
                    } ${isLeftColumn ? "border-r border-border" : ""}`}
                  >
                    <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-foreground" />
                    <p className="text-xs sm:text-sm lg:text-[16px] text-muted-foreground text-center">
                      {service.name}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center mt-auto">
              <div className="space-y-2">
                <p className="text-muted-foreground/60 text-xs sm:text-[14px] uppercase">
                  My Service Area
                </p>
                <h2 className="text-base sm:text-[18px] font-semibold">
                  Service Details
                </h2>
              </div>
              <Link href={"/about"}>
                <div className="flex items-center justify-center hover:text-muted-foreground">
                  <CustomArrow className="h-10 w-10 shrink-0 transition-transform group-hover:translate-x-1 text-muted-foreground" />
                </div>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
