"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import axios from "axios";
import Spinner from "@/components/Spinner";

const contactInfo = [
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email",
    detail: "voskiveriga@gmail.com",
    link: "mailto:voskiveriga@gmail.com",
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Phone",
    detail: "+91 88068 99797",
    link: "tel:+918806899797",
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "WhatsApp",
    detail: "Chat with our support team",
    link: "https://wa.me/918806899797",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Address",
    detail:
      "Ground Floor, Vakratund Residency, Jagdamba Chowk, Malwadi, Wadgaonsheri, Pune, Maharashtra 411014",
    link: "https://www.google.com/maps/place/Voski+Veriga/@18.5421592,73.9236865,17z/data=!4m14!1m7!3m6!1s0x3bc2c151029691c1:0x56de03c82d07cdd2!2sVoski+Veriga!8m2!3d18.5421592!4d73.9262614!16s%2Fg%2F11xh24q5y2!3m5!1s0x3bc2c151029691c1:0x56de03c82d07cdd2!8m2!3d18.5421592!4d73.9262614!16s%2Fg%2F11xh24q5y2?entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Hours",
    detail: "Monday to Saturday, 9:00 AM - 6:00 PM",
  },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await axios.post("/api/v1/contact/add-contact", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Contact form error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Contact
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Get in touch with Voskiveriga
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Need help with a product, installation, warranty, bulk order, or
            delivery? Send us a message and our team will reply soon.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <h2 className="text-2xl font-semibold">Contact details</h2>
          <p className="mt-3 text-gray-600">
            Choose the easiest way to reach us. For faster support, include your
            order ID or product model in your message.
          </p>

          <div className="mt-8 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
            {contactInfo.map((item) => {
              const content = (
                <>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-800">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {item.detail}
                    </p>
                  </div>
                </>
              );

              return item.link ? (
                <a
                  key={item.title}
                  href={item.link}
                  target={item.link.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.link.startsWith("http") ? "noreferrer" : undefined
                  }
                  className="flex gap-4 p-5 transition-colors hover:bg-gray-50"
                >
                  {content}
                </a>
              ) : (
                <div key={item.title} className="flex gap-4 p-5">
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold">Send a message</h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="Tell us what you need..."
              />
            </div>

            {submitStatus === "success" && (
              <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4 text-green-700">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>Message sent successfully. We will get back to you soon.</p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>Something went wrong. Please try again.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <iframe
            title="Voski Veriga Location"
            src="https://www.google.com/maps?q=18.5421592,73.9262614&output=embed"
            className="h-72 w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
