"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  ArrowRight,
  CheckCheck,
  Layout,
  Quote,
  Youtube,
  Twitter,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import { LoadingScreen } from "@/components/loading-screen";

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

interface Testimonial {
  id: string;
  name: string;
  position: string;
  content: string;
  rating: number;
  order: number;
}

interface About {
  id: string;
  name: string;
  title: string;
  bio: string;
  profileImage: string; // Changed from Blob to string for URL
  resumeLink: string; // Changed from URL to string
}

// Define a safe initial state
const initialAboutState: About = {
  id: "",
  name: "Henok Assefa",
  title: "Versatile Designer",
  bio: "A creative and versatile digital designer with over twelve years of experience...",
  profileImage: "/user.jpg", // Fallback image
  resumeLink: "#", // Fallback link
};
export default function AboutPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [about, setAbout] = useState<About>(initialAboutState);
  const [loading, setLoading] = useState(true);

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

        setServices(servicesData);
        setEducation(educationData);
        setExperience(experienceData);
        setTestimonials(testimonialsData);
        setAbout(aboutData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen mx-5 sm:mx-0">
      <Card className="p-4 sm:p-6 lg:p-8 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] group mb-4 sm:mb-5 flex-1">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Text content */}
          <div className="space-y-4 md:space-y-6 order-2 md:order-1">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-gray-900">
                Henok Assefa
              </h1>
              <p className="text-[18px] lg:text-[24px] text-gray-600">
                Versatile Designer
              </p>
            </div>
            <p className="text-[#6E737B] leading-[33.75px] text-[14px] lg:text-[18px] font-normal max-w-prose">
              A creative and versatile digital designer with over twelve years
              of experience in{" "}
              <span className="text-[#2F3236] border border-gray-200 px-2 py-1 rounded-md font-normal">
                designing and developing
              </span>{" "}
              engaging digital media for various platforms and audiences. Lorem
              ipsum dolor sit amet consectetur.
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 text-[#6E737B] ">
                <CheckCheck className="w-5 h-5" />
                <span className="text-[14px] lg:text-[18px]">
                  Available for work
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#6E737B]">
                <CheckCheck className="w-5 h-5" />
                <span className="text-[14px] lg:text-[18px]">
                  Full Time Job
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button className="bg-white/50 text-[#2F3236] hover:bg-[#2F3236] hover:text-white border border-gray-100 px-6 sm:px-10 py-5 rounded-full text-[14px] sm:text-base">
                Get in Touch
              </Button>
              <Link href={about.resumeLink}>
                <Button className="bg-white/50 text-[#2F3236] hover:bg-[#2F3236] hover:text-white border border-gray-100 px-6 sm:px-10 py-5 rounded-full text-sm sm:text-base">
                  My Resume
                </Button>
              </Link>
            </div>
          </div>

          {/* Image (on top in small, right in large) */}
          <div className="flex justify-center md:justify-end order-1 md:order-2 w-full mt-1 md:mt-0">
            <div className="relative w-full max-w-full sm:max-w-[360px] md:max-w-[320px] lg:max-w-[480px] aspect-square">
              <img
                src={about.profileImage || "user.jpg"}
                alt="Henok Assefa"
                className="w-full aspect-square rounded-2xl object-cover bg-[#f5f7f9]"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Experience & Education */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        {/* Experience - Now fetching from database */}
        <Card className="p-4 sm:p-6 lg:p-8 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] group mb-4 sm:mb-5 flex-1">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold black-text mb-6 sm:mb-8">
              My Experience
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="flex flex-col md:flex-row items-start gap-4 sm:gap-6 lg:gap-8 p-2"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 gradient-card border border-[#f5f7f9] rounded-full flex items-center justify-center p-3 sm:p-4 flex-shrink-0 overflow-hidden">
                    {exp.logo ? (
                      <img
                        src={exp.logo || "/placeholder.svg"}
                        alt={exp.company}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold black-text mb-1 text-base sm:text-lg">
                      {exp.company}
                    </h3>
                    <p className="gray-text mb-2 text-sm sm:text-base font-semibold">
                      {exp.position}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
                      {exp.period}
                    </p>
                    <p className="gray-text text-sm sm:text-base leading-[30px]">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Education - Now fetching from database */}
        <Card className="p-4 sm:p-6 lg:p-8 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] group mb-4 sm:mb-5 flex-1">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold black-text mb-6 sm:mb-8">
              My Education
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="flex flex-col md:flex-row items-start gap-4 sm:gap-6 lg:gap-8 p-2"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 gradient-card border border-[#f5f7f9] rounded-full flex items-center justify-center p-3 sm:p-4 flex-shrink-0 overflow-hidden">
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
                    <h3 className="font-bold black-text mb-1 text-base sm:text-lg">
                      {edu.institution}
                    </h3>
                    <p className="gray-text mb-2 text-sm sm:text-base font-semibold">
                      {edu.degree}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
                      {edu.period}
                    </p>
                    <p className="gray-text text-sm sm:text-base leading-[30px]">
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
        <Card className="p-0">
          <div className="grid grid-cols-2 divide-x divide-y divide-black/5 h-full">
            {[
              { value: "12", label: "Years of Experience" },
              { value: "1.5k", label: "Projects Complete" },
              { value: "950", label: "Happy Customers" },
              { value: "14", label: "Awards Won" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center space-y-2 p-6 sm:p-10 lg:p-14"
              >
                <div className="text-4xl sm:text-4xl lg:text-5xl font-bold black-text">
                  {item.value}
                </div>
                <p className="text-[14px] sm:text-lg lg:text-xl gray-text text-center whitespace-nowrap">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-0">
          <div className="grid grid-cols-2 divide-x divide-y divide-black/8">
            {[
              {
                icon: "W",
                bg: "bg-blue-100",
                circle: "bg-blue-500",
                label: "AWWWARDS",
                value: "2 Awards",
              },
              {
                icon: "",
                bg: "bg-gray-100",
                circle: "bg-gray-600",
                label: "FWA of the Day",
                value: "3 Awards",
              },
              {
                icon: "B",
                bg: "bg-blue-100",
                circle: "bg-blue-500",
                label: "Best UI Behance",
                value: "5 Awards",
              },
              {
                icon: "P",
                bg: "bg-red-100",
                circle: "bg-red-500",
                label: "Product of the Day",
                value: "4 Awards",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-6 sm:p-8 lg:p-16 hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}
                >
                  <div
                    className={`w-6 h-6 ${item.circle} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {item.icon}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                <p className="font-semibold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Services Section - Now fetching from database */}
      <Card className="p-4 sm:p-6 lg:p-8 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] group mb-4 sm:mb-5 flex-1 mt-10">
        <div className="mb-20">
          <h2 className="text-[30px] font-semibold black-text mb-8">
            My Services
          </h2>
          <Link href={"/services"}>
            <div className="space-y-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col sm:flex-row items-start justify-between border-b border-b-gray-200 last:border-b-0 pb-8 hover:text-[#2f3236]"
                >
                  <div className="flex flex-col sm:flex-row flex-1 gap-4 sm:gap-12 lg:gap-40 gray-text hover:text-[#2f3236] text-[16px] leading-[28px]">
                    {/* Left side (icon + title) */}
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        {/* <div className="w-6 h-6 bg-gray-600 rounded-sm"></div> */}
                        <Layout className="w-7 h-7" />
                      </div>
                      <h3 className="font-bold text-lg">{service.name}</h3>
                    </div>

                    {/* Description */}
                    <p className="flex-1 text-[14px] sm:text-[16px] leading-[30px]">
                      {service.description}
                    </p>
                    <ArrowRight className="hidden sm:block w-5 h-5 mt-1 shrink-0 ml-6" />
                  </div>

                  {/* Arrow (only show on sm and up) */}
                </div>
              ))}
            </div>
          </Link>
        </div>
      </Card>

      {/* Testimonials - Now fetching from database */}
      <div className="mb-20 mt-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="border-0 shadow-sm bg-white/50"
            >
              <CardContent className="p-6">
                <div className="text-4xl text-gray-300 mb-4 ">
                  <Quote className="w-16 h-16 " />
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="gray-text text-[16px] mb-6 leading-[30px]">
                  {testimonial.content}
                </p>
                <div>
                  <p className="font-semibold text-[20px] black-text">
                    {testimonial.name}
                  </p>
                  <p className="text-[15.04px] gray-text leading-[24px]">
                    {testimonial.position}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Social Media Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <Card className="border-0 shadow-sm bg-white/50 flex p-6">
          <CardContent className="flex justify-start items-center gap-6 p-4 w-full">
            <div className="w-16 h-16 bg-pink-100 items-center justify-center flex gradient-card border border-gray-200 rounded-full">
              <Youtube className="w-6 h-6 black-text" />{" "}
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-[20px] leading-[30px] mb-1 black-text">
                Youtube
              </h3>
              <p className="text-sm gray-text text-[16px] leading-[30px]">
                25k subscribers
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white/50 flex p-6">
          <CardContent className="flex justify-start items-center gap-6 p-4 w-full">
            <div className="w-16 h-16 bg-pink-100 items-center justify-center flex gradient-card border border-gray-200 rounded-full">
              <Instagram className="w-6 h-6 black-text" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-[20px] leading-[30px] mb-1 black-text">
                Instagram
              </h3>
              <p className="text-sm gray-text text-[16px] leading-[30px]">
                50.8k followers
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white/50 flex p-6">
          <CardContent className="flex justify-start items-center gap-6 p-4 w-full">
            <div className="w-16 h-16 bg-pink-100 items-center justify-center flex gradient-card border border-gray-200 rounded-full">
              <Twitter className="w-6 h-6 black-text" />{" "}
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-[20px] leading-[30px] mb-1 black-text">
                Twitter
              </h3>
              <p className="text-sm gray-text">1.2k followers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Section */}
      <div className="mt-20">
        <Card className="p-4 sm:p-6 lg:p-8 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] group mb-4 sm:mb-5 flex-1">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold black-text mb-4">
              Let's Work Together
            </h2>
            <p className="text-[16px] lg:text-[18px] gray-text max-w-2xl mx-auto">
              Ready to bring your ideas to life? I'm available for freelance
              projects and full-time opportunities. Let's discuss how we can
              collaborate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-600"
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
                  <h3 className="font-semibold black-text">Email</h3>
                  <p className="gray-text">alex.hales@example.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-600"
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
                  <h3 className="font-semibold black-text">Phone</h3>
                  <p className="gray-text">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-600"
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
                  <h3 className="font-semibold black-text">Location</h3>
                  <p className="gray-text">San Francisco, CA</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <CheckCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold black-text">Availability</h3>
                  <p className="gray-text">Available for new projects</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-4">
              <Input
                placeholder="Your Name"
                className="bg-white/50 border-gray-200 focus:border-gray-400"
              />
              <Input
                placeholder="Your Email"
                type="email"
                className="bg-white/50 border-gray-200 focus:border-gray-400"
              />
              <Input
                placeholder="Project Budget"
                className="bg-white/50 border-gray-200 focus:border-gray-400"
              />
              <textarea
                placeholder="Tell me about your project..."
                rows={4}
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-md focus:border-gray-400 focus:outline-none resize-none"
              />
              <Button className="w-full bg-[#2F3236] text-white hover:bg-[#1a1d20] py-3">
                Start a Project
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
