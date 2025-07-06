import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { auth, api } from "@/lib/api";

interface User {
	_id: string;
	name: string;
	email: string;
	createdAt: string;
	isPremium?: boolean;
	credits?: number;
}

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (token: string, user: User) => void;
	logout: () => void;
	checkAuth: () => Promise<void>;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const login = (token: string, user: User) => {
		auth.setAuth(token, user);
		setUser(user);
	};

	const logout = () => {
		auth.logout();
		setUser(null);
	};

	const refreshUser = async () => {
		try {
			if (auth.isLoggedIn()) {
				const response = await api.getProfile();
				if (response.success && response.user) {
					setUser(response.user);
					auth.setAuth(auth.getToken()!, response.user);

					// If we're using cached data, show a subtle indicator
					if (response.message && response.message.includes("cached")) {
						console.warn("Using cached user data:", response.message);
					}
				} else if (
					response.message === "Invalid token" ||
					response.message === "User not found"
				) {
					// Only logout for actual auth errors
					logout();
				}
			}
		} catch (error) {
			console.error("Error refreshing user:", error);
			// Don't logout on network errors, keep user logged in with cached data
			if (
				error instanceof Error &&
				error.message.includes("Authentication failed")
			) {
				logout();
			}
		}
	};

	const checkAuth = async () => {
		try {
			if (auth.isLoggedIn()) {
				const currentUser = auth.getCurrentUser();
				if (currentUser) {
					setUser(currentUser);
					// Also try to get fresh user data from server
					try {
						const response = await api.getProfile();
						if (response.success && response.user) {
							setUser(response.user);
							auth.setAuth(auth.getToken()!, response.user);

							// If we're using cached data, show a subtle indicator
							if (response.message && response.message.includes("cached")) {
								console.warn("Using cached user data:", response.message);
							}
						} else if (
							response.message === "Invalid token" ||
							response.message === "User not found"
						) {
							// Only logout for actual auth errors, not network/server errors
							logout();
						}
					} catch (error) {
						console.error("Error fetching fresh user data:", error);
						// If we can't fetch fresh data, keep the cached user but mark as potentially stale
						if (
							error instanceof Error &&
							error.message.includes("Authentication failed")
						) {
							logout();
						} else {
							console.warn("Using cached user data - may be stale");
						}
					}
				} else {
					// Try to get fresh user data from server
					try {
						const response = await api.getProfile();
						if (response.success && response.user) {
							setUser(response.user);
							auth.setAuth(auth.getToken()!, response.user);

							// If we're using cached data, show a subtle indicator
							if (response.message && response.message.includes("cached")) {
								console.warn("Using cached user data:", response.message);
							}
						} else if (
							response.message === "Invalid token" ||
							response.message === "User not found"
						) {
							// Only logout for actual auth errors
							logout();
						}
					} catch (error) {
						console.error("Error fetching user data:", error);
						// Don't logout on network errors, just keep user logged in with cached data
						if (
							error instanceof Error &&
							error.message.includes("Authentication failed")
						) {
							logout();
						}
					}
				}
			}
		} catch (error) {
			console.error("Auth check error:", error);
			// Don't logout on general errors, only on specific auth errors
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const value: AuthContextType = {
		user,
		isAuthenticated: !!user,
		isLoading,
		login,
		logout,
		checkAuth,
		refreshUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
