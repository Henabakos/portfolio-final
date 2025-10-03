"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Copy, Check } from "lucide-react";
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
      setTimeout(() => setIsCopied(false), 2000); // Reset state after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      // Compact styling for embedding next to text
      className={`p-1 rounded-md transition-colors duration-300 flex-shrink-0 ml-2 ${
        isCopied
          ? "bg-green-100 text-green-700" // Success state
          : "bg-transparent text-muted-foreground/60 hover:text-foreground" // Default state
      } ${className}`}
      aria-label={`Copy ${textToCopy}`}
      disabled={isCopied}
    >
      {/* Reduced icon size for better inline fit */}
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
// ------------------------------------------------------

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "", // Replaced subject with budget
    description: "",
  });
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Define contact data for easier use
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

    // Add current time for the email
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
          message: formData.description, // Using description as the message content
          time: timeString, // Include current time
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
    <div className="min-h-screen ">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-5 max-w-7xl mx-auto">
          {/* Left Side - Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Information Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Phone Card */}
              <Card className="p-5 text-start bg-card border-border hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 items-center justify-center flex gradient-card border border-gray-200 rounded-full">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                {/* FIX: Use flex to align text and button */}
                <div className="flex items-center justify-start gap-2 mb-2">
                  <h3 className="text-[24px] leading-[32px] font-[600] black-text">
                    {loading ? "..." : phone}
                  </h3>
                  {/* Individual Copy Button for Phone */}
                  {!loading && <CopyButton textToCopy={phone} />}
                </div>
                <p className="text-[16px] leading-[30px] gray-text">
                  Phone Number
                </p>
              </Card>

              {/* Email Card */}
              <Card className="p-5 text-start bg-card border-border hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 items-center justify-center flex gradient-card border border-gray-200 rounded-full">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                {/* FIX: Use flex to align text and button, ensuring responsive truncation */}
                <div className="flex items-center justify-start gap-2 mb-2">
                  {/* Email text uses flex-grow and truncate to ensure it handles long addresses */}
                  <h3 className="text-[24px] leading-[32px] font-[600] black-text max-w-full overflow-hidden truncate flex-grow">
                    {loading ? "..." : email}
                  </h3>
                  {/* Individual Copy Button for Email */}
                  {!loading && <CopyButton textToCopy={email} />}
                </div>
                <p className="text-[16px] leading-[30px] gray-text">
                  My Contact Mail
                </p>
              </Card>
            </div>

            {/* Map Section */}
            <Card className="p-4 sm:p-6 lg:p-2 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] group mb-4 sm:mb-10 flex-1">
              <div className="space-y-4">
                <div className="relative h-80 bg-muted rounded-lg overflow-hidden">
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
              </div>
            </Card>
          </div>

          {/* Right Side - Contact Form */}
          <Card className="p-4 sm:p-6 lg:px-7 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] group mb-4 sm:mb-10 flex-1">
            <div className="">
              <div className="mb-8">
                <h2 className="text-[24px] font-[700] black-text leading-[32px] mb-2">
                  Send an E-mail
                </h2>
                <p className="text-[16px] gray-text leading-[30px]">
                  for your inquiry and ideas
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-12 bg-background border-border focus:border-none rounded-full placeholder:text-gray-400 p-6"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 bg-background border-border rounded-full placeholder:text-gray-400 p-6"
                      required
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <Input
                    type="text"
                    name="budget"
                    placeholder="Budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="h-12 bg-background border-border rounded-full placeholder:text-gray-400 p-6"
                    required
                  />
                </div>

                {/* Description (mapped to message) */}
                <div>
                  <Textarea
                    name="description"
                    placeholder="Tell me about the project..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="min-h-32 bg-background border-border resize-none placeholder:text-gray-400 rounded-2xl p-5"
                    required
                  />
                </div>

                {/* Submit Button and Status Message */}
                <div className="pt-4">
                  {formStatus.message && (
                    <p
                      className={`mb-4 text-sm ${
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
                    className="h-12 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-full px-6 py-3"
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
