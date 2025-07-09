import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mic, Eye, EyeOff, ArrowLeft } from "lucide-react";
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

const Login = () => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const data = await api.login(email, password);

			if (data.success) {
				// Store authentication data
				login(data.token, data.user);

				// Navigate to dashboard after successful login
				navigate("/dashboard");
			} else {
				// Show error message
				setError(data.message || "Login failed");
			}
		} catch (error) {
			console.error("Login error:", error);
			setError("Network error. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleBackToHome = () => {
		navigate("/waitlist");
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
			<header className="relative z-10 p-4 sm:p-6">
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
							<Mic className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
						</motion.div>
						<span className="text-lg sm:text-2xl font-bold">Seducely AI</span>
					</motion.div>

					<Button
						variant="ghost"
						onClick={handleBackToHome}
						className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
					>
						<ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
						<span className="hidden sm:inline">Back to Home</span>
						<span className="sm:hidden">Home</span>
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
								className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center"
							>
								<Mic className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
							</motion.div>
							<CardTitle className="text-xl sm:text-2xl font-bold">
								Welcome Back
							</CardTitle>
							<CardDescription className="text-sm sm:text-base">
								Sign in to your Seducely AI account to continue creating amazing
								voice notes with stunning AI models
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
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="Enter your email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="bg-input/50 border-border/50 focus:border-primary/50 transition-colors"
										required
									/>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 }}
									className="space-y-2"
								>
									<Label htmlFor="password">Password</Label>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											placeholder="Enter your password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="bg-input/50 border-border/50 focus:border-primary/50 transition-colors pr-10"
											required
										/>
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
									transition={{ delay: 0.5 }}
									className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-2 sm:gap-0"
								>
									<label className="flex items-center space-x-2 cursor-pointer">
										<input type="checkbox" className="rounded border-border" />
										<span>Remember me</span>
									</label>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6 }}
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
											<div className="flex items-center justify-center">
												<motion.div
													animate={{ rotate: 360 }}
													transition={{
														duration: 1,
														repeat: Infinity,
														ease: "linear",
													}}
													className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
												/>
											</div>
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
												<span className="relative z-10">Sign In</span>
											</>
										)}
									</Button>
								</motion.div>
							</form>

							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.7 }}
							>
								<Separator className="my-6" />
								<div className="text-center space-y-4">
									<p className="text-xs sm:text-sm text-muted-foreground">
										Don't have an account?{" "}
										<Link
											to="/signup"
											className="text-primary hover:text-primary-hover transition-colors font-medium"
										>
											Create one now
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

export default Login;
