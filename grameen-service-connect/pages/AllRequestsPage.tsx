import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiService, ServiceRequest } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useRequestsStore } from "../store/requestsStore";

const AllRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { requests: cachedRequests, setRequests: setCachedRequests } =
    useRequestsStore();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "in_progress" | "completed"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchRequests = async () => {
      try {
        // Use cached requests if available
        if (cachedRequests.length > 0) {
          setRequests(cachedRequests);
          setLoading(false);
          return;
        }

        // Otherwise fetch from API
        const { requests: allRequests } = await apiService.getAllRequests();
        setCachedRequests(allRequests); // Store in Zustand
        setRequests(allRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [isAuthenticated, navigate, cachedRequests.length]);

  // Filter requests by status and category
  const filteredRequests = requests.filter((r) => {
    const statusMatch = filter === "all" || r.status === filter;
    const categoryMatch =
      categoryFilter === "all" || r.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const categories = [
    "all",
    ...Array.from(new Set(requests.map((r) => r.category))),
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      job: "💼",
      bank: "🏦",
      gov: "📋",
      health: "🏥",
      education: "🎓",
      legal: "⚖️",
      other: "📌",
    };
    return icons[category] || "📄";
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await apiService.updateRequestStatus(id, newStatus, user?.id);

      // Update local state
      const updatedRequests = requests.map((req) =>
        req.id === id ? { ...req, status: newStatus as any } : req
      );
      setRequests(updatedRequests);
      setCachedRequests(updatedRequests);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update request status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading all service requests...</p>
        </div>
      </div>
    );
  }

  const isVolunteer = user?.role === "volunteer" || user?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              All Service Requests
            </h1>
            <p className="text-gray-600 mt-2">
              {isVolunteer
                ? "Help people by responding to their requests"
                : "Browse all service requests from the community"}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/my-requests"
              className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all flex items-center gap-2"
            >
              My Requests
            </Link>
            <Link
              to="/submit-request"
              className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              New Request
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="space-y-4">
            {/* Status Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Filter by Status:
              </h3>
              <div className="flex flex-wrap gap-2">
                {["all", "pending", "in_progress", "completed"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status as any)}
                      className={`px-4 py-2 rounded-md font-medium transition-all ${
                        filter === status
                          ? "bg-teal-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status.replace("_", " ").charAt(0).toUpperCase() +
                        status.slice(1).replace("_", " ")}
                      <span className="ml-2 text-sm">
                        (
                        {status === "all"
                          ? requests.length
                          : requests.filter((r) => r.status === status).length}
                        )
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Filter by Category:
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-4 py-2 rounded-md font-medium transition-all capitalize ${
                      categoryFilter === category
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category === "all" ? "All Categories" : category}
                    <span className="ml-2 text-sm">
                      (
                      {category === "all"
                        ? requests.length
                        : requests.filter((r) => r.category === category)
                            .length}
                      )
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No requests found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all" && categoryFilter === "all"
                ? "There are no service requests yet."
                : `No requests match your filters.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 border-l-4 border-teal-600"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {getCategoryIcon(request.category)}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 capitalize">
                        {request.category.replace("-", " ")}
                      </h3>
                      <p className="text-xs text-gray-500">ID: #{request.id}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 line-clamp-3 mb-3">
                    {request.description}
                  </p>{" "}
                  <Link
                    to={`/requests/${request.id}`}
                    className="text-sm text-teal-600 hover:text-teal-800 hover:underline mb-3 block"
                  >
                    View Details
                  </Link>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">👤 Requester:</span>{" "}
                      {request.name}
                    </p>
                    {request.location && (
                      <p className="text-gray-600">
                        <span className="font-medium">📍 Location:</span>{" "}
                        {request.location}
                      </p>
                    )}
                    {request.contact && (
                      <p className="text-gray-600">
                        <span className="font-medium">📞 Contact:</span>{" "}
                        {request.contact}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs">
                      <span className="font-medium">📅 Submitted:</span>{" "}
                      {new Date(request.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {isVolunteer && request.status === "pending" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(request.id, "in_progress")
                    }
                    className="w-full py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all text-sm font-medium"
                  >
                    Offer Help
                  </button>
                )}

                {request.status === "in_progress" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Being processed
                    </div>
                    {isVolunteer && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(request.id, "completed")
                        }
                        className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all text-sm font-medium"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                )}

                {request.status === "completed" && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Completed
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Overall Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border">
              <div className="text-3xl font-bold text-gray-800">
                {requests.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Requests</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600">
                {requests.filter((r) => r.status === "pending").length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Pending Help</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">
                {requests.filter((r) => r.status === "in_progress").length}
              </div>
              <div className="text-sm text-gray-600 mt-1">In Progress</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">
                {requests.filter((r) => r.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRequestsPage;
