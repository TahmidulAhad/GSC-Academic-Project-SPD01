import React, { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { apiService } from "../lib/api";

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-500 hover:text-teal-600"
  >
    {children}
  </a>
);

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await apiService.sendMessage(formData);
      setSuccess("Message sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">
            {t("contact.title")}
          </h1>
          <p className="mt-2 text-lg text-gray-600">{t("contact.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("contact.yourName")}
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("contact.yourName.placeholder")}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("contact.yourEmail")}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("contact.yourEmail.placeholder")}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("contact.subject")}
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t("contact.subject.placeholder")}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("contact.message")}
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("contact.message.placeholder")}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : t("contact.sendMessage")}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-teal-50 p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t("contact.info")}
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>{t("contact.email")}:</strong>{" "}
                  support@grameenconnect.bd
                </p>
                <p>
                  <strong>{t("contact.phone")}:</strong> +880 1234-567890
                </p>
                <p>
                  <strong>{t("contact.address")}:</strong> Chattogram,
                  Bangladesh
                </p>
                <p>
                  <strong>{t("contact.officeHours")}:</strong>{" "}
                  {t("contact.officeHours.value")}
                </p>
              </div>
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t("contact.followUs")}
                </h3>
                <div className="flex space-x-4">
                  <SocialIcon href="#">
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.494v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon href="#">
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.218 3.801 4.654-.707.192-1.465.222-2.228.084.628 1.956 2.444 3.379 4.6 3.419-1.818 1.422-4.12 2.053-6.521 1.732 2.013 1.295 4.408 2.048 6.962 2.048 8.354 0 12.92-6.924 12.92-12.92 0-.195-.005-.39-.014-.583.884-.636 1.65-1.425 2.257-2.341z" />
                    </svg>
                  </SocialIcon>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800">
                {t("contact.commitment")}
              </h2>
              <p className="mt-2 text-gray-700">
                {t("contact.commitment.text")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
