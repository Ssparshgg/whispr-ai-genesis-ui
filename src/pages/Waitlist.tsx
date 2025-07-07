import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bell, CheckCircle, Mail, Star, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { api } from "@/lib/api";

const Waitlist = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setIsLoading(true);

		try {
			const data = await api.joinWaitlist(email);

			if (data.success) {
				setIsSubmitted(true);
				toast({
					title: "Welcome to the waitlist! 🎉",
					description: "We'll notify you as soon as we launch!",
				});
			} else {
				toast({
					title: "Error",
					description:
						data.message || "Something went wrong. Please try again.",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Waitlist error:", error);
			toast({
				title: "Error",
				description: "Failed to join waitlist. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const voices = [
		{
			name: "Linh",
			image: "/lovable-uploads/14409e85-31c6-4734-9111-93f71150b711.png",
		},
		{
			name: "Miara",
			image: "/lovable-uploads/8f3d2a00-ac1a-4dc9-beaa-22ce697945f3.png",
		},
		{
			name: "Madison",
			image: "/lovable-uploads/2f12a378-da34-4abd-8eab-18404ff65ac3.png",
		},
	];

	return (
		<div className="min-h-screen bg-background text-foreground relative overflow-hidden">
			{/* Background Effects */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20" />
			<motion.div
				animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
				transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
			/>

			{/* Header */}
			<header className="relative z-50 p-6">
				<div className="container mx-auto">
					<div className="flex items-center justify-between">
						<motion.div
							initial={{ x: -50, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							className="flex items-center space-x-2"
						>
							<div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
								<img
									src="/logo.jpg"
									alt="Seducely AI Logo"
									className="w-full h-full object-cover"
								/>
							</div>
							<span className="text-xl font-bold">Seducely AI</span>
						</motion.div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-12 relative z-10">
				<div className="max-w-4xl mx-auto">
					{/* Hero Section */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center mb-12"
					>
						<Badge className="mb-4 bg-primary/20 text-primary animate-pulse">
							🔥 Early Access
						</Badge>
						<h1 className="text-4xl lg:text-6xl font-bold mb-6">
							Be the First to Experience{" "}
							<motion.span
								className="text-primary"
								animate={{
									textShadow: [
										"0 0 20px rgba(139, 92, 246, 0.5)",
										"0 0 40px rgba(139, 92, 246, 0.8)",
										"0 0 20px rgba(139, 92, 246, 0.5)",
									],
								}}
								transition={{ duration: 2, repeat: Infinity }}
							>
								Seducely AI
							</motion.span>
						</h1>
						<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
							Join thousands of creators waiting for the most advanced AI voice
							generation platform. Create captivating voice notes with stunning
							AI personalities.
						</p>

						{/* Voice Models Preview */}
						<div className="flex justify-center gap-4 mb-8">
							{voices.map((voice, index) => (
								<motion.div
									key={voice.name}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: index * 0.2 }}
									className="relative"
								>
									<div className="w-16 h-16 rounded-full overflow-hidden border-3 border-primary/30">
										<img
											src={voice.image}
											alt={voice.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<motion.div
										animate={{ scale: [1, 1.2, 1] }}
										transition={{
											duration: 2,
											repeat: Infinity,
											delay: index * 0.5,
										}}
										className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
									/>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Waitlist Form */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="max-w-2xl mx-auto"
					>
						<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card">
							<CardHeader className="text-center">
								<CardTitle className="text-2xl">
									{isSubmitted
										? "Welcome to the Waitlist! 🎉"
										: "Join the Waitlist"}
								</CardTitle>
								<CardDescription>
									{isSubmitted
										? "We'll notify you as soon as Seducely AI launches!"
										: "Be among the first to access our revolutionary AI voice platform"}
								</CardDescription>
							</CardHeader>
							<CardContent>
								{isSubmitted ? (
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										className="text-center space-y-6"
									>
										<CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
										<div className="space-y-4">
											<p className="text-lg font-medium">
												Thank you for joining our waitlist!
											</p>
											<p className="text-muted-foreground">
												We'll send you an email at <strong>{email}</strong> as
												soon as we launch. Get ready for the most advanced AI
												voice generation experience!
											</p>
											<div className="flex justify-center gap-4 text-sm text-muted-foreground">
												<div className="flex items-center gap-2">
													<Users className="h-4 w-4" />
													<span>15,000+ creators waiting</span>
												</div>
												<div className="flex items-center gap-2">
													<Star className="h-4 w-4" />
													<span>Early access perks</span>
												</div>
											</div>
										</div>
									</motion.div>
								) : (
									<form onSubmit={handleSubmit} className="space-y-6">
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Email Address
											</label>
											<div className="relative">
												<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
												<Input
													type="email"
													placeholder="Enter your email address"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													className="pl-10 bg-input/50 border-border/50 focus:border-primary/50"
													required
												/>
											</div>
										</div>

										<Button
											type="submit"
											variant="whispr-primary"
											size="lg"
											className="w-full relative overflow-hidden group"
											disabled={isLoading}
										>
											<motion.div
												animate={{ x: [-200, 200] }}
												transition={{
													duration: 3,
													repeat: Infinity,
													ease: "linear",
												}}
												className="absolute inset-0 bg-gradient-to-r from-primary via-primary-hover to-primary"
											/>
											<span className="relative z-10 flex items-center gap-2">
												{isLoading ? (
													<>
														<motion.div
															animate={{ rotate: 360 }}
															transition={{
																duration: 1,
																repeat: Infinity,
																ease: "linear",
															}}
															className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
														/>
														Joining Waitlist...
													</>
												) : (
													<>
														<Bell className="h-4 w-4" />
														Join the Waitlist
													</>
												)}
											</span>
										</Button>

										<p className="text-xs text-muted-foreground text-center">
											By joining, you'll be the first to know when we launch and
											get exclusive early access perks.
										</p>
									</form>
								)}
							</CardContent>
						</Card>
					</motion.div>

					{/* Features Preview */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
						className="mt-16 grid md:grid-cols-3 gap-6"
					>
						{[
							{
								title: "Ultra-Realistic Voices",
								description:
									"AI voices so realistic, they'll captivate your audience",
								icon: "🎤",
							},
							{
								title: "Stunning AI Models",
								description: "Beautiful voice personalities with unique styles",
								icon: "👄",
							},
							{
								title: "Instant Downloads",
								description: "Generate and download MP3 files in seconds",
								icon: "⚡",
							},
						].map((feature, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.8 + index * 0.1 }}
								whileHover={{ scale: 1.05 }}
							>
								<Card className="bg-card/30 backdrop-blur border-border/20 text-center h-full">
									<CardContent className="p-6">
										<div className="text-4xl mb-4">{feature.icon}</div>
										<h3 className="font-semibold mb-2">{feature.title}</h3>
										<p className="text-sm text-muted-foreground">
											{feature.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default Waitlist;
