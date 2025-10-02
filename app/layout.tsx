import type React from "react";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/navbar/NavBar";
import { Footer } from "@/components/footer/footer";
import { ThemeProvider } from "@/components/theme-provider";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Henok Assefa",
  description: "Henok Assefa's personal portfolio website",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`bg-[#f2f4f6]  ${bricolageGrotesque.variable} antialiased`}
      >
        <Header />
        <div className=" sm:w-[90vw] lg:max-w-[1440px] sm:mx-auto mt-10 lg:mt-20 ">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
