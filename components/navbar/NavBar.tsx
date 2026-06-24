"use client";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/theme-context";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10); // true when scrolled down a bit
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Home", href: "/home" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Services", href: "/services" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-auto mx-4 sm:w-[90vw] lg:max-w-360 
        border-b border-border/40 bg-background/95 dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] backdrop-blur 
        supports-[backdrop-filter]:bg-background/60 md:mx-auto 
        rounded-md shadow-md shadow-black/5 dark:shadow-gray-500/4
        transition-all duration-300 
        ${scrolled ? "my-0" : "my-4"}`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center justify-center">
          <div className="relative h-10 w-10 md:h-14 md:w-14">
            <Link href="/home">
              <Image
                src="/logo 2 (1).svg"
                alt="Logo"
                fill
                className="object-contain dark:invert"
                priority
              />
            </Link>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "text-foreground font-semibold border border-border dark:border-white/40 px-4 py-2 rounded-full hover:text-primary"
                  : "text-muted-foreground dark:text-[#CDD0DA] hover:text-foreground"
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 bg-secondary border border-border rounded-full hover:bg-secondary/80 transition-colors hover:text-gray-500 "
          >
            {mounted && (
              <>
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </>
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/contact")}
            className="hidden md:flex hover:bg-secondary/80 transition-colors border-border rounded-full px-4 bg-secondary text-sm  hover:text-gray-500"
          >
            Let's Talk
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 hover:bg-secondary/80 transition-colors  hover:text-gray-500"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[280px] sm:w-[320px] p-3 bg-background shadow-lg"
            >
              {/* Logo + Title */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                  <div className="relative h-10 w-10 md:h-14 md:w-14">
                    <Image
                      src="/logo 2 (1).svg" // put your file in public/
                      alt="Logo"
                      fill
                      className="object-contain dark:invert"
                      priority
                    />
                  </div>
                </div>
                {/* <SheetTitle className="text-lg font-bold">BentoMan</SheetTitle> */}
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`w-full text-left px-4 py-3 rounded-[5px] text-sm font-medium transition-colors
            ${
              pathname === item.href
                ? "bg-primary text-primary-foreground dark:bg-[#f5f7f9] dark:text-[#1a1c1e]"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-[#2a2c2e] dark:text-[#e5e7eb] dark:hover:bg-[#3a3c3e]"
            }`}
                  >
                    {item.name}
                  </a>
                ))}
                <a
                  key="contact"
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`w-full text-left px-4 py-3 rounded-[5px] text-sm font-medium transition-colors
            ${
              pathname === "/contact"
                ? "bg-primary text-primary-foreground dark:bg-[#f5f7f9]"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
                >
                  Contact
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
