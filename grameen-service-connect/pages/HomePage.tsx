import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import RequestCard from "../components/RequestCard";
import TestimonialCard from "../components/TestimonialCard";
import { Request, Testimonial } from "../types";
import { apiService, ServiceRequest } from "../lib/api";
import { useRequestsStore } from "../store/requestsStore";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { requests: cachedRequests, setRequests } = useRequestsStore();
  const [recentRequests, setRecentRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    helpedPeople: 0,
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Use cached requests if available
        let allRequests: ServiceRequest[];

        if (cachedRequests.length > 0) {
          allRequests = cachedRequests;
        } else {
          const { requests } = await apiService.getAllRequests();
          setRequests(requests);
          allRequests = requests;
        }

        // Convert to display format and get latest 4
        const displayRequests: Request[] = allRequests
          .slice(0, 4)
          .map((req) => ({
            id: req.id,
            title:
              req.category.charAt(0).toUpperCase() +
              req.category.slice(1).replace("_", " "),
            requester: req.name,
            date: new Date(req.created_at).toLocaleDateString(),
            status:
              req.status === "pending"
                ? "Pending"
                : req.status === "in_progress"
                ? "In Progress"
                : req.status === "completed"
                ? "Completed"
                : "Pending",
          }));

        setRecentRequests(displayRequests);

        // Calculate stats
        setStats({
          total: allRequests.length,
          pending: allRequests.filter((r) => r.status === "pending").length,
          completed: allRequests.filter((r) => r.status === "completed").length,
          helpedPeople: allRequests.filter((r) => r.status === "completed")
            .length,
        });
      } catch (error) {
        console.error("Error fetching requests:", error);
        // Fallback to static data
        setRecentRequests([
          {
            id: 1,
            title: "Job Application Form",
            requester: "Kamal Hassan",
            date: "10/25/2025",
            status: "Pending",
          },
          {
            id: 2,
            title: "Bank Account Opening",
            requester: "Rahim Uddin",
            date: "10/25/2025",
            status: "Pending",
          },
          {
            id: 3,
            title: "Government Form",
            requester: "Shanti Devi",
            date: "10/24/2025",
            status: "Completed",
          },
          {
            id: 4,
            title: "Health Insurance",
            requester: "Fatima Begum",
            date: "10/23/2025",
            status: "Completed",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: t("home.testimonial1.quote"),
      author: t("home.testimonial1.author"),
      role: t("home.testimonial1.role"),
      avatar: "https://picsum.photos/id/237/100/100",
    },
    {
      id: 2,
      quote: t("home.testimonial2.quote"),
      author: t("home.testimonial2.author"),
      role: t("home.testimonial2.role"),
      avatar: "https://picsum.photos/id/238/100/100",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-teal-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              {t("home.title")}
            </h1>
            <p className="mt-4 text-lg text-gray-600">{t("home.subtitle")}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/submit-request"
                className="px-8 py-3 text-lg font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-all shadow-lg"
              >
                {t("home.requestHelp")}
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 text-lg font-semibold text-teal-600 bg-white border-2 border-teal-600 rounded-md hover:bg-teal-50 transition-all"
              >
                {t("home.joinVolunteer")}
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <img
              src="https://i.pinimg.com/1200x/a9/34/a2/a934a220eb65c6fdacb9e1adc3e9d8f9.jpg"
              alt="Village"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-teal-600">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600 mt-2">Total Requests</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <div className="text-sm text-gray-600 mt-2">Pending Help</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-600">
                {stats.completed}
              </div>
              <div className="text-sm text-gray-600 mt-2">Completed</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600">
                {stats.helpedPeople}
              </div>
              <div className="text-sm text-gray-600 mt-2">People Helped</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Help Requests Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">{t("home.recentRequests")}</h2>
            <Link
              to="/all-requests"
              className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2"
            >
              View All Requests →
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">
                No requests yet. Be the first to submit a request!
              </p>
              <Link
                to="/submit-request"
                className="inline-block px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Submit Request
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">
            {t("home.successStories")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
