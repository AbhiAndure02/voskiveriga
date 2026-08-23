"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Navigation,
  Building2,
  Headphones,
  Wrench,
  Globe2,
} from "lucide-react";
import Spinner from "@/components/Spinner";
import axios from "axios";

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

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: ["voskiveriga@gmail.com"],
      link: "mailto:voskiveriga@gmail.com",
      linkLabel: "Send Email",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: ["+918806899797", "+918261066737"],
      link: "tel:+918806899797",
      linkLabel: "Call Now",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "WhatsApp Support",
      details: ["Product guidance", "Order and installation help"],
      link: "https://wa.me/918806899797",
      linkLabel: "Open WhatsApp",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: [
        "Voski Veriga, Ground Floor, Vakratund Residency, Jagdamba Chowk, Malwadi, Wadgaonsheri, Pune, Maharashtra 411014",
      ],
      link: "https://www.google.com/maps/place/Voski+Veriga/@18.5421592,73.9236865,17z/data=!4m14!1m7!3m6!1s0x3bc2c151029691c1:0x56de03c82d07cdd2!2sVoski+Veriga!8m2!3d18.5421592!4d73.9262614!16s%2Fg%2F11xh24q5y2!3m5!1s0x3bc2c151029691c1:0x56de03c82d07cdd2!8m2!3d18.5421592!4d73.9262614!16s%2Fg%2F11xh24q5y2?entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D",
      linkLabel: "Get Directions",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: [
        "Monday to Saturday: 9:00 AM - 6:00 PM",
        "Sunday: Closed",
        "Emergency support by appointment",
      ],
    },
  ];

  const supportDetails = [
    {
      icon: <Building2 className="w-5 h-5" />,
      title: "Company",
      value: "Voskiveriga Water Tech",
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: "Support For",
      value:
        "Orders, coupons, billing, installation, warranty, and product selection",
    },
    {
      icon: <Wrench className="w-5 h-5" />,
      title: "Service Coverage",
      value:
        "Home, commercial, and industrial electromagnetic water descaler requirements",
    },
    {
      icon: <Globe2 className="w-5 h-5" />,
      title: "Delivery",
      value: "Pan-India shipping and tracking through Shiprocket",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl mb-4">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Contact Voskiveriga for product guidance, bulk orders, installation
            support, warranty help, and order tracking assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <div className="space-y-2">
                  {item.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">
                      {detail}
                    </p>
                  ))}
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    target={item.link.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.link.startsWith("http") ? "noreferrer" : undefined
                    }
                    className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    {item.linkLabel}
                  </a>
                )}
              </div>
            ))}

            <div className="bg-slate-950 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <a
                  href="tel:+918806899797"
                  className="flex items-center justify-between rounded-xl bg-white/10 hover:bg-white/15 px-4 py-3 transition"
                >
                  <span className="font-medium">Call Sales Support</span>
                  <Phone className="w-4 h-4 text-cyan-300" />
                </a>
                <a
                  href="https://wa.me/918806899797"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/10 hover:bg-white/15 px-4 py-3 transition"
                >
                  <span className="font-medium">Chat on WhatsApp</span>
                  <MessageCircle className="w-4 h-4 text-cyan-300" />
                </a>
                <a
                  href="https://www.google.com/maps?q=18.5421592,73.9262614"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/10 hover:bg-white/15 px-4 py-3 transition"
                >
                  <span className="font-medium">Open Location</span>
                  <Navigation className="w-4 h-4 text-cyan-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>

                {/* Submit Status Messages */}
                {submitStatus === "success" && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <p>
                      Message sent successfully! We will get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <p>Something went wrong. Please try again.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportDetails.map((detail) => (
                <div
                  key={detail.title}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md p-5 flex gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    {detail.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {detail.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {[
                  {
                    q: "What's your typical response time?",
                    a: "We aim to respond within 24 hours during business days.",
                  },
                  {
                    q: "Can I get help choosing the right descaler?",
                    a: "Yes. Share your pipe size, application, and water usage, and our team will suggest the right model.",
                  },
                  {
                    q: "Do you support bulk or business orders?",
                    a: "Yes. We handle home, commercial, and industrial requirements with GST invoicing support.",
                  },
                  {
                    q: "Can I track my order after purchase?",
                    a: "Yes. Use the Track Order page with your order ID or Shiprocket AWB number.",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white/50 backdrop-blur-sm p-4 rounded-lg"
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {faq.q}
                    </h4>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <iframe
              title="Voski Veriga Location"
              src="https://www.google.com/maps?q=18.5421592,73.9262614&output=embed"
              className="w-full h-64 md:h-80 border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
