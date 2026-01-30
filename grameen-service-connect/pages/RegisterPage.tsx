import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { apiService } from "../lib/api";
import { useAuthStore } from "../store/authStore";

const RoleInfoCard: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="text-center">
    <div className="mx-auto bg-teal-100 rounded-full h-16 w-16 flex items-center justify-center mb-3">
      {/* Placeholder icon */}
      <svg
        className="h-8 w-8 text-teal-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
    <h3 className="font-semibold text-lg">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [role, setRole] = useState("help_seeker");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        role: role,
        location: formData.location || undefined,
      });

      login(response.user, response.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-5xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel - Info */}
        <div className="w-full md:w-2/5 bg-teal-50 p-8 flex flex-col justify-center items-center text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t("register.tagline")}
          </h2>
          <div className="space-y-8">
            <RoleInfoCard
              title={t("register.helpSeeker")}
              description={t("register.helpSeeker.desc")}
            />
            <RoleInfoCard
              title={t("register.volunteer")}
              description={t("register.volunteer.desc")}
            />
          </div>
          <Link
            to="/"
            className="text-sm text-teal-600 hover:underline mt-8 block"
          >
            &larr; {t("login.backHome")}
          </Link>
        </div>

        {/* Right Panel - Register Form */}
        <div className="w-full md:w-3/5 p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {t("register.title")}
          </h2>
          <p className="text-center text-gray-500 mb-8">
            {t("register.subtitle")}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                {t("register.fullName")}
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={t("register.fullName.placeholder")}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t("login.email")}
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
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                {t("register.phone")}
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("register.phone.placeholder")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location (Optional)
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, District"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("register.joinAs")}
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <label
                  htmlFor="help_seeker"
                  className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none ${
                    role === "help_seeker"
                      ? "border-teal-500 ring-2 ring-teal-500"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    id="help_seeker"
                    value="help_seeker"
                    checked={role === "help_seeker"}
                    onChange={(e) => setRole(e.target.value)}
                    className="sr-only"
                    aria-labelledby="help_seeker-label"
                  />
                  <span id="help_seeker-label" className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">
                        {t("register.helpSeeker")}
                      </span>
                    </span>
                  </span>
                </label>
                <label
                  htmlFor="volunteer"
                  className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none ${
                    role === "volunteer"
                      ? "border-teal-500 ring-2 ring-teal-500"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    id="volunteer"
                    value="volunteer"
                    checked={role === "volunteer"}
                    onChange={(e) => setRole(e.target.value)}
                    className="sr-only"
                    aria-labelledby="volunteer-label"
                  />
                  <span id="volunteer-label" className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">
                        {t("register.volunteer")}
                      </span>
                    </span>
                  </span>
                </label>
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {t("login.password")}
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("login.password.placeholder")}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                {t("register.confirmPassword")}
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t("register.confirmPassword.placeholder")}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-all shadow-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : t("register.createAccount")}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            {t("register.haveAccount")}{" "}
            <Link
              to="/login"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              {t("register.login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
