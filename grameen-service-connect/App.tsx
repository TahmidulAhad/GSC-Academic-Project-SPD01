import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SubmitRequestPage from "./pages/SubmitRequestPage";
import ProfileDashboard from "./pages/ProfileDashboard";
import MyRequestsPage from "./pages/MyRequestsPage";
import AllRequestsPage from "./pages/AllRequestsPage";
import AdminMessagesPage from "./pages/AdminMessagesPage";
import RequestDetailsPage from "./pages/RequestDetailsPage";

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/submit-request" element={<SubmitRequestPage />} />
              <Route path="/dashboard" element={<ProfileDashboard />} />
              <Route path="/my-requests" element={<MyRequestsPage />} />
              <Route path="/all-requests" element={<AllRequestsPage />} />
              <Route path="/requests/:id" element={<RequestDetailsPage />} />
              <Route path="/admin/messages" element={<AdminMessagesPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
