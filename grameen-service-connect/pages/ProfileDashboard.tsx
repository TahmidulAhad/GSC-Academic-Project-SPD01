import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { apiService, ServiceRequest } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useRequestsStore } from "../store/requestsStore";

const ProfileDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { requests: allRequests, setRequests } = useRequestsStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myRequests, setMyRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Fetch user's requests
    const fetchRequests = async () => {
      try {
        const { requests } = await apiService.getUserRequests();
        setMyRequests(requests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [isAuthenticated, navigate]);

  const [profile, setProfile] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    role: user?.role?.replace("_", " ") || "",
    location: user?.location || "Bangladesh",
    bio: user?.bio || "Member of Grameen Service Connect community.",
    avatar: user?.avatar || "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [settings, setSettings] = useState({
    emailNotifications: true,
    showProfilePublic: true,
  });

  const recentActivities = myRequests
    .slice(0, 5)
    .map(
      (req, i) =>
        `${req.status === "pending" ? "Submitted" : "Updated"} request: ${
          req.category
        } - ${req.description.substring(0, 40)}...`
    );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      if (profile.name !== user?.fullName) {
        formData.append("fullName", profile.name);
      }
      if (profile.location) {
        formData.append("location", profile.location);
      }
      if (profile.bio) {
        formData.append("bio", profile.bio);
      }
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const response = await apiService.updateProfileWithAvatar(formData);
      
      // Update user in store
      useAuthStore.getState().setUser({
        ...user!,
        fullName: response.user.fullName,
        location: response.user.location,
        avatar: response.user.avatar,
        bio: response.user.bio,
      });

      setProfile({
        ...profile,
        name: response.user.fullName,
        location: response.user.location || "Bangladesh",
        bio: response.user.bio || "Member of Grameen Service Connect community.",
        avatar: response.user.avatar || "",
      });

      setEditing(false);
      setSelectedFile(null);
      setPreviewUrl("");
      alert("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(error.message || "Failed to update profile");
    }
  };

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative group">
            {previewUrl || profile.avatar ? (
              <img
                src={previewUrl || `http://localhost:5000/${profile.avatar}`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-4xl text-gray-400">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
            {editing && (
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <span className="text-white text-sm">Change</span>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
            <p className="text-sm text-gray-600">
              {profile.role} • {profile.location}
            </p>
            <p className="text-sm text-gray-600 mt-1">{profile.email}</p>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => setEditing((v) => !v)}
              className="px-4 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700"
            >
              {editing
                ? t("profile.cancel" as any) ?? "Cancel"
                : t("profile.editProfile" as any) ?? "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/submit-request"
            className="flex items-center gap-3 p-4 bg-teal-50 border-2 border-teal-200 rounded-lg hover:bg-teal-100 transition-all"
          >
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">+</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">New Request</h3>
              <p className="text-sm text-gray-600">Submit a service request</p>
            </div>
          </Link>
          <Link
            to="/all-requests"
            className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-all"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📋</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">All Requests</h3>
              <p className="text-sm text-gray-600">Browse all requests</p>
            </div>
          </Link>
          <Link
            to="/my-requests"
            className="flex items-center gap-3 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-all"
          >
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📝</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">My Requests</h3>
              <p className="text-sm text-gray-600">View your submissions</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {t("profile.about" as any) ?? "About"}
              </h2>
              {!editing ? (
                <p className="text-gray-700">{profile.bio}</p>
              ) : (
                <form onSubmit={saveProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    {selectedFile && (
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("profile.name" as any) ?? "Name"}
                    </label>
                    <input
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("profile.bio" as any) ?? "Bio"}
                    </label>
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 text-white rounded-md"
                    >
                      {t("profile.save" as any) ?? "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 bg-gray-200 rounded-md"
                    >
                      {t("profile.cancel" as any) ?? "Cancel"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Requests
                </h2>
                <Link
                  to="/my-requests"
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  View All →
                </Link>
              </div>
              {myRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-3">
                    You haven't submitted any requests yet.
                  </p>
                  <Link
                    to="/submit-request"
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Submit your first request →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myRequests.slice(0, 5).map((req) => (
                    <div
                      key={req.id}
                      className="p-4 bg-white rounded-md border border-gray-200 hover:border-teal-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800 capitalize">
                          {req.category.replace("-", " ")}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            req.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : req.status === "in_progress"
                              ? "bg-blue-100 text-blue-800"
                              : req.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {req.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {req.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(req.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-md font-semibold text-gray-800 mb-4">
                {t("profile.stats" as any) ?? "Stats"}
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {myRequests.length}
                  </div>
                  <div className="text-xs text-gray-500">Total Requests</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-600">
                    {myRequests.filter((r) => r.status === "pending").length}
                  </div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {myRequests.filter((r) => r.status === "completed").length}
                  </div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                {t("profile.settings" as any) ?? "Settings"}
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <label className="flex items-center justify-between">
                  <span>
                    {t("profile.emailNotifications" as any) ??
                      "Email notifications"}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() =>
                      setSettings((s) => ({
                        ...s,
                        emailNotifications: !s.emailNotifications,
                      }))
                    }
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span>
                    {t("profile.publicProfile" as any) ??
                      "Show profile publicly"}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.showProfilePublic}
                    onChange={() =>
                      setSettings((s) => ({
                        ...s,
                        showProfilePublic: !s.showProfilePublic,
                      }))
                    }
                  />
                </label>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
