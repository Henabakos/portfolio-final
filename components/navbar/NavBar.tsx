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
    // { name: "Pages", href: "/pages" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-auto mx-4 sm:w-[90vw] lg:max-w-[1440px] 
        border-b border-border/40 bg-background/95 dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] backdrop-blur 
        supports-[backdrop-filter]:bg-background/60 md:mx-auto 
        rounded-md shadow-md shadow-black/5 dark:shadow-gray-500/4
        transition-all duration-300 
        ${scrolled ? "my-0" : "my-4"}`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary">
            <div className="grid h-4 w-4 grid-cols-2 gap-0.5">
              <div className="h-1.5 w-1.5 rounded-sm bg-primary-foreground"></div>
              <div className="h-1.5 w-1.5 rounded-sm bg-primary-foreground"></div>
              <div className="h-1.5 w-1.5 rounded-sm bg-primary-foreground"></div>
              <div className="h-1.5 w-1.5 rounded-sm bg-primary-foreground"></div>
            </div>
          </div>
          <span className="text-sm md:text-lg font-bold text-foreground">
            BentoMan
          </span>
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
            className="h-9 w-9 bg-secondary border border-border rounded-full hover:bg-secondary/80 transition-colors"
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
            className="hidden md:flex hover:bg-secondary/80 transition-colors border-border rounded-full px-4 bg-secondary text-sm"
          >
            Let's Talk
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 hover:bg-secondary/80 transition-colors"
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
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <div className="grid h-4 w-4 grid-cols-2 gap-0.5">
                    <div className="h-1.5 w-1.5 rounded-sm bg-foreground"></div>
                    <div className="h-1.5 w-1.5 rounded-sm bg-foreground"></div>
                    <div className="h-1.5 w-1.5 rounded-sm bg-foreground"></div>
                    <div className="h-1.5 w-1.5 rounded-sm bg-foreground"></div>
                  </div>
                </div>
                <SheetTitle className="text-lg font-bold">BentoMan</SheetTitle>
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
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
