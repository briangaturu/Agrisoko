import {type FormEvent, useState } from "react";
import emailjs from "@emailjs/browser";
import Header from "../components/Header";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement> | React.MouseEvent) => {
    event.preventDefault();

    console.log("handleSubmit fired");

    const form = document.querySelector("form") as HTMLFormElement;
    const formData = new FormData(form);

    const serviceId ="service_gt80srj";
    const templateId ="template_csvzfad";
    const publicKey ="tdGYX-EkAsuXbXuxN";

    console.log("ENV VALUES:", { serviceId, templateId, publicKey });

    if (!serviceId?.trim() || !templateId?.trim() || !publicKey?.trim()) {
      setStatusType("error");
      setStatusMessage("Email service is not configured yet. Please set EmailJS keys.");
      return;
    }

    const templateParams = {
      from_name: String(formData.get("name") || ""),
      from_email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      setIsSubmitting(true);
      setStatusMessage("");
      setStatusType("");

      await emailjs.send(serviceId, templateId, templateParams, { publicKey });

      setStatusType("success");
      setStatusMessage("Message sent successfully. We will get back to you soon.");
      form.reset();
    } catch (error) {
      console.error("EmailJS send failed:", error);
      setStatusType("error");
      setStatusMessage("Failed to send message. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-emerald-600 text-white py-20 relative overflow-hidden">

        {/* Decorative animated circles */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full animate-pulseSlow"></div>
        <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-white/5 rounded-full animate-pulseSlow"></div>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl">
            Have questions? Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Send a Message
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your full name"
                className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder="Subject of your message"
                className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                required
                placeholder="Write your message here..."
                className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none h-32"
              />
            </div>

            {statusMessage && (
              <p
                className={`text-sm ${
                  statusType === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {statusMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any)}
              disabled={isSubmitting}
              className="w-full py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;