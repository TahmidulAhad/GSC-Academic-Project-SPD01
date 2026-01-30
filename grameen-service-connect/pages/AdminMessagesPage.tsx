import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../lib/api";
import { useAuthStore } from "../store/authStore";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const AdminMessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      !isAuthenticated ||
      (user?.role !== "admin" && user?.role !== "volunteer")
    ) {
      navigate("/");
      return;
    }

    const fetchMessages = async () => {
      try {
        const { messages: fetchedMessages } = await apiService.getAllMessages();
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Messages</h1>
          <p className="text-gray-600 mt-2">
            View all messages sent via the contact form
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No messages found
            </h3>
            <p className="text-gray-600">
              There are no messages from users yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-teal-600"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {msg.subject}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">From:</span> {msg.name} (
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-teal-600 hover:underline"
                      >
                        {msg.email}
                      </a>
                      )
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {new Date(msg.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPage;
