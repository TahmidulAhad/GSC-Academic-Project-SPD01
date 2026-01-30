import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { useAuthStore } from "../store/authStore";
import Logo from "./Logo";
import Icon from "./Icon";

const Header: React.FC = () => {
  const { t, language, toggleLanguage } = useTranslation();
  const { isAuthenticated, user, logout: authLogout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    authLogout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", text: t("header.home") },
    { to: "/about", text: t("header.about") },
    { to: "/contact", text: t("header.contact") },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                {link.text}
              </Link>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
            >
              <Icon name="globe" className="h-5 w-5 mr-1" />
              {t("header.language")}
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-teal-600 border border-teal-600 rounded-md hover:bg-teal-50 transition-all"
                >
                  {t("header.volunteerLogin")}
                </Link>
                <Link
                  to="/submit-request"
                  className="px-4 py-2 text-sm text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-all"
                >
                  {t("header.helpNow")}
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={`http://localhost:5000/${user.avatar}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.fullName?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.fullName}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <p className="text-xs text-teal-600 capitalize mt-1">
                        {user?.role?.replace("_", " ")}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Icon name="user" className="inline h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      to="/all-requests"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Icon name="document" className="inline h-4 w-4 mr-2" />
                      All Requests
                    </Link>
                    {(user?.role === "admin" || user?.role === "volunteer") && (
                      <Link
                        to="/admin/messages"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Icon name="mail" className="inline h-4 w-4 mr-2" />
                        Messages
                      </Link>
                    )}
                    <Link
                      to="/my-requests"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Icon name="document" className="inline h-4 w-4 mr-2" />
                      My Requests
                    </Link>
                    <Link
                      to="/submit-request"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Icon name="plus" className="inline h-4 w-4 mr-2" />
                      New Request
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t"
                    >
                      <Icon name="logout" className="inline h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-teal-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block text-gray-600 hover:text-teal-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.text}
            </Link>
          ))}
          <button
            onClick={() => {
              toggleLanguage();
              setIsMenuOpen(false);
            }}
            className="flex items-center w-full text-left text-gray-600 hover:text-teal-600 transition-colors"
          >
            <Icon name="globe" className="h-5 w-5 mr-1" />
            {t("header.language")}
          </button>
          <div className="border-t pt-4 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="block text-center w-full px-4 py-2 text-sm text-teal-600 border border-teal-600 rounded-md hover:bg-teal-50 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("header.volunteerLogin")}
                </Link>
                <Link
                  to="/submit-request"
                  className="block text-center w-full px-4 py-2 text-sm text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("header.helpNow")}
                </Link>
              </>
            ) : (
              <>
                <div className="px-4 py-2 bg-gray-50 rounded">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link
                  to="/dashboard"
                  className="block text-center w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/all-requests"
                  className="block text-center w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Requests
                </Link>
                {(user?.role === "admin" || user?.role === "volunteer") && (
                  <Link
                    to="/admin/messages"
                    className="block text-center w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Messages
                  </Link>
                )}
                <Link
                  to="/my-requests"
                  className="block text-center w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Requests
                </Link>
                <Link
                  to="/submit-request"
                  className="block text-center w-full px-4 py-2 text-sm text-teal-600 border border-teal-600 rounded-md hover:bg-teal-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  New Request
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block text-center w-full px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
