import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "../hooks/useTranslation";
import Icon from "../components/Icon";
import { apiService } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useRequestsStore } from "../store/requestsStore";
import { useAuthStore } from "../store/authStore";

// Web Speech API interfaces for browsers that support it
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

const SubmitRequestPage: React.FC = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const addRequest = useRequestsStore((state) => state.addRequest);
  const { isAuthenticated, user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    category: "",
    location: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Auto-fill user's name
    if (user?.fullName) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName,
        contact: user.phone || "",
      }));
    }
  }, [isAuthenticated, user, navigate]);
  const [description, setDescription] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.match("image.*")) {
        setError("Only image files (JPEG, JPG, PNG) are allowed.");
        setSelectedFile(null);
        return;
      }
      setError("");
      setSelectedFile(file);
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === "bn" ? "bn-BD" : "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setDescription((prev) => prev + finalTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      alert(t("submit.voiceError"));
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [language, t]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Error starting speech recognition:", e);
        setIsListening(false);
        alert(t("submit.voiceError"));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const newRequest = await apiService.createRequest({
        name: formData.name,
        contact: formData.contact || undefined,
        category: formData.category,
        description: description,
        location: formData.location || undefined,
        document: selectedFile,
      });

      // Add request to Zustand store immediately
      // apiService.createRequest may return { message, request }, so extract request if present
      const createdRequest = (newRequest as any).request ?? newRequest;
      addRequest(createdRequest);

      setSuccess(
        "Request submitted successfully! A volunteer will contact you soon."
      );
      // Reset form
      setFormData({ name: "", contact: "", category: "", location: "" });
      setDescription("");

      // Redirect to my requests page after 2 seconds
      setTimeout(() => navigate("/my-requests"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {t("submit.title")}
            </h1>
            <p className="mt-2 text-gray-600">{t("submit.subtitle")}</p>
          </div>

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
                {t("submit.yourName")}
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("submit.yourName.placeholder")}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700"
              >
                {t("submit.phoneEmail")}
              </label>
              <input
                type="text"
                name="contact"
                id="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder={t("submit.phoneEmail.placeholder")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                {t("submit.helpWith")}
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">{t("submit.helpWith.placeholder")}</option>
                <option value="job">Job Application Form</option>
                <option value="bank">Bank Account Opening</option>
                <option value="gov">Government Form</option>
                <option value="health">Health Insurance</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="relative">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                {t("submit.describe")}
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("submit.describe.placeholder")}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              ></textarea>
              <button
                type="button"
                onClick={toggleListening}
                title={
                  isListening ? "Stop voice input" : t("submit.voiceInput")
                }
                className={`absolute bottom-3 right-3 p-2 rounded-full transition-all shadow-md ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse hover:bg-red-600"
                    : "bg-teal-100 text-teal-700 hover:bg-teal-200"
                }`}
              >
                {isListening ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 10h6v4H9z"
                    />
                  </svg>
                ) : (
                  <Icon name="microphone" className="h-5 w-5" />
                )}
              </button>
              {isListening && (
                <span className="absolute bottom-14 right-3 text-xs text-red-600 font-semibold bg-white px-2 py-1 rounded shadow-md animate-pulse">
                  🔴 {t("submit.voiceListening")} - Click to stop
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                {t("submit.location")}
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={t("submit.location.placeholder")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("submit.upload")}
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Icon
                    name="upload"
                    className="mx-auto h-12 w-12 text-gray-400"
                  />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
                    >
                      <span>
                        {selectedFile
                          ? selectedFile.name
                          : t("submit.upload.cta")}
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/jpg"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : t("submit.submitButton")}
            </button>
          </form>
        </div>

        <div className="text-center mt-8 border-t pt-6">
          <h3 className="font-semibold text-gray-700">
            {t("submit.needHelpForm")}
          </h3>
          <p className="text-gray-600">
            {t("submit.callSupport")}{" "}
            <a
              href="tel:+8801234567890"
              className="text-teal-600 font-bold hover:underline"
            >
              +880 1234-567890
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmitRequestPage;
