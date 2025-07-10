import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Mic, Crown, Zap, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";

const Dashboard = () => {
	const navigate = useNavigate();
	const { logout, user, refreshUser } = useAuth();
	const [stats, setStats] = useState({
		credits: 0,
		plan: "Free",
		voicesGenerated: 0,
	});
	const [isLoading, setIsLoading] = useState(true);

	// Handle generate voice navigation
	const handleGenerateVoice = () => {
		navigate("/generate-voice");
	};

	// Fetch user profile data function
	const fetchUserProfile = async () => {
		try {
			const response = await api.getProfile();
			if (response.success && response.user) {
				setStats({
					credits: response.user.credits || 0,
					plan: response.user.is_premium ? "Premium" : "Free",
					voicesGenerated: response.user.voices_generated || 0,
				});

				// If we're using cached data, show a subtle indicator
				if (response.message && response.message.includes("cached")) {
					console.warn("Using cached user data:", response.message);
				}
			} else {
				console.error("Failed to fetch user profile:", response.message);
				// If it's an authentication error, redirect to login
				if (
					response.message === "No token provided" ||
					response.message === "Invalid token" ||
					response.message === "User not found"
				) {
					logout();
					navigate("/login");
				}
			}
		} catch (error) {
			console.error("Error fetching user profile:", error);
			// Only redirect to login for actual authentication errors, not network/server errors
			if (error instanceof Error) {
				if (
					error.message.includes("Invalid token") ||
					error.message.includes("User not found") ||
					error.message.includes("Authentication failed")
				) {
					logout();
					navigate("/login");
				} else {
					// For other errors, try to use cached user data
					const cachedUser = user;
					if (cachedUser) {
						setStats({
							credits: cachedUser.credits || 0,
							plan: cachedUser.isPremium ? "Premium" : "Free",
							voicesGenerated: 0, // We don't have this in cached data
						});
						console.warn("Using cached user data due to error:", error.message);
					}
				}
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch user profile data on mount
	useEffect(() => {
		fetchUserProfile();
	}, []);

	// Refresh user data when returning to dashboard
	useEffect(() => {
		const handleFocus = () => {
			fetchUserProfile();
		};

		window.addEventListener("focus", handleFocus);
		return () => window.removeEventListener("focus", handleFocus);
	}, []);

	// Refresh user data when user changes
	useEffect(() => {
		if (user) {
			setStats({
				credits: user.credits || 0,
				plan: user.isPremium ? "Premium" : "Free",
				voicesGenerated: 0, // This will be updated by fetchUserProfile
			});
		}
	}, [user]);

	return (
		<DashboardLayout>
			<main className="container mx-auto px-4 py-8">
				{/* Welcome Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8"
				>
					<h1 className="text-3xl sm:text-4xl font-bold mb-2">
						Welcome back, {user?.name || "User"}!
					</h1>
					<p className="text-muted-foreground">
						Your AI voice generation dashboard
					</p>
				</motion.div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					{/* Credits Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative overflow-hidden">
							<motion.div
								className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
								animate={{ opacity: [0.3, 0.6, 0.3] }}
								transition={{ duration: 4, repeat: Infinity }}
							/>
							<CardHeader className="relative z-10">
								<CardTitle className="flex items-center gap-2">
									<Zap className="h-5 w-5 text-primary" />
									Credits Remaining
								</CardTitle>
							</CardHeader>
							<CardContent className="relative z-10">
								<div className="text-3xl font-bold text-primary mb-2">
									{isLoading ? "..." : stats.credits}
								</div>
								<p className="text-sm text-muted-foreground">
									{stats.credits > 0
										? "Ready to generate voices"
										: "No credits left"}
								</p>
							</CardContent>
						</Card>
					</motion.div>

					{/* Plan Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative overflow-hidden">
							<motion.div
								className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
								animate={{ opacity: [0.3, 0.6, 0.3] }}
								transition={{ duration: 4, repeat: Infinity }}
							/>
							<CardHeader className="relative z-10">
								<CardTitle className="flex items-center gap-2">
									<Crown className="h-5 w-5 text-primary" />
									Current Plan
								</CardTitle>
							</CardHeader>
							<CardContent className="relative z-10">
								<div className="flex items-center gap-2 mb-2">
									<Badge
										variant={stats.plan === "Premium" ? "default" : "secondary"}
										className="text-sm"
									>
										{stats.plan}
									</Badge>
								</div>
								<p className="text-sm text-muted-foreground">
									{stats.plan === "Premium"
										? "Feel the buzz!"
										: "Limited voice generation"}
								</p>
							</CardContent>
						</Card>
					</motion.div>

					{/* Voices Generated Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative overflow-hidden">
							<motion.div
								className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
								animate={{ opacity: [0.3, 0.6, 0.3] }}
								transition={{ duration: 4, repeat: Infinity }}
							/>
							<CardHeader className="relative z-10">
								<CardTitle className="flex items-center gap-2">
									<History className="h-5 w-5 text-primary" />
									Voices Generated
								</CardTitle>
							</CardHeader>
							<CardContent className="relative z-10">
								<div className="text-3xl font-bold text-primary mb-2">
									{isLoading ? "..." : stats.voicesGenerated}
								</div>
								<p className="text-sm text-muted-foreground">
									Total voices created
								</p>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="flex flex-col sm:flex-row gap-4 justify-center"
				>
					<Button
						variant="whispr-primary"
						size="lg"
						onClick={handleGenerateVoice}
						className="flex items-center gap-2"
						disabled={stats.credits <= 0}
					>
						<Mic className="h-5 w-5" />
						{stats.credits > 0 ? "Generate New Voice" : "No Credits Available"}
					</Button>
					<Button
						variant="outline"
						size="lg"
						onClick={() => navigate("/clone")}
						className="flex items-center gap-2"
					>
						<Crown className="h-5 w-5" />
						Clone Voice
					</Button>
				</motion.div>

				{/* Credit Warning */}
				{stats.credits <= 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className="mt-6 text-center"
					>
						<Card className="bg-yellow-500/10 border-yellow-500/20 max-w-md mx-auto">
							<CardContent className="pt-6">
								<p className="text-yellow-600 dark:text-yellow-400">
									You've run out of credits! Upgrade to Premium for unlimited
									voice generation.
								</p>
								<Button variant="outline" onClick={() => navigate("/waitlist")} className="mt-4">
									Upgrade Plan
								</Button>
							</CardContent>
						</Card>
					</motion.div>
				)}
			</main>
		</DashboardLayout>
	);
};

export default Dashboard;
