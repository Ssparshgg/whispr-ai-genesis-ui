import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mic, Eye, EyeOff, ArrowLeft, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const script = document.createElement("script");
		script.async = true;
		script.type = "text/javascript";
		script.src =
			"https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=4w2Uu4KxS4";
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		// Basic validation
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords don't match!");
			setIsLoading(false);
			return;
		}

		try {
			const data = await api.signup(
				formData.name,
				formData.email,
				formData.password,
				formData.confirmPassword
			);

			if (data.success) {
				// Store authentication data
				login(data.token, data.user);

				// Navigate to dashboard after successful signup
				navigate("/dashboard");
			} else {
				// Show error message
				if (data.errors) {
					const errorMessages = data.errors
						.map((error: any) => error.msg)
						.join("\n");
					setError(errorMessages);
				} else {
					setError(data.message || "Signup failed");
				}
			}
		} catch (error) {
			console.error("Signup error:", error);
			setError("Network error. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleBackToHome = () => {
		navigate("/waitlist");
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

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
			<header className="relative z-10 p-6">
				<div className="flex items-center justify-between max-w-6xl mx-auto">
					<motion.div
						initial={{ x: -50, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						className="flex items-center space-x-2"
					>
						<motion.div
							animate={{ rotate: [0, 15, -15, 0] }}
							transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
						>
							<Mic className="h-8 w-8 text-primary" />
						</motion.div>
						<span className="text-2xl font-bold">Seducely AI</span>
					</motion.div>

					<Button
						variant="ghost"
						onClick={handleBackToHome}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Home
					</Button>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 30, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.6 }}
					className="w-full max-w-md"
				>
					<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative overflow-hidden">
						<motion.div
							className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
							animate={{ opacity: [0.5, 0.8, 0.5] }}
							transition={{ duration: 4, repeat: Infinity }}
						/>

						<CardHeader className="relative z-10 text-center">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
								className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center"
							>
								<Mic className="h-8 w-8 text-primary" />
							</motion.div>
							<CardTitle className="text-2xl font-bold">
								Join Seducely AI
							</CardTitle>
							<CardDescription>
								Create your account and start generating captivating AI voice
								notes with stunning models
							</CardDescription>
						</CardHeader>

						<CardContent className="relative z-10 space-y-6">
							{error && (
								<div className="mb-4">
									<div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg border border-red-200 animate-shake">
										{error}
									</div>
								</div>
							)}
							<form onSubmit={handleSubmit} className="space-y-4">
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3 }}
									className="space-y-2"
								>
									<Label htmlFor="name">Full Name</Label>
									<div className="relative">
										<Input
											id="name"
											type="text"
											placeholder="Enter your full name"
											value={formData.name}
											onChange={(e) =>
												handleInputChange("name", e.target.value)
											}
											className="bg-input/50 border-border/50 focus:border-primary/50 transition-colors pl-10"
											required
										/>
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 }}
									className="space-y-2"
								>
									<Label htmlFor="email">Email</Label>
									<div className="relative">
										<Input
											id="email"
											type="email"
											placeholder="Enter your email"
											value={formData.email}
											onChange={(e) =>
												handleInputChange("email", e.target.value)
											}
											className="bg-input/50 border-border/50 focus:border-primary/50 transition-colors pl-10"
											required
										/>
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.5 }}
									className="space-y-2"
								>
									<Label htmlFor="password">Password</Label>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											placeholder="Enter your password"
											value={formData.password}
											onChange={(e) =>
												handleInputChange("password", e.target.value)
											}
											className="bg-input/50 border-border/50 focus:border-primary/50 transition-colors pr-10 pl-10"
											required
										/>
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4 text-muted-foreground" />
											) : (
												<Eye className="h-4 w-4 text-muted-foreground" />
											)}
										</Button>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.6 }}
									className="space-y-2"
								>
									<Label htmlFor="confirmPassword">Confirm Password</Label>
									<div className="relative">
										<Input
											id="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											placeholder="Confirm your password"
											value={formData.confirmPassword}
											onChange={(e) =>
												handleInputChange("confirmPassword", e.target.value)
											}
											className="bg-input/50 border-border/50 focus:border-primary/50 transition-colors pr-10 pl-10"
											required
										/>
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
										>
											{showConfirmPassword ? (
												<EyeOff className="h-4 w-4 text-muted-foreground" />
											) : (
												<Eye className="h-4 w-4 text-muted-foreground" />
											)}
										</Button>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.7 }}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Button
										type="submit"
										variant="whispr-primary"
										className="w-full relative overflow-hidden group"
										disabled={isLoading}
									>
										{isLoading ? (
											<motion.div
												animate={{ rotate: 360 }}
												transition={{
													duration: 1,
													repeat: Infinity,
													ease: "linear",
												}}
												className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
											/>
										) : (
											<>
												<motion.div
													animate={{ x: [-200, 200] }}
													transition={{
														duration: 3,
														repeat: Infinity,
														ease: "linear",
													}}
													className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
												/>
												<span className="relative z-10">Create Account</span>
											</>
										)}
									</Button>
								</motion.div>
							</form>

							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.8 }}
							>
								<Separator className="my-6" />
								<div className="text-center space-y-4">
									<p className="text-sm text-muted-foreground">
										Already have an account?{" "}
										<Link
											to="/login"
											className="text-primary hover:text-primary-hover transition-colors font-medium"
										>
											Sign in
										</Link>
									</p>
								</div>
							</motion.div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
};

export default Signup;
