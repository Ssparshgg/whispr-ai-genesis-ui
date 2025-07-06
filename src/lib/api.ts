const API_BASE_URL = "https://second.anshtyagi.me/api";

export { API_BASE_URL };

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

		const data = await response.json();

		// Only clear token for actual authentication errors, not network/server errors
		if (!response.ok || !data.success) {
			if (
				(response.status === 401 || response.status === 403) &&
				(data.message === "Invalid token" || data.message === "User not found")
			) {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
			}
		}

		return data;
	},

	// Check user credits
	async checkCredits() {
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

		const data = await response.json();

		if (!response.ok || !data.success) {
			if (
				(response.status === 401 || response.status === 403) &&
				(data.message === "Invalid token" || data.message === "User not found")
			) {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
			}
			throw new Error(data.message || "Failed to check credits");
		}

		return {
			credits: data.user?.credits || 0,
			user: data.user,
		};
	},

	// Health check
	async healthCheck() {
		const response = await fetch(`${API_BASE_URL}/health`);
		return response.json();
	},

	// Generate voice
	async generateVoice(voiceName: string, text: string) {
		const token = localStorage.getItem("token");
		if (!token) {
			throw new Error("No token found");
		}

		// Check credits before generating
		const creditCheck = await this.checkCredits();
		if (creditCheck.credits <= 0) {
			throw new Error("Insufficient credits. Please upgrade your plan.");
		}

		const response = await fetch(`${API_BASE_URL}/generate-voice`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ voiceName, text }),
		});

		const data = await response.json();

		// Handle authentication errors
		if (!response.ok || !data.success) {
			if (
				(response.status === 401 || response.status === 403) &&
				(data.message === "Invalid token" || data.message === "User not found")
			) {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
			}
		}

		return data;
	},

	// Generate voice model (for 150 models)
	async generateVoiceModel(modelName: string, text: string) {
		const token = localStorage.getItem("token");
		if (!token) {
			throw new Error("No token found");
		}

		// Check credits before generating
		const creditCheck = await this.checkCredits();
		if (creditCheck.credits <= 0) {
			throw new Error("Insufficient credits. Please upgrade your plan.");
		}

		const response = await fetch(`${API_BASE_URL}/generate-voice-model`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ modelName, text }),
		});

		const data = await response.json();

		// Handle authentication errors
		if (!response.ok || !data.success) {
			if (
				(response.status === 401 || response.status === 403) &&
				(data.message === "Invalid token" || data.message === "User not found")
			) {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
			}
		}

		return data;
	},

	// Get voice history
	async getVoiceHistory() {
		const token = localStorage.getItem("token");
		if (!token) {
			throw new Error("No token found");
		}

		const response = await fetch(`${API_BASE_URL}/voice-history`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		// Handle authentication errors
		if (!response.ok || !data.success) {
			if (
				(response.status === 401 || response.status === 403) &&
				(data.message === "Invalid token" || data.message === "User not found")
			) {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
			}
		}

		return data;
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
