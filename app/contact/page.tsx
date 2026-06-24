"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Phone, Mail, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import emailjs from "@emailjs/browser";
import { LoadingScreen } from "@/components/loading-screen";

// --- MODIFIED CopyButton Component for embedded use ---
function CopyButton({
  textToCopy,
  className,
}: {
  textToCopy: string;
  className?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1 rounded-md transition-colors duration-300 flex-shrink-0 ml-2 ${
        isCopied
          ? "bg-green-100 text-green-700"
          : "bg-transparent text-muted-foreground/60 hover:text-foreground"
      } ${className}`}
      aria-label={`Copy ${textToCopy}`}
      disabled={isCopied}
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
// ------------------------------------------------------

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    description: "",
  });
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const phone = contact?.phone || "+251945014531";
  const email = contact?.email || "henogato9876@gmail.com";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();
        setContact(data);
      } catch (e) {
        console.error("Failed to load contact", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          message: formData.description,
          time: timeString,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      console.log("EmailJS response:", response);
      setFormStatus({
        type: "success",
        message: "Your message has been sent successfully!",
      });
      setFormData({ name: "", email: "", budget: "", description: "" });
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

  return (
    <div className="min-h-screen w-full py-10 px-3 sm:px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 max-w-360 mx-auto">
          {/* Left Side */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone Card */}
              <Card className="p-5 text-start gradient-card dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] border border-gray-100/2 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center gradient-card dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] border border-gray-200 dark:border-white/5 rounded-full mb-3">
                  <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="flex items-center justify-start gap-2 mb-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold black-text dark:text-[#CDD0DA] break-all">
                    {loading ? "..." : phone}
                  </h3>
                  {!loading && <CopyButton textToCopy={phone} />}
                </div>
                <p className="text-sm sm:text-base gray-text dark:text-[#858B9B]">
                  Phone Number
                </p>
              </Card>

              {/* Email Card */}
              <Card className="p-5 text-start gradient-card dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] border border-gray-100/2 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center gradient-card dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] border border-gray-200 dark:border-white/5 rounded-full mb-3">
                  <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="flex items-center justify-start gap-2 mb-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold black-text dark:text-[#CDD0DA] break-all truncate max-w-[200px] sm:max-w-xs md:max-w-full">
                    {loading ? "..." : email}
                  </h3>
                  {!loading && <CopyButton textToCopy={email} />}
                </div>
                <p className="text-sm sm:text-base gray-text dark:text-[#858B9B]">
                  My Contact Mail
                </p>
              </Card>
            </div>

            {/* Map */}
            <Card className="p-3 sm:p-5 gradient-card dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] border border-gray-100/2 hover:gradient-hover transition-all duration-300 hover:scale-[1.01] group">
              <div className="relative h-64 sm:h-80 bg-muted rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.4048963886617!2d39.288293274209096!3d8.557007091486694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b21eaaaaaaaab%3A0x51e1d46f04051fe9!2sAdama%20University!5e0!3m2!1sen!2set!4v1758890120120!5m2!1sen!2set"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </Card>
          </div>

          {/* Right Side */}
          <Card className="p-4 sm:p-6 lg:px-7 gradient-card dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] border border-gray-100/2 hover:gradient-hover transition-all duration-300 hover:scale-[1.01] group">
            <div>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold black-text dark:text-[#CDD0DA] mb-2">
                  Send an E-mail
                </h2>
                <p className="text-sm sm:text-base gray-text dark:text-[#858B9B]">
                  for your inquiry and ideas
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-12 rounded-full placeholder:text-gray-400 px-5 text-sm sm:text-base"
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-12 rounded-full placeholder:text-gray-400 px-5 text-sm sm:text-base"
                    required
                  />
                </div>

                <Input
                  type="text"
                  name="budget"
                  placeholder="Budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="h-12 rounded-full placeholder:text-gray-400 px-5 text-sm sm:text-base"
                  required
                />

                <Textarea
                  name="description"
                  placeholder="Tell me about the project..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-28 sm:min-h-32 resize-none rounded-2xl placeholder:text-gray-400 p-4 text-sm sm:text-base"
                  required
                />

                <div className="pt-2 sm:pt-4">
                  {formStatus.message && (
                    <p
                      className={`mb-4 text-sm sm:text-base ${
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
                    className="h-12 w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 font-medium rounded-full px-6 py-3 text-sm sm:text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
