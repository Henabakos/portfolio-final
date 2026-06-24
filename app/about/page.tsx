"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCheck,
  Layout,
  Atom,
  Send,
  Code,
  CurlyBraces,
  Figma,
  Frame,
  Github,
  Globe,
  Instagram,
  Rocket,
  Twitter,
  Target,
  Youtube,
  Linkedin,
  Feather,
  Server,
  Database,
  Sparkles,
  Palette,
  Package,
  CodeXml,
  ThumbsUp,
  MessageSquare,
  LifeBuoy,
} from "lucide-react";
import Link from "next/link";
import { LoadingScreen } from "@/components/loading-screen";
import emailjs from "@emailjs/browser";
import useSWR from "swr";
import { CustomArrow } from "@/components/custom-arrow";
import { fetcher } from "@/lib/api";
import { FaUpwork } from "react-icons/fa6";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import type { Testimonial } from "@/lib/testimonials/types";

const items = [
  {
    icon: <ThumbsUp className="w-4 h-4 text-white" />,
    bg: "bg-blue-100",
    circle: "bg-blue-500",
    label: "Client Satisfaction",
    value: "15+ Testimonials",
  },
  {
    icon: <MessageSquare className="w-4 h-4 text-white" />,
    bg: "bg-gray-100",
    circle: "bg-gray-600",
    label: "Direct Feedback",
    value: "2-Hour Response",
  },
  {
    icon: <Rocket className="w-4 h-4 text-white" />,
    bg: "bg-blue-100",
    circle: "bg-blue-500",
    label: "Delivery Speed",
    value: "2-Week Average",
  },
  {
    icon: <LifeBuoy className="w-4 h-4 text-white" />,
    bg: "bg-red-100",
    circle: "bg-red-500",
    label: "Post-Launch",
    value: "3 Month Support",
  },
];

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description: string;
  logo?: string;
  order: number;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
  logo?: string;
  order: number;
}

interface About {
  id: string;
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  resumeLink: string;
}

const initialAboutState: About = {
  id: "",
  name: "Henok Assefa",
  title: "Versatile Designer",
  bio: "A creative and versatile digital designer with over twelve years of experience...",
  profileImage: "/user.jpg",
  resumeLink: "#",
};

const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: any } = {
    Instagram,
    Youtube,
    Twitter,
    Figma,
    Globe,
    Target,
    Send,
    Frame,
    Feather,
    CurlyBraces,
    FaUpwork,
    Layout,
    Rocket,
    Atom,
    Code,
    Server,
    Database,
    Linkedin,
    Github,
    CodeXml,
    Sparkles,
    Palette,
    Package,
  };
  return icons[iconName] || Code;
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

export default function AboutPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [about, setAbout] = useState<About>(initialAboutState);
  const [loading, setLoading] = useState(true);
  const { data: socialsData, isLoading: loadingSocials } = useSWR(
    "/api/socials",
    fetcher
  );
  const socials = socialsData || FALLBACK_SOCIALS;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          servicesRes,
          educationRes,
          experienceRes,
          testimonialsRes,
          aboutRes,
        ] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/education"),
          fetch("/api/experience"),
          fetch("/api/testimonials"),
          fetch("/api/about"),
        ]);

        const [
          servicesData,
          educationData,
          experienceData,
          testimonialsData,
          aboutData,
        ] = await Promise.all([
          servicesRes.json(),
          educationRes.json(),
          experienceRes.json(),
          testimonialsRes.json(),
          aboutRes.json(),
        ]);

        setServices(Array.isArray(servicesData) ? servicesData : []);
        setEducation(Array.isArray(educationData) ? educationData : []);
        setExperience(Array.isArray(experienceData) ? experienceData : []);
        setTestimonials(
          Array.isArray(testimonialsData) ? testimonialsData : []
        );
        if (aboutData && !aboutData.error) setAbout(aboutData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: "" });

    const now = new Date().toLocaleString("en-US", {
      timeZone: "Africa/Addis_Ababa",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const timeString = `${now} EAT`;

    try {
      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name: formData.name,
          email: formData.email,
          budget: formData.budget,
          message: formData.message,
          time: timeString,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      console.log("EmailJS response:", response);
      setFormStatus({
        type: "success",
        message: "Your message has been sent successfully!",
      });
      setFormData({ name: "", email: "", budget: "", message: "" });
    } catch (error) {
      console.error("Detailed error sending email:", error);
      if (error instanceof Error) {
        setFormStatus({
          type: "error",
          message: `Failed to send message: ${
            error.message || "Unknown error"
          }`,
        });
      } else {
        setFormStatus({
          type: "error",
          message: "Failed to send message. Please try again later.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || loadingSocials) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen mx-5 sm:mx-0">
      <Card
        className="
    p-4 sm:p-6 lg:p-8
    rounded-2xl
    gradient-card
    dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]
                 
    hover:border-gray-100/10
    transition-all duration-300
    hover:scale-[1.02]
    group
    mb-4 sm:mb-5 flex-1
  "
      >
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Text content */}
          <div className="space-y-4 md:space-y-6 order-2 md:order-1">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-gray-900 dark:text-[#CDD0DA]">
                Henok Assefa
              </h1>
              <p className="text-[18px] lg:text-[24px] text-gray-600 dark:text-[#858B9B]">
              Full-Stack Developer and AI Engineer
              </p>
            </div>
            <p className="text-[#6E737B] dark:text-[#858B9B] leading-[33.75px] text-[14px] lg:text-[18px] font-normal max-w-prose">
            A passionate Full-Stack Developer and AI Engineer with over four years of experience designing, building, and scaling modern web applications. Experienced in <span className="text-[#2F3236] dark:text-white border border-gray-200 dark:border-white/20 shadow-sm px-2 py-1 rounded-xl font-normal">full-stack development and AI-driven solutions</span>, transforming complex ideas into intuitive, high-performing products. Dedicated to creating intelligent, user-centric experiences through cutting-edge technologies, scalable architectures, and innovative problem-solving.</p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 text-[#6E737B] dark:text-[#858B9B] ">
                <CheckCheck className="w-5 h-5" />
                <span className="text-[14px] lg:text-[18px]">
                  Available for work
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#6E737B] dark:text-[#858B9B]">
                <CheckCheck className="w-5 h-5" />
                <span className="text-[14px] lg:text-[18px]">
                  Full Time Job
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button className="bg-white/50 text-[#2F3236] hover:bg-[#2F3236] dark:bg-gradient-to-b dark:from-[#303131] dark:to-[#1E1E1F] dark:border-[#252627] dark:text-white hover:text-white border border-gray-100 px-6 sm:px-10 py-5 rounded-full text-[14px] sm:text-base">
                Get in Touch
              </Button>
              <Link href={about.resumeLink}>
                <Button className="bg-white/50 text-[#2F3236] hover:bg-[#2F3236] dark:bg-gradient-to-b dark:from-[#303131] dark:to-[#1E1E1F] dark:border-[#252627] dark:text-white hover:text-white border border-gray-100 px-6 sm:px-10 py-5 rounded-full text-[14px] sm:text-base">
                  My Resume
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end order-1 md:order-2 w-full mt-1 md:mt-0">
            <div className="relative w-full max-w-full sm:max-w-[360px] md:max-w-[320px] lg:max-w-[480px] aspect-square">
              <img
                src={about.profileImage || "user.jpg"}
                alt="Henok Assefa"
                className="w-full aspect-square rounded-2xl object-cover bg-[#CDD0DA] dark:bg-[#2F3236]
               grayscale contrast-[120%] brightness-[90%]"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Experience & Education */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        {/* Experience - Now fetching from database */}
        <Card
          className="
    p-4 sm:p-6 lg:p-8
    rounded-2xl
    gradient-card
    dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]
    border border-gray-100/2
    hover:border-gray-100/10
    transition-all duration-300
    hover:scale-[1.02]
    group
    mb-4 sm:mb-5 flex-1
  "
        >
          {" "}
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold black-text mb-6 sm:mb-8 dark:text-[#CDD0DA]">
              My Experience
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="flex flex-col md:flex-row items-start gap-4 sm:gap-6 lg:gap-8 p-2"
                >
                  <div className="w-12 h-12 sm:w-20 sm:h-20 gradient-card dark:bg-gradient-to-b dark:from-[#303131] dark:to-[#1E1E1F] dark:border-[#252627] border border-[#f5f7f9] rounded-full flex items-center justify-center p-3 sm:p-4 flex-shrink-0 overflow-hidden">
                    {exp.logo ? (
                      <img
                        src={exp.logo || "/placeholder.svg"}
                        alt={exp.company}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-400  rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold black-text mb-1 text-base sm:text-lg dark:text-[#CDD0DA]">
                      {exp.company}
                    </h3>
                    <p className="gray-text mb-2 text-sm sm:text-base font-semibold">
                      {exp.position}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
                      {exp.period}
                    </p>
                    <p className="gray-text text-sm sm:text-base leading-[30px]  dark:text-[#858B9B]">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Education - Now fetching from database */}
        <Card
          className="
    p-4 sm:p-6 lg:p-8
    rounded-2xl
    gradient-card
    dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]
    border border-gray-100/2
    hover:border-gray-100/10
    transition-all duration-300
    hover:scale-[1.02]
    group
    mb-4 sm:mb-5 flex-1
  "
        >
          {" "}
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold black-text mb-6 sm:mb-8 dark:text-[#CDD0DA]">
              My Education
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="flex flex-col md:flex-row items-start gap-4 sm:gap-6 lg:gap-8 p-2"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 gradient-card dark:bg-gradient-to-b dark:from-[#303131] dark:to-[#1E1E1F] dark:border-[#252627] border border-[#f5f7f9] rounded-full flex items-center justify-center p-3 sm:p-4 flex-shrink-0 overflow-hidden">
                    {edu.logo ? (
                      <img
                        src={edu.logo || "/placeholder.svg"}
                        alt={edu.institution}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold black-text mb-1 text-base sm:text-lg dark:text-[#CDD0DA]">
                      {edu.institution}
                    </h3>
                    <p className="gray-text mb-2 text-sm sm:text-base font-semibold">
                      {edu.degree}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
                      {edu.period}
                    </p>
                    <p className="gray-text text-sm sm:text-base leading-[30px]  dark:text-[#858B9B]">
                      {edu.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card
          className="p-0  dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]
    border border-gray-100/2
    hover:border-gray-100/10"
        >
          <div className="grid grid-cols-2 divide-x divide-y divide-black/5 dark:divide-white/5 h-full">
            {[
              { value: "4", label: "Years of Experience" },
              { value: "100+", label: "Projects Complete" },
              { value: "50+", label: "Happy Customers" },
              { value: "95%", label: "Positive Feedback" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center space-y-2 p-6 sm:p-10 lg:p-14"
              >
                <div className="text-4xl sm:text-4xl lg:text-5xl font-bold black-text dark:text-[#CDD0DA]">
                  {item.value}
                </div>
                <p className="text-[14px] sm:text-lg lg:text-xl gray-text text-center whitespace-nowrap">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card
          className="p-0 dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]
      border border-gray-100/2 hover:border-gray-100/10"
        >
          <div className="grid grid-cols-2 divide-x divide-y divide-black/8 dark:divide-white/5">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-6 sm:p-8 lg:p-16 transition-colors"
              >
                {/* Icon container */}
                <div
                  className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}
                >
                  <div
                    className={`w-6 h-6 ${item.circle} rounded-full flex items-center justify-center`}
                  >
                    {item.icon}
                  </div>
                </div>

                {/* Text content */}
                <p className="text-xs sm:text-sm text-gray-600 mb-1 dark:text-[#858B9B]">
                  {item.label}
                </p>
                <p className="font-semibold text-gray-900 text-sm sm:text-md dark:text-[#CDD0DA]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Services Section - Now fetching from database */}
      <Card
        className="p-4 sm:p-6 lg:p-8 dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]
  border border-gray-100/2 hover:border-gray-100/10 transition-all duration-300 hover:scale-[1.02] group mb-4 sm:mb-5 flex-1 mt-10"
      >
        <div className="mb-20">
          <h2 className="text-[30px] font-semibold black-text mb-8 dark:text-[#CDD0DA]">
            My Services
          </h2>

          <Link href={"/services"}>
            <div className="space-y-8">
              {services.map((service) => {
                const IconComponent = getIconComponent(service.icon);
                return (
                  <div
                    key={service.id}
                    className="flex flex-col sm:flex-row items-start justify-between border-b border-border last:border-b-0 pb-8 dark:border-b-white/5  hover:text-[#2f3236] dark:hover:text-white "
                  >
                    <div className="flex flex-col sm:flex-row flex-1 gap-4 sm:gap-12 lg:gap-40 gray-text hover:text-[#2f3236] text-[16px] leading-[28px] dark:text-[#858B9B] dark:hover:text-white">
                      <div className="flex items-center gap-4 min-w-[240px] sm:min-w-[260px] lg:min-w-[300px]">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-background/30 rounded-xl flex items-center justify-center">
                          <IconComponent className="h-7 w-7" />
                        </div>
                        <h3 className="font-bold text-lg whitespace-nowrap">
                          {service.name}
                        </h3>
                      </div>

                      <p className="flex-1 text-[14px] sm:text-[16px] leading-[30px]">
                        {service.description}
                      </p>
                      <CustomArrow className="hidden sm:block w-8 h-8 mt-1 shrink-0 ml-6" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Link>
        </div>
      </Card>

      <TestimonialsSection testimonials={testimonials} />

      {/* Social Media Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
        {socials.map((social: any, index: number) => {
          const IconComponent = getIconComponent(social.icon);
          return (
            <Link href={social.url} key={social.platform}>
              <Card className="border-0 shadow-sm bg-white/50 dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] dark:border-[#252627] flex p-4 sm:p-6 hover:shadow-md transition-all rounded-xl">
                <CardContent className="flex items-center sm:gap-6 gap-4 w-full p-0">
                  {/* Icon wrapper */}
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 dark:text-[#CDD0DA]" />
                  </div>

                  {/* Texts */}
                  <div className="flex flex-col text-start overflow-hidden">
                    <h3 className="font-semibold text-base sm:text-lg lg:text-xl leading-tight sm:leading-[30px] mb-1 truncate dark:text-[#CDD0DA]">
                      {social.platform}
                    </h3>
                    <p className="text-sm sm:text-base text-[#858B9B] truncate">
                      {social.username}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Contact Section */}
      <div className="mt-20">
        <Card
          className="
    p-4 sm:p-6 lg:p-8
    rounded-2xl
    gradient-card
    dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]
    border border-gray-100/2
    hover:border-gray-100/10
    transition-all duration-300
    hover:scale-[1.02]
    group
    mb-4 sm:mb-5 flex-1
  "
        >
          {" "}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold black-text mb-4  dark:text-[#CDD0DA] ">
              Let's Work Together
            </h2>
            <p className="text-[16px] lg:text-[18px] gray-text max-w-2xl mx-auto text-[#858B9B]">
              Ready to bring your ideas to life? I'm available for freelance
              projects and full-time opportunities. Let's discuss how we can
              collaborate.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] rounded-full shadow-md flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-600  dark:text-[#CDD0DA]  "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold black-text dark:text-[#CDD0DA]">
                    Email
                  </h3>
                  <p className="gray-text text-[#858B9B]">
                    henogato9876@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] rounded-full shadow-md flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-600  dark:text-[#CDD0DA]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold black-text dark:text-[#CDD0DA]">
                    Phone
                  </h3>
                  <p className="gray-text text-[#858B9B]">+251945014531</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] rounded-full shadow-md flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-600  dark:text-[#CDD0DA]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold black-text dark:text-[#CDD0DA]">
                    Location
                  </h3>
                  <p className="gray-text text-[#858B9B]">
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] rounded-full shadow-md flex items-center justify-center">
                  <CheckCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold black-text dark:text-[#CDD0DA]">
                    Availability
                  </h3>
                  <p className="gray-text text-[#858B9B]">
                    Available for new projects
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="bg-white/50 dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] dark:border-white/5 border-gray-200 focus:border-gray-400 rounded-full py-5"
                required
              />
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                type="email"
                className="bg-white/50 dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]  dark:border-white/5 border-gray-200 focus:border-gray-400 rounded-full py-5"
                required
              />
              <Input
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Project Budget"
                className="bg-white/50 dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]  dark:border-white/5 border-gray-200 focus:border-gray-400 rounded-full py-5"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell me about your project..."
                rows={4}
                className="w-full px-3 py-2 bg-white/50 dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]  dark:border-white/5 dark border border-gray-200 rounded-md focus:border-gray-400 focus:outline-none resize-none"
                required
              />
              {formStatus.message && (
                <p
                  className={`text-sm ${
                    formStatus.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formStatus.message}
                </p>
              )}
              <Button
                type="submit"
                className="w-full rounded-full bg-[#2F3236] dark:bg-[#CDD0DA] dark:text-black  dark:border-white/5 text-white hover:bg-[#1a1d20] py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Start a Project"}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
