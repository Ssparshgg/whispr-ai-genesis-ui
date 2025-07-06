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
	const { logout, user } = useAuth();
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
					response.message === "Invalid token"
				) {
					logout();
					navigate("/login");
				}
			}
		} catch (error) {
			console.error("Error fetching user profile:", error);
			// Check if it's an authentication error
			if (error instanceof Error) {
				if (error.message.includes("401") || error.message.includes("403")) {
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
							<span className="text-xl sm:text-2xl font-bold">Seducely AI</span>
						</motion.div>

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
			<div className="relative z-10 container mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="max-w-4xl mx-auto"
				>
					{/* Welcome Section */}
					<div className="mb-8">
						<motion.h1
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-3xl sm:text-4xl font-bold mb-2"
						>
							Welcome back, {user?.name || "Creator"}!
						</motion.h1>
						<p className="text-muted-foreground text-lg">
							Ready to create some seductive AI voices?
						</p>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						{/* Credits Card */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.1 }}
						>
							<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative overflow-hidden">
								<motion.div
									className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
									animate={{ opacity: [0.3, 0.6, 0.3] }}
									transition={{ duration: 4, repeat: Infinity }}
								/>
								<CardHeader className="relative z-10 pb-3">
									<CardTitle className="flex items-center gap-2 text-lg">
										<Zap className="h-5 w-5 text-yellow-500" />
										Credits
									</CardTitle>
								</CardHeader>
								<CardContent className="relative z-10">
									<div className="text-3xl font-bold text-primary mb-1">
										{isLoading ? "..." : stats.credits}
									</div>
									<p className="text-sm text-muted-foreground">
										Available for voice generation
									</p>
								</CardContent>
							</Card>
						</motion.div>

						{/* Plan Card */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
						>
							<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative overflow-hidden">
								<motion.div
									className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
									animate={{ opacity: [0.3, 0.6, 0.3] }}
									transition={{ duration: 4, repeat: Infinity }}
								/>
								<CardHeader className="relative z-10 pb-3">
									<CardTitle className="flex items-center gap-2 text-lg">
										<Crown className="h-5 w-5 text-purple-500" />
										Plan
									</CardTitle>
								</CardHeader>
								<CardContent className="relative z-10">
									<div className="flex items-center gap-2 mb-2">
										<span className="text-3xl font-bold">
											{isLoading ? "..." : stats.plan}
										</span>
										{stats.plan === "Premium" && (
											<Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
												Pro
											</Badge>
										)}
									</div>
									<p className="text-sm text-muted-foreground">
										{stats.plan === "Free"
											? "Upgrade for more features"
											: "All features unlocked"}
									</p>
								</CardContent>
							</Card>
						</motion.div>

						{/* Voices Generated Card */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 }}
						>
							<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative overflow-hidden">
								<motion.div
									className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
									animate={{ opacity: [0.3, 0.6, 0.3] }}
									transition={{ duration: 4, repeat: Infinity }}
								/>
								<CardHeader className="relative z-10 pb-3">
									<CardTitle className="flex items-center gap-2 text-lg">
										<History className="h-5 w-5 text-green-500" />
										Voices Generated
									</CardTitle>
								</CardHeader>
								<CardContent className="relative z-10">
									<div className="text-3xl font-bold text-primary mb-1">
										{stats.voicesGenerated}
									</div>
									<p className="text-sm text-muted-foreground">
										Total voices created
									</p>
								</CardContent>
							</Card>
						</motion.div>
					</div>

					{/* Generate Voice CTA */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="text-center"
					>
						<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative overflow-hidden max-w-md mx-auto">
							<motion.div
								className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20"
								animate={{ opacity: [0.5, 0.8, 0.5] }}
								transition={{ duration: 3, repeat: Infinity }}
							/>
							<CardContent className="relative z-10 py-8">
								<motion.div
									animate={{ scale: [1, 1.1, 1] }}
									transition={{ duration: 2, repeat: Infinity }}
									className="mb-4"
								>
									<Mic className="h-12 w-12 text-primary mx-auto" />
								</motion.div>
								<h3 className="text-xl font-bold mb-2">Ready to Create?</h3>
								<p className="text-muted-foreground mb-6">
									Generate seductive AI voices with our premium models
								</p>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										variant="whispr-primary"
										size="lg"
										onClick={handleGenerateVoice}
										className="w-full relative overflow-hidden group"
									>
										<motion.div
											animate={{ x: [-200, 200] }}
											transition={{
												duration: 3,
												repeat: Infinity,
												ease: "linear",
											}}
											className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
										/>
										<span className="relative z-10 flex items-center gap-2">
											<Mic className="h-4 w-4" />
											Generate Voice
										</span>
									</Button>
								</motion.div>
							</CardContent>
						</Card>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
};

export default Dashboard;
