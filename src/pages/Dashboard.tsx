import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Home, Mic, Crown, Zap, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

const Dashboard = () => {
	const navigate = useNavigate();
	const { logout, user, refreshUser } = useAuth();
	const [stats, setStats] = useState({
		credits: 0,
		plan: "Free",
		voicesGenerated: 0,
	});
	const [isLoading, setIsLoading] = useState(true);

	// Handle logout
	const handleLogout = () => {
		logout();
		navigate("/");
	};

	// Handle home navigation
	const handleHome = () => {
		navigate("/");
	};

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
			// Check if it's an authentication error
			if (error instanceof Error) {
				if (
					error.message.includes("401") ||
					error.message.includes("403") ||
					error.message.includes("404")
				) {
					logout();
					navigate("/login");
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
		<div className="min-h-screen bg-background text-foreground relative overflow-hidden">
			{/* Background Effects */}
			<div className="absolute inset-0 bg-gradient-to-br from-whispr-purple/10 via-transparent to-whispr-purple-dark/10" />
			<motion.div
				animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
				transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
			/>
			<motion.div
				animate={{ scale: [1.2, 1, 1.2], rotate: [0, -10, 0] }}
				transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
				className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
			/>

			{/* Header */}
			<header className="border-b border-border/20 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<motion.div
								initial={{ x: -50, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								className="flex items-center space-x-2 cursor-pointer"
								onClick={handleHome}
							>
								<motion.div
									animate={{ rotate: [0, 15, -15, 0] }}
									transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
								>
									<img
										src="/logo.jpg"
										alt="Seducely AI Logo"
										className="h-8 w-8 rounded-full object-cover"
									/>
								</motion.div>
								<span className="text-xl sm:text-2xl font-bold">
									Seducely AI
								</span>
							</motion.div>
						</div>

						<div className="flex items-center space-x-2 sm:space-x-4">
							<Button
								variant="ghost"
								onClick={handleHome}
								className="text-xs sm:text-sm px-2 sm:px-4"
							>
								<Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
								<span className="hidden sm:inline">Home</span>
							</Button>
							<Button
								variant="ghost"
								onClick={handleLogout}
								className="text-xs sm:text-sm px-2 sm:px-4"
							>
								<LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
								<span className="hidden sm:inline">Logout</span>
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="relative z-10 container mx-auto px-4 py-8">
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
										? "Unlimited voice generation"
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
						onClick={handleHome}
						className="flex items-center gap-2"
					>
						<Home className="h-5 w-5" />
						Back to Home
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
								<Button variant="outline" onClick={handleHome} className="mt-4">
									Upgrade Plan
								</Button>
							</CardContent>
						</Card>
					</motion.div>
				)}
			</main>
		</div>
	);
};

export default Dashboard;
