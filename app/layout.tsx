import type React from "react";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import "tippy.js/dist/tippy.css";
import { Header } from "@/components/navbar/NavBar";
import { Footer } from "@/components/footer/footer";
import { ThemeProvider } from "@/context/theme-context";
import { Toaster } from "@/components/ui/sonner";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Henok Assefa",
  description: "Henok Assefa's personal portfolio website",
  icons: {
    icon: "/logo 1.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`bg-[#F5F7F9] dark:bg-[#1A1A1A] ${bricolageGrotesque.variable} antialiased`}
      >
        <ThemeProvider>
          <Header />
          <div className=" sm:w-[90vw] lg:max-w-360 sm:mx-auto mt-10 lg:mt-20 ">
            {children}
          </div>
          <Footer />
          <Toaster richColors closeButton position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
