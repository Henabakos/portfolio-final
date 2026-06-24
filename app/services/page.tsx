"use client";

import { Header } from "@/components/navbar/NavBar";
import { Footer } from "@/components/footer/footer";
import { CheckCircle2, Package, Palette, Sparkles, Code } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/loading-screen";

type Service = {
  id: string;
  name: string;
  icon: string;
  description: string;
  items: Array<{ name: string; col: number }>;
};

export default function ServicesPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
        if (data.length > 0) {
          setActiveSection(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const service of services) {
        const element = document.getElementById(service.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(service.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [services]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, typeof Package> = {
      Package,
      Palette,
      Sparkles,
      Code,
    };
    return icons[iconName] || Package;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 max-w-360 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4">
            <div className="sticky top-28">
              <div
                className=" gradient-card
    dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]
    border border-gray-100/2  rounded-lg p-6 shadow-sm"
              >
                <h2 className="text-2xl font-bold mb-6 text-foreground">
                  My Services
                </h2>
                <nav className="space-y-3">
                  {services.map((service) => {
                    const Icon = getIcon(service.icon);
                    return (
                      <button
                        key={service.id}
                        onClick={() => scrollToSection(service.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                          activeSection === service.id
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "hover:bg-secondary text-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{service.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {services.map((service) => {
              const Icon = getIcon(service.icon);
              return (
                <section
                  key={service.id}
                  id={service.id}
                  className="scroll-mt-28"
                >
                  <div
                    className=" gradient-card
    dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]
    border border-gray-100/2rounded-lg rounded-md p-8 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 black-text dark:text-[#CDD0DA]" />
                      </div>
                      <h3 className="text-3xl font-bold black-text dark:text-[#CDD0DA]">
                        {service.name}
                      </h3>
                    </div>
                    <p className="gray-text  dark:text-[#858B9B] text-[16px] mb-6 leading-[30px]">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.items.map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 p-4 bg-secondary/50 rounded-lg border border-border/10 hover:border-primary/10 transition-colors ${
                            item.col === 1 ? "md:col-span-1" : "md:col-span-1"
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground font-medium">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
