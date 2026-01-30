import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService, ServiceRequest } from "../lib/api";
import { useTranslation } from "../hooks/useTranslation";
import Icon from "../components/Icon";

const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        if (!id) return;
        const data = await apiService.getRequestById(parseInt(id));
        setRequest(data);
      } catch (err: any) {
        setError(err.message || "Failed to load request details");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">
            {error || "Request not found"}
          </span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Go Back
        </button>
      </div>
    );
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Assuming the backend runs on localhost:5000
  const API_BASE_URL = "http://localhost:5000";

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-teal-600 hover:text-teal-800 transition-colors"
        >
          <Icon name="arrow-left" className="h-5 w-5 mr-2" />
          Back to Requests
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-teal-600 px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Request Details</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                request.status
              )}`}
            >
              {request.status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Requester Name
                </h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {request.requester_name || request.name}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 text-lg text-gray-900 capitalize">
                  {request.category}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Date Submitted
                </h3>
                <p className="mt-1 text-gray-900">
                  {formatDate(request.created_at)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="mt-1 text-gray-900">
                  {request.location || "Not specified"}
                </p>
              </div>

              {request.contact && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Contact Info
                  </h3>
                  <p className="mt-1 text-gray-900">{request.contact}</p>
                </div>
              )}

              {request.volunteer_name && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Assigned Volunteer
                  </h3>
                  <p className="mt-1 text-gray-900">{request.volunteer_name}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Description
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {request.description}
                </p>
              </div>
            </div>

            {request.document_path && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Attached Document
                </h3>
                <div className="border rounded-lg overflow-hidden bg-gray-100 flex justify-center">
                  <img
                    src={`${API_BASE_URL}/${request.document_path}`}
                    alt="Request Attachment"
                    className="max-w-full h-auto max-h-[500px] object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x300?text=Image+Not+Found";
                    }}
                  />
                </div>
                <div className="mt-2 text-right">
                  <a
                    href={`${API_BASE_URL}/${request.document_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline text-sm flex items-center justify-end"
                  >
                    <Icon name="external-link" className="h-4 w-4 mr-1" />
                    View Full Size
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsPage;
