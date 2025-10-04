"use server";

import emailjs from "@emailjs/browser";

interface EmailData {
  name: string;
  email: string;
  budget: string;
  message: string;
  time?: string;
}

export async function sendEmail(data: EmailData) {
  try {
    // Validate environment variables
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error("EmailJS configuration is missing");
    }

    // Send email using EmailJS
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        from_name: data.name,
        from_email: data.email,
        budget: data.budget,
        message: data.message,
        time: data.time,
      },
      publicKey
    );

    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Failed to send email. Please try again later.",
    };
  }
}
