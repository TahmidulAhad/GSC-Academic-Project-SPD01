import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiService, ServiceRequest } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useRequestsStore } from "../store/requestsStore";

const MyRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { requests: allRequests, setRequests: setAllRequests } =
    useRequestsStore();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "in_progress" | "completed"
  >("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchRequests = async () => {
      try {
        // Use cached requests if available
        if (allRequests.length > 0) {
          const userRequests = allRequests.filter(
            (r) => r.name === user?.fullName
          );
          setRequests(userRequests);
          setLoading(false);
          return;
        }

        // Otherwise fetch from API
        const { requests: fetchedRequests } = await apiService.getAllRequests();

        setAllRequests(fetchedRequests); // Store in Zustand
        const userRequests = fetchedRequests.filter(
          (r) => r.name === user?.fullName
        );
        setRequests(userRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [isAuthenticated, navigate, user]);

  const filteredRequests =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "government-form": "📋",
      banking: "🏦",
      education: "🎓",
      healthcare: "🏥",
      job: "💼",
      legal: "⚖️",
      other: "📌",
    };
    return icons[category] || "📄";
  };

  const handleCancelRequest = async (id: number) => {
    if (!window.confirm("Are you sure you want to cancel this request?"))
      return;

    try {
      await apiService.updateRequestStatus(id, "cancelled");

      // Update local state
      const updatedRequests = requests.map((req) =>
        req.id === id ? { ...req, status: "cancelled" as any } : req
      );
      setRequests(updatedRequests);
      setAllRequests(updatedRequests);
    } catch (error) {
      console.error("Failed to cancel request:", error);
      alert("Failed to cancel request");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Service Requests
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage your service requests
            </p>
          </div>
          <Link
            to="/submit-request"
            className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            New Request
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {["all", "pending", "in_progress", "completed"].map((status) => (
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
            ))}
          </div>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No requests found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "You haven't submitted any service requests yet."
                : `You don't have any ${filter.replace("_", " ")} requests.`}
            </p>
            <Link
              to="/submit-request"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all"
            >
              Submit Your First Request
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-teal-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">
                        {getCategoryIcon(request.category)}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 capitalize">
                          {request.category.replace("-", " ")}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Submitted on{" "}
                          {new Date(request.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{request.description}</p>
                    {request.location && (
                      <p className="text-sm text-gray-600 mb-2">
                        📍 <span className="font-medium">Location:</span>{" "}
                        {request.location}
                      </p>
                    )}
                    {request.contact && (
                      <p className="text-sm text-gray-600">
                        📞 <span className="font-medium">Contact:</span>{" "}
                        {request.contact}
                      </p>
                    )}
                  </div>
                  <div className="ml-6 flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      ID: #{request.id}
                    </span>
                    <Link
                      to={`/requests/${request.id}`}
                      className="text-xs text-teal-600 hover:text-teal-800 hover:underline mt-1"
                    >
                      View Details
                    </Link>
                    {request.status === "pending" && (
                      <button
                        onClick={() => handleCancelRequest(request.id)}
                        className="text-xs text-red-600 hover:text-red-800 hover:underline mt-1"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          request.status === "pending"
                            ? "bg-yellow-500"
                            : request.status === "in_progress" ||
                              request.status === "completed"
                            ? "bg-teal-600"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span
                        className={
                          request.status === "pending"
                            ? "font-semibold"
                            : "text-gray-500"
                        }
                      >
                        Submitted
                      </span>
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 mx-2">
                      <div
                        className={`h-full ${
                          request.status === "in_progress" ||
                          request.status === "completed"
                            ? "bg-teal-600"
                            : "bg-gray-200"
                        }`}
                        style={{
                          width: request.status === "pending" ? "0%" : "100%",
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          request.status === "in_progress"
                            ? "bg-blue-500"
                            : request.status === "completed"
                            ? "bg-teal-600"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span
                        className={
                          request.status === "in_progress"
                            ? "font-semibold"
                            : "text-gray-500"
                        }
                      >
                        In Progress
                      </span>
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 mx-2">
                      <div
                        className={`h-full ${
                          request.status === "completed"
                            ? "bg-teal-600"
                            : "bg-gray-200"
                        }`}
                        style={{
                          width: request.status === "completed" ? "100%" : "0%",
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          request.status === "completed"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span
                        className={
                          request.status === "completed"
                            ? "font-semibold"
                            : "text-gray-500"
                        }
                      >
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {requests.length}
              </div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {requests.filter((r) => r.status === "pending").length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {requests.filter((r) => r.status === "in_progress").length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {requests.filter((r) => r.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRequestsPage;
