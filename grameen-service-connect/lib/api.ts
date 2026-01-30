const API_URL =
  (import.meta.env?.VITE_API_URL as string) || "http://localhost:5000/api";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: "help_seeker" | "volunteer" | "admin";
  location?: string;
  avatar?: string;
  bio?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ServiceRequest {
  id: number;
  name: string;
  contact?: string;
  category: string;
  description: string;
  location?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  requester_name?: string;
  volunteer_name?: string;
  document_path?: string;
}

class ApiService {
  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Auth endpoints
  async register(data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
    location?: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    return response.json();
  }

  async getProfile(): Promise<User> {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get profile");
    }

    return response.json();
  }

  // Request endpoints
  async createRequest(data: {
    name: string;
    contact?: string;
    category: string;
    description: string;
    location?: string;
    document?: File | null;
  }): Promise<{ message: string; request: ServiceRequest }> {
    const headers = this.getHeaders(true);
    let body: string | FormData;

    if (data.document) {
      // If there's a file, use FormData and remove Content-Type header (browser sets it with boundary)
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.contact) formData.append("contact", data.contact);
      formData.append("category", data.category);
      formData.append("description", data.description);
      if (data.location) formData.append("location", data.location);
      formData.append("document", data.document);

      body = formData;
      // @ts-ignore
      delete headers["Content-Type"];
    } else {
      body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}/requests`, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create request");
    }

    return response.json();
  }

  async getAllRequests(
    status?: string
  ): Promise<{ requests: ServiceRequest[]; count: number }> {
    const url = new URL(`${API_URL}/requests`);
    if (status) {
      url.searchParams.append("status", status);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get requests");
    }

    return response.json();
  }

  async getRequestById(id: number): Promise<ServiceRequest> {
    const response = await fetch(`${API_URL}/requests/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get request");
    }

    return response.json();
  }

  async getUserRequests(): Promise<{
    requests: ServiceRequest[];
    count: number;
  }> {
    const response = await fetch(`${API_URL}/requests/my-requests`, {
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get user requests");
    }

    return response.json();
  }

  async updateRequestStatus(
    id: number,
    status: string,
    volunteerId?: number
  ): Promise<{ message: string; request: ServiceRequest }> {
    const response = await fetch(`${API_URL}/requests/${id}/status`, {
      method: "PATCH",
      headers: this.getHeaders(true),
      body: JSON.stringify({ status, volunteerId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update request");
    }

    return response.json();
  }

  // Message endpoints
  async sendMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send message");
    }

    return response.json();
  }

  async getAllMessages(): Promise<{
    messages: {
      id: number;
      name: string;
      email: string;
      subject: string;
      message: string;
      created_at: string;
    }[];
    count: number;
  }> {
    const response = await fetch(`${API_URL}/messages`, {
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get messages");
    }

    return response.json();
  }

  // User endpoints
  async updateProfile(data: {
    fullName?: string;
    phone?: string;
    location?: string;
    bio?: string;
  }): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update profile");
    }

    return response.json();
  }

  async updateProfileWithAvatar(formData: FormData): Promise<{ message: string; user: User }> {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {};
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update profile");
    }

    return response.json();
  }
}

export const apiService = new ApiService();
