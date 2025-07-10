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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";

const Dashboard = () => {
	const navigate = useNavigate();
	const { logout, user, refreshUser } = useAuth();
	const [stats, setStats] = useState({
		credits: 0,
		plan: "Free",
		voicesGenerated: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const isMobile = useIsMobile();

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
		<DashboardLayout defaultSidebarOpen={!isMobile}>
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

				{/* Out of Credits Alert - with margin above and below */}
				{stats.credits <= 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className="my-8 flex justify-center" // <-- margin above and below
					>
						<Alert
							className={`
							max-w-xl w-full
							border-2 border-primary/40
							bg-gradient-to-br from-whispr-purple/20 to-background/80
							shadow-lg
							relative
							overflow-hidden
						`}
						>
							{/* Animated Glow */}
							<motion.div
								className="absolute inset-0 pointer-events-none rounded-lg"
								style={{ zIndex: 0 }}
								animate={{
									boxShadow: [
										"0 0 24px 8px rgba(128, 90, 213, 0.25)",
										"0 0 32px 12px rgba(128, 90, 213, 0.45)",
										"0 0 24px 8px rgba(128, 90, 213, 0.25)",
									],
								}}
								transition={{
									duration: 2.5,
									repeat: Infinity,
									repeatType: "loop",
									ease: "easeInOut",
								}}
							/>
							<div className="relative z-10">
								<AlertTitle className="text-lg font-bold flex items-center gap-2 text-primary">
									<span role="img" aria-label="warning">
										⚡
									</span>
									You've run out of credits!
								</AlertTitle>
								<AlertDescription className="mt-2 text-base text-foreground">
									Please upgrade to{" "}
									<span className="font-semibold text-primary">Premium</span>{" "}
									for unlimited voice generation.
								</AlertDescription>
							</div>
						</Alert>
					</motion.div>
				)}

				{/* Feature Cards */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8"
				>
					{/* Generate New Voice Card with Tooltip on the left */}
					<div className="relative flex items-center">
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="absolute -left-8 top-1/2 -translate-y-1/2 z-20">
									<div className="w-3 h-3 bg-purple-600 rounded-full border-2 border-white shadow-lg" />
								</div>
							</TooltipTrigger>
							<TooltipContent side="left" className="bg-purple-700 text-white">
								<span className="font-semibold">Text to voice = 1 credit</span>
								<br />
								<span className="font-semibold">Voice changer = 5 credits</span>
							</TooltipContent>
						</Tooltip>
						<div
							onClick={handleGenerateVoice}
							className={`
								group cursor-pointer rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-background/80
								shadow-md hover:shadow-xl transition-all duration-200
								p-6 flex flex-col items-center text-center relative w-full
								${stats.credits <= 0 ? "opacity-60 pointer-events-none" : ""}
							`}
							tabIndex={0}
							role="button"
							aria-disabled={stats.credits <= 0}
						>
							<Mic className="h-10 w-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
							<h3 className="text-xl font-bold text-primary mb-1">
								Generate New Voice
							</h3>
							<p className="text-muted-foreground text-base mb-2">
								Instantly create lifelike AI voices from your text. Perfect for
								content, narration, and more.
							</p>
							{stats.credits <= 0 && (
								<span className="text-sm text-destructive font-semibold mt-2">
									No credits available
								</span>
							)}
						</div>
					</div>

					{/* Clone Voice Card with Tooltip on the right */}
					<div className="relative flex items-center">
						<div
							onClick={() => navigate("/clone")}
							className={`
								group cursor-pointer rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-background/80
								shadow-md hover:shadow-xl transition-all duration-200
								p-6 flex flex-col items-center text-center relative w-full
							`}
							tabIndex={0}
							role="button"
						>
							<Crown className="h-10 w-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
							<h3 className="text-xl font-bold text-primary mb-1">
								Clone Voice
							</h3>
							<p className="text-muted-foreground text-base mb-2">
								Upload a sample and create a custom AI voice that sounds just
								like you or anyone else.
							</p>
						</div>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="absolute -right-8 top-1/2 -translate-y-1/2 z-20">
									<div className="w-3 h-3 bg-purple-600 rounded-full border-2 border-white shadow-lg" />
								</div>
							</TooltipTrigger>
							<TooltipContent side="right" className="bg-purple-700 text-white">
								<span className="font-semibold">
									Cloning Voice = 10 credits
								</span>
								<br />
								<span className="font-semibold">
									text to cloned voice = 2 credits
								</span>
							</TooltipContent>
						</Tooltip>
					</div>
				</motion.div>
			</main>
		</DashboardLayout>
	);
};

export default Dashboard;
