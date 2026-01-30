import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { apiService } from "../lib/api";
import { useAuthStore } from "../store/authStore";

const DemoLoginCard: React.FC<{
  role: string;
  email: string;
  pass: string;
}> = ({ role, email, pass }) => (
  <div className="border-l-4 border-teal-500 pl-4 py-2">
    <h4 className="font-semibold">{role}</h4>
    <p className="text-sm text-gray-600">{email}</p>
    <p className="text-sm text-gray-600">Pass: {pass}</p>
  </div>
);

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiService.login(email, password);
      login(response.user, response.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel - Demo Info */}
        <div className="w-full md:w-1/3 bg-teal-50 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {t("login.tagline")}
            </h2>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-700">
                {t("login.demo")}
              </h3>
              <DemoLoginCard
                role={t("login.helpSeeker")}
                email="kamal@example.com"
                pass="seeker123"
              />
              <DemoLoginCard
                role={t("login.volunteer")}
                email="ayesha@volunteer.com"
                pass="volunteer123"
              />
              <DemoLoginCard
                role={t("login.admin")}
                email="admin@grameen.com"
                pass="admin123"
              />
            </div>
          </div>
          <Link
            to="/"
            className="text-sm text-teal-600 hover:underline mt-8 block"
          >
            &larr; {t("login.backHome")}
          </Link>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-2/3 p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {t("login.title")}
          </h2>
          <p className="text-center text-gray-500 mb-8">
            {t("login.subtitle")}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("contact.yourEmail.placeholder")}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("login.password.placeholder")}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : t("login.button")}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            {t("login.noAccount")}{" "}
            <Link
              to="/register"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              {t("login.register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
