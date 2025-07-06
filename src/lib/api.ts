const API_BASE_URL = "https://second.anshtyagi.me/api";

// API utility functions
export const api = {
	// Login user
	async login(email: string, password: string) {
		const response = await fetch(`${API_BASE_URL}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});
		return response.json();
	},

	// Signup user
	async signup(
		name: string,
		email: string,
		password: string,
		confirmPassword: string
	) {
		const response = await fetch(`${API_BASE_URL}/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, email, password, confirmPassword }),
		});
		return response.json();
	},

	// Get user profile (requires authentication)
	async getProfile() {
		const token = localStorage.getItem("token");
		if (!token) {
			throw new Error("No token found");
		}

		const response = await fetch(`${API_BASE_URL}/profile`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		return response.json();
	},

	// Health check
	async healthCheck() {
		const response = await fetch(`${API_BASE_URL}/health`);
		return response.json();
	},

	// Generate voice
	async generateVoice(voiceName: string, text: string) {
		const response = await fetch(`${API_BASE_URL}/generate-voice`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ voiceName, text }),
		});
		return response.json();
	},
};

// Authentication utility functions
export const auth = {
	// Check if user is logged in
	isLoggedIn(): boolean {
		return !!localStorage.getItem("token");
	},

	// Get current user
	getCurrentUser() {
		const userStr = localStorage.getItem("user");
		return userStr ? JSON.parse(userStr) : null;
	},

	// Get token
	getToken(): string | null {
		return localStorage.getItem("token");
	},

	// Logout user
	logout() {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	},

	// Set authentication data
	setAuth(token: string, user: any) {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));
	},
};
