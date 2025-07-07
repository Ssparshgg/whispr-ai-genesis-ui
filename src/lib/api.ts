const API_BASE_URL = "http://localhost:3001/api";

export const joinWaitlist = async (data: { email: string }) => {
  const response = await fetch(`${API_BASE_URL}/waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to join waitlist");
  }

  return response.json();
};

export const generateVoice = async (data: {
  voice: string;
  text: string;
  userId: string;
}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/generate-voice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to generate voice");
  }

  return response.json();
};

export const getUserVoices = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/user-voices`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to fetch user voices");
  }

  return response.json();
};

// Admin API functions
export const adminLogin = async (data: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to login");
  }

  return response.json();
};

export const getWaitlistUsers = async () => {
  const token = localStorage.getItem("adminToken");
  const response = await fetch(`${API_BASE_URL}/admin/waitlist`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to fetch waitlist users");
  }

  return response.json();
};

// Auth functions
export const login = async (data: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to login");
  }

  return response.json();
};

export const signup = async (data: { email: string; password: string; name: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to signup");
  }

  return response.json();
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get current user");
  }

  return response.json();
};
