import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
	Mic,
	Download,
	Share,
	Pen,
	User,
	ChevronDown,
	Play,
	Lightbulb,
	Brain,
	Bell,
	Clock,
	Star,
	LogOut,
	Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import AnimatedCounter from "@/components/AnimatedCounter";
import WaveAnimation from "@/components/WaveAnimation";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import VoiceCard from "@/components/VoiceCard";
import AnimatedIcon from "@/components/AnimatedIcon";

const Index = () => {
	const navigate = useNavigate();
	const { isAuthenticated, logout, user } = useAuth();
	const [selectedVoice, setSelectedVoice] = useState("Linh");
	const [message, setMessage] = useState("");
	const [selectedVoiceFilter, setSelectedVoiceFilter] = useState("All");
	const [isTyping, setIsTyping] = useState(false);
	const [showPremiumDropdown, setShowPremiumDropdown] = useState(false);
	const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
	const voiceDropdownRef = useRef<HTMLDivElement>(null);
	const [premiumVoices] = useState([
		{
			name: "Sasha",
			type: "Seductive",
			image: "/lovable-uploads/premium1.png",
			personality: "Seductive & Mysterious",
			quote: "Let me whisper secrets in your ear...",
			audioFile: "/premium1.mp3",
		},
		{
			name: "Jade",
			type: "Sultry",
			image: "/lovable-uploads/premium2.png",
			personality: "Sultry & Bold",
			quote: "You can't resist my voice...",
			audioFile: "/premium2.mp3",
		},
	]);

	const lockedVoiceImages: Record<string, string> = {
		Sweet: "/sydney.jpg",
		Cute: "/daissy.jpg",
		Confident: "/kyly.jpg",
		Adventurous: "/lauren.jpg",
	};

	// Smooth scroll function with offset adjustment
	const smoothScrollTo = (elementId: string) => {
		const element = document.getElementById(elementId);
		if (element) {
			const headerOffset = 80;
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition =
				elementPosition + window.pageYOffset - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	};

	// Handle navigation clicks
	const handleNavClick = (sectionId: string) => {
		smoothScrollTo(sectionId);
	};

	// Handle demo click - scroll to voices section
	const handleDemoClick = () => {
		smoothScrollTo("voices");
	};

	// Handle start creating click - navigate to generate voice page if logged in, otherwise login
	const handleStartCreating = () => {
		if (isAuthenticated) {
			navigate("/generate-voice");
		} else {
			navigate("/login");
		}
	};

	// Handle login/signup navigation
	const handleLogin = () => {
		navigate("/login");
	};

	const handleSignup = () => {
		navigate("/signup");
	};

	// Handle logout
	const handleLogout = () => {
		logout();
		navigate("/");
	};

	// Handle generate voice from widget
	const handleGenerateFromWidget = (voice: string, text: string) => {
		if (isAuthenticated) {
			// Navigate to generate voice page with the selected voice and text
			navigate("/generate-voice", {
				state: {
					selectedVoice: voice,
					message: text,
				},
			});
		} else {
			// Redirect to login page
			navigate("/login");
		}
	};

	// Audio handling functions
	const handlePreview = (voice: any) => {
		const audio = new Audio(voice.audioFile);
		audio.play().catch((error) => {
			console.error("Error playing audio:", error);
		});
	};

	const handleDownload = (voice: any) => {
		const link = document.createElement("a");
		link.href = voice.audioFile;
		link.download = `${voice.name.toLowerCase()}.mp3`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const voices = [
		{
			name: "Linh",
			type: "Sweet",
			description: "Sweet Asian voice with gentle, caring tone",
			avatar: "L",
			quote: "Let me take care of you with my sweet voice...",
			image: "/lovable-uploads/14409e85-31c6-4734-9111-93f71150b711.png",
			personality: "Sweet & Caring",
			audioFile: "/sweet.mp3",
		},
		{
			name: "Miara",
			type: "Cute",
			description: "Adorable Chinese voice with playful charm",
			avatar: "M",
			quote: "I'll make your day brighter with my cute voice...",
			image: "/lovable-uploads/8f3d2a00-ac1a-4dc9-beaa-22ce697945f3.png",
			personality: "Cute & Playful",
			audioFile: "/cute.mp3",
		},
		{
			name: "Madison",
			type: "Confident",
			description: "American voice with confident, alluring presence",
			avatar: "M",
			quote: "Ready to hear what confidence sounds like?",
			image: "/lovable-uploads/2f12a378-da34-4abd-8eab-18404ff65ac3.png",
			personality: "Confident & Alluring",
			audioFile: "/confident.mp3",
		},
		{
			name: "Aria",
			type: "Adventurous",
			description: "Free-spirited voice for those who love adventure",
			avatar: "A",
			quote: "Let's go on an adventure together...",
			image: "/lovable-uploads/53504ad3-684a-409f-a9ab-4cf6045e0388.png",
			personality: "Free & Adventurous",
			audioFile: "/adventure.mp3",
		},
	];

	const voiceFilters = [
		"All",
		"Sweet",
		"Cute",
		"Confident",
		"Adventurous",
		"Dominant",
	];

	const filteredVoices =
		selectedVoiceFilter === "All"
			? voices
			: voices.filter((voice) => voice.type === selectedVoiceFilter);

	const categories = ["Sweet", "Cute", "Confident", "Adventurous"];
	const mockVoices = Array.from({ length: 150 }, (_, i) => {
		const type = categories[i % categories.length];
		// Generate deterministic letter from A-Z based on index
		const randomLetter = String.fromCharCode(65 + (i % 26));
		return {
			name: `Voice ${i + 1}`,
			type,
			avatar: randomLetter,
			image:
				i % 3 === 0 ? `/lovable-uploads/mock${(i % 10) + 1}.png` : undefined, // Some have images
			personality: `${type} Personality`,
		};
	});

	// Group voices by category
	const groupedMockVoices = categories.map((cat) => ({
		category: cat,
		voices: mockVoices.filter((v) => v.type === cat),
	}));

	// Handle click outside dropdown to close
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				voiceDropdownRef.current &&
				!voiceDropdownRef.current.contains(event.target as Node)
			) {
				setShowVoiceDropdown(false);
			}
		}

		// Add event listener when dropdown is open
		document.addEventListener("mousedown", handleClickOutside);

		// Cleanup function
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showVoiceDropdown]); // Keep dependency array

	const { ref: heroRef, inView: heroInView } = useInView({
		threshold: 0.3,
		triggerOnce: true,
	});
	const { ref: featuresRef, inView: featuresInView } = useInView({
		threshold: 0.3,
		triggerOnce: true,
	});
	const { ref: stepsRef, inView: stepsInView } = useInView({
		threshold: 0.3,
		triggerOnce: true,
	});

	return (
		<div className="min-h-screen bg-background text-foreground overflow-x-hidden">
			{/* Top Banner */}
			<motion.div
				initial={{ y: -50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				className="bg-gradient-purple text-white text-center py-3 px-4 relative overflow-hidden"
			>
				<motion.div
					animate={{ x: [-100, 100] }}
					transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
					className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
				/>
				<p className="text-sm font-medium relative z-10">
					NEW Ultra-Realistic AI Voices with Visual Profiles - Early Access Ends
					July 10th!
				</p>
			</motion.div>

			{/* Header/Navigation */}
			<header className="border-b border-border/20 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<motion.div
							initial={{ x: -50, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							className="flex items-center space-x-2"
						>
							<motion.div
								animate={{ rotate: [0, 15, -15, 0] }}
								transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
								className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0"
							>
								<img
									src="/logo.jpg"
									alt="Seducely AI Logo"
									className="w-full h-full object-cover"
								/>
							</motion.div>
							<span className="text-xl sm:text-2xl font-bold">Seducely AI</span>
						</motion.div>

						<nav className="hidden md:flex items-center space-x-8">
							<motion.button
								onClick={() => handleNavClick("features")}
								className="hover:text-primary transition-colors cursor-pointer relative group"
								whileHover={{ scale: 1.05 }}
							>
								Features
								<motion.div
									className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left"
									initial={{ scaleX: 0 }}
									whileHover={{ scaleX: 1 }}
									transition={{ duration: 0.3 }}
								/>
							</motion.button>
							<motion.button
								onClick={() => handleNavClick("voices")}
								className="hover:text-primary transition-colors cursor-pointer relative group"
								whileHover={{ scale: 1.05 }}
							>
								Voices
								<motion.div
									className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left"
									initial={{ scaleX: 0 }}
									whileHover={{ scaleX: 1 }}
									transition={{ duration: 0.3 }}
								/>
							</motion.button>
							<motion.button
								onClick={() => handleNavClick("pricing")}
								className="hover:text-primary transition-colors cursor-pointer relative group"
								whileHover={{ scale: 1.05 }}
							>
								Pricing
								<motion.div
									className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left"
									initial={{ scaleX: 0 }}
									whileHover={{ scaleX: 1 }}
									transition={{ duration: 0.3 }}
								/>
							</motion.button>
						</nav>

						<div className="flex items-center space-x-2 sm:space-x-4">
							{isAuthenticated ? (
								<Button
									variant="ghost"
									onClick={handleLogout}
									className="text-xs sm:text-sm px-2 sm:px-4"
								>
									<LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
									<span className="hidden sm:inline">Logout</span>
								</Button>
							) : (
								<>
									<Button
										variant="ghost"
										onClick={handleLogin}
										className="text-xs sm:text-sm px-2 sm:px-4"
									>
										<span className="hidden sm:inline">Login</span>
										<span className="sm:hidden">Sign In</span>
									</Button>
									<Button
										variant="whispr-primary"
										onClick={handleSignup}
										className="text-xs sm:text-sm px-2 sm:px-4"
									>
										<span className="hidden sm:inline">Sign Up</span>
										<span className="sm:hidden">Sign Up</span>
									</Button>
								</>
							)}
						</div>
					</div>
				</div>
			</header>

			{/* Hero Section with Background */}
			<section ref={heroRef} className="py-20 px-4 relative overflow-hidden">
				{/* Animated Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-whispr-purple/10 via-transparent to-whispr-purple-dark/10" />
				<motion.div
					animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
					transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{ scale: [1.1, 1, 1.1], rotate: [0, -5, 0] }}
					transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
				/>

				<div className="container mx-auto relative z-10">
					<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
						<div className="space-y-6 sm:space-y-8">
							<motion.div
								initial={{ opacity: 0, y: 50 }}
								animate={heroInView ? { opacity: 1, y: 0 } : {}}
								transition={{ duration: 0.8 }}
								className="space-y-4"
							>
								<h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
									Create Your Own{" "}
									<motion.span
										className="text-primary relative"
										animate={{
											textShadow: [
												"0 0 20px rgba(139, 92, 246, 0.5)",
												"0 0 40px rgba(139, 92, 246, 0.8)",
												"0 0 20px rgba(139, 92, 246, 0.5)",
											],
										}}
										transition={{ duration: 2, repeat: Infinity }}
									>
										Seductive
									</motion.span>{" "}
									<motion.span
										initial={{ opacity: 0, scale: 0.8 }}
										animate={heroInView ? { opacity: 1, scale: 1 } : {}}
										transition={{ delay: 0.5, duration: 0.8 }}
									>
										AI Voice Notes
									</motion.span>
								</h1>
								<p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
									Generate captivating, ultra-realistic voice notes with
									stunning AI personalities. Choose from beautiful voice models
									with unique styles and personas.
								</p>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								animate={heroInView ? { opacity: 1, y: 0 } : {}}
								transition={{ delay: 0.8, duration: 0.6 }}
								className="flex flex-col sm:flex-row gap-4"
							>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="w-full sm:w-auto"
								>
									<Button
										variant="whispr-primary"
										size="lg"
										className="relative overflow-hidden group w-full sm:w-auto"
										onClick={handleStartCreating}
									>
										<motion.div
											className="absolute inset-0 bg-gradient-to-r from-primary via-primary-hover to-primary"
											animate={{ x: [-200, 200] }}
											transition={{
												duration: 3,
												repeat: Infinity,
												ease: "linear",
											}}
										/>
										<span className="relative z-10">Start Creating Now</span>
									</Button>
								</motion.div>
								<Button
									variant="whispr-outline"
									size="lg"
									className="group w-full sm:w-auto"
									onClick={handleDemoClick}
								>
									<Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
									Listen to Demos
								</Button>
							</motion.div>
							{/* Trust Badges */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={heroInView ? { opacity: 1 } : {}}
								transition={{ delay: 1.2 }}
								className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-muted-foreground"
							>
								<div className="flex items-center gap-2">
									<span className="text-primary font-bold">
										<AnimatedCounter end={15000} suffix="+" />
									</span>
									<span>Creators</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-primary font-bold">
										<AnimatedCounter end={750000} suffix="+" />
									</span>
									<span>Voice Notes</span>
								</div>
							</motion.div>
							{/* Testimonial Carousel */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={heroInView ? { opacity: 1, y: 0 } : {}}
								transition={{ delay: 1.4 }}
							>
								<TestimonialCarousel />
							</motion.div>
						</div>

						{/* Enhanced Voice Generation Widget */}
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							animate={heroInView ? { opacity: 1, x: 0 } : {}}
							transition={{ delay: 0.6, duration: 0.8 }}
							className="mt-8 lg:mt-0"
						>
							<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative overflow-visible">
								<motion.div
									className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
									animate={{ opacity: [0.5, 0.8, 0.5] }}
									transition={{ duration: 4, repeat: Infinity }}
								/>
								<CardHeader className="relative z-10">
									<div className="flex items-center justify-between">
										<CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
											Generate Voice
											<Badge className="bg-primary/20 text-primary animate-pulse text-xs">
												AI Powered
											</Badge>
											{/* Locked Voice Images Row */}
											<div className="flex items-center gap-1 ml-2">
												{Object.entries(lockedVoiceImages).map(
													([type, img], idx) => (
														<motion.div
															key={type}
															className="relative group cursor-pointer"
															whileHover={{ scale: 1.08 }}
															onClick={() => smoothScrollTo("pricing")}
														>
															<img
																src={img}
																alt={`Locked ${type}`}
																className="w-10 h-10 rounded-full object-cover filter blur-[0.5px] brightness-90 border-2 border-primary/30"
															/>
															<span className="absolute left-1/2 -bottom-7 -translate-x-1/2 whitespace-nowrap bg-background/90 text-xs text-primary px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity z-20">
																Click to unlock
															</span>
														</motion.div>
													)
												)}
											</div>
										</CardTitle>
									</div>
								</CardHeader>
								<CardContent className="space-y-6 relative z-10">
									<div className="space-y-3">
										<label className="text-sm font-medium">
											Select Voice Model
										</label>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											{voices.slice(0, 4).map((voice) => (
												<motion.div
													key={voice.name}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
												>
													<Button
														variant={
															selectedVoice === voice.name
																? "whispr-primary"
																: "outline"
														}
														className="w-full h-auto p-3 justify-start relative overflow-hidden"
														onClick={() => setSelectedVoice(voice.name)}
													>
														<div className="flex items-center gap-3 w-full">
															<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
																<img
																	src={voice.image}
																	alt={voice.name}
																	className="w-full h-full object-cover"
																/>
															</div>
															<div className="text-left flex-1 min-w-0">
																<div className="font-medium text-xs sm:text-sm truncate">
																	{voice.name}
																</div>
																<div className="text-xs opacity-70 truncate">
																	{voice.type}
																</div>
															</div>
														</div>
														{selectedVoice === voice.name && (
															<div className="absolute right-2">
																<WaveAnimation isActive={true} />
															</div>
														)}
													</Button>
												</motion.div>
											))}
										</div>
									</div>

									<div className="space-y-3">
										<label className="text-sm font-medium">Your Message</label>
										<Textarea
											placeholder="Type your message here..."
											value={message}
											onChange={(e) => {
												setMessage(e.target.value);
												setIsTyping(e.target.value.length > 0);
											}}
											className="min-h-[100px] bg-input/50 border-border/50 focus:border-primary/50 transition-colors"
										/>
										{isTyping && (
											<motion.div
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												className="flex justify-center"
											>
												<WaveAnimation isActive={true} />
											</motion.div>
										)}
									</div>

									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className="flex items-center gap-2 relative"
									>
										<Button
											variant="whispr-primary"
											className="w-full relative overflow-hidden group flex-1"
											size="lg"
											onClick={() =>
												handleGenerateFromWidget(selectedVoice, message)
											}
										>
											<motion.div
												animate={{ scale: [1, 1.05, 1] }}
												transition={{ duration: 2, repeat: Infinity }}
												className="absolute inset-0 bg-gradient-to-r from-primary via-primary-hover to-primary opacity-80"
											/>
											<span className="relative z-10 flex items-center gap-2">
												Generate Voice Note
											</span>
											<motion.div
												animate={{ rotate: 360 }}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: "linear",
												}}
												className="ml-2 relative z-10"
											>
												<Mic className="h-4 w-4" />
											</motion.div>
										</Button>
										{/* Small dropdown button on the right */}
										<div className="relative">
											<Button
												variant="outline"
												size="icon"
												className="ml-2 flex-shrink-0 w-10 h-10 rounded-full border-primary/30 border-2 bg-background hover:bg-primary/10 transition"
												onClick={(e) => {
													e.stopPropagation();
													setShowVoiceDropdown((v) => !v);
												}}
												aria-label="Show all voices"
											>
												<ChevronDown className="w-5 h-5 text-primary" />
											</Button>
											{showVoiceDropdown && (
												<div
													ref={voiceDropdownRef}
													className="absolute right-0 top-full mt-2 w-96 max-h-80 overflow-y-auto bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl p-4"
													style={{
														zIndex: 9999,
														boxShadow:
															"0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.1)",
													}}
												>
													<div className="flex gap-2 mb-4 flex-wrap">
														{categories.map((cat) => (
															<Button
																key={cat}
																variant={
																	selectedVoiceFilter === cat
																		? "whispr-primary"
																		: "outline"
																}
																className="rounded-full text-xs px-3 py-1.5 h-auto border-border/30 hover:border-primary/50 transition-all"
																onClick={() => setSelectedVoiceFilter(cat)}
															>
																{cat}
															</Button>
														))}
													</div>
													{groupedMockVoices
														.filter(
															(g) =>
																selectedVoiceFilter === "All" ||
																g.category === selectedVoiceFilter
														)
														.map((group) => (
															<div key={group.category} className="mb-2">
																<div className="font-semibold text-primary mb-1 text-sm pl-1">
																	{group.category}
																</div>
																<div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
																	{group.voices.map((voice) => (
																		<div
																			key={voice.name}
																			className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition hover:bg-primary/10 border border-transparent ${selectedVoice === voice.name
																				? "border-primary bg-primary/10"
																				: ""
																				}`}
																			onClick={() => {
																				setSelectedVoice(voice.name);
																				setShowVoiceDropdown(false);
																			}}
																		>
																			{voice.image ? (
																				<img
																					src={voice.image}
																					alt={voice.name}
																					className="w-12 h-12 rounded-full object-cover mb-1 border border-primary/20"
																				/>
																			) : (
																				<div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary mb-1 border border-primary/20">
																					{voice.avatar}
																				</div>
																			)}
																			<span className="text-xs font-medium truncate w-full text-center">
																				{voice.name}
																			</span>
																		</div>
																	))}
																</div>
															</div>
														))}
												</div>
											)}
										</div>
									</motion.div>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				id="features"
				ref={featuresRef}
				className="py-20 px-4 bg-secondary/20 relative"
			>
				<div className="container mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={featuresInView ? { opacity: 1, y: 0 } : {}}
						className="text-center mb-16"
					>
						<h2 className="text-4xl font-bold mb-4">
							Everything You Need For Perfect Voice Notes
						</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Our platform offers all the tools you need to create engaging,
							realistic voice content with stunning AI personalities.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								icon: Mic,
								title: "Realistic AI Voice Generation",
								description:
									"Create ultra-realistic voice notes with stunning AI personalities that sound natural and engaging.",
								delay: 0,
							},
							{
								icon: User,
								title: "Beautiful Voice Models",
								description:
									"Choose from gorgeous AI models, each with unique personalities and voice styles to match your content.",
								delay: 0.2,
							},
							{
								icon: Download,
								title: "Instant MP3 Downloads",
								description:
									"Generate and download high-quality MP3 files instantly for use across your platforms.",
								delay: 0.4,
							},
						].map((feature, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 50 }}
								animate={featuresInView ? { opacity: 1, y: 0 } : {}}
								transition={{ delay: feature.delay, duration: 0.6 }}
								whileHover={{ scale: 1.05, y: -5 }}
								className="group"
							>
								<Card className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur border-border/20 shadow-card hover:shadow-purple transition-all duration-300 h-full">
									<CardHeader>
										<motion.div
											className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors"
											whileHover={{ rotate: 360, scale: 1.1 }}
											transition={{ duration: 0.6 }}
										>
											<feature.icon className="h-6 w-6 text-primary" />
										</motion.div>
										<CardTitle className="group-hover:text-primary transition-colors">
											{feature.title}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground">
											{feature.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section - Updated with Video Style */}
			<section ref={stepsRef} className="py-20 px-4">
				<div className="container mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={stepsInView ? { opacity: 1, y: 0 } : {}}
						className="text-center mb-16"
					>
						<h2 className="text-4xl font-bold mb-4">How Seducely AI Works</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Transform your creative vision into reality with our powerful
							AI-driven workflow in just three simple steps.
						</p>
					</motion.div>

					<div className="space-y-20">
						{/* Step 1 */}
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={stepsInView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: 0.2 }}
							className="grid lg:grid-cols-2 gap-12 items-center"
						>
							<div className="space-y-6">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-full bg-gradient-purple flex items-center justify-center">
										<span className="text-white font-bold text-lg">1</span>
									</div>
									<h3 className="text-3xl font-bold">Choose Your Voice Model</h3>
								</div>
								<p className="text-lg text-muted-foreground">
									Select from our stunning collection of AI voice models, each with 
									unique personalities and captivating styles. From sweet and caring 
									to confident and alluring, find the perfect voice for your content.
								</p>
								<div className="flex gap-4">
									<Button variant="whispr-primary" onClick={() => navigate("/waitlist")}>
										Join Waitlist
									</Button>
									<Button variant="whispr-outline" onClick={() => smoothScrollTo("voices")}>
										View Models
									</Button>
								</div>
							</div>
							<div className="relative">
								<div className="aspect-video bg-card/50 backdrop-blur border border-border/20 rounded-xl shadow-card flex items-center justify-center overflow-hidden relative">
									<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
									<div className="relative z-10 text-center space-y-4">
										<div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
											<User className="h-8 w-8 text-primary" />
										</div>
										<p className="text-muted-foreground">Video Coming Soon</p>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Step 2 */}
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={stepsInView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: 0.4 }}
							className="grid lg:grid-cols-2 gap-12 items-center"
						>
							<div className="lg:order-2 space-y-6">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-full bg-gradient-purple flex items-center justify-center">
										<span className="text-white font-bold text-lg">2</span>
									</div>
									<h3 className="text-3xl font-bold">Create Your Message</h3>
								</div>
								<p className="text-lg text-muted-foreground">
									Write your custom message or choose from our pre-written templates. 
									Our AI will transform your text into natural-sounding, engaging 
									voice notes that captivate your audience.
								</p>
								<div className="flex gap-4">
									<Button variant="whispr-primary" onClick={() => navigate("/waitlist")}>
										Get Early Access
									</Button>
									<Button variant="whispr-outline" onClick={handleDemoClick}>
										Try Demo
									</Button>
								</div>
							</div>
							<div className="lg:order-1 relative">
								<div className="aspect-video bg-card/50 backdrop-blur border border-border/20 rounded-xl shadow-card flex items-center justify-center overflow-hidden relative">
									<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
									<div className="relative z-10 text-center space-y-4">
										<div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
											<Pen className="h-8 w-8 text-primary" />
										</div>
										<p className="text-muted-foreground">Video Coming Soon</p>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Step 3 */}
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={stepsInView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: 0.6 }}
							className="grid lg:grid-cols-2 gap-12 items-center"
						>
							<div className="space-y-6">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-full bg-gradient-purple flex items-center justify-center">
										<span className="text-white font-bold text-lg">3</span>
									</div>
									<h3 className="text-3xl font-bold">Generate & Share</h3>
								</div>
								<p className="text-lg text-muted-foreground">
									Watch as our advanced AI generates your voice note in seconds. 
									Download high-quality MP3 files and share your captivating content 
									across all your platforms to engage and grow your audience.
								</p>
								<div className="flex gap-4">
									<Button variant="whispr-primary" onClick={() => navigate("/waitlist")}>
										Start Creating
									</Button>
									<Button variant="whispr-outline" onClick={() => smoothScrollTo("pricing")}>
										View Pricing
									</Button>
								</div>
							</div>
							<div className="relative">
								<div className="aspect-video bg-card/50 backdrop-blur border border-border/20 rounded-xl shadow-card flex items-center justify-center overflow-hidden relative">
									<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
									<div className="relative z-10 text-center space-y-4">
										<div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
											<Share className="h-8 w-8 text-primary" />
										</div>
										<p className="text-muted-foreground">Video Coming Soon</p>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Premium Voices Section */}
			<section id="voices" className="py-20 px-4 bg-secondary/20">
				<div className="container mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4">
							Discover Our Premium Voice Models
						</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Meet our stunning AI voice models. Each with unique personalities,
							styles, and captivating voices designed to enchant your audience.
						</p>
					</div>

					<div className="flex flex-wrap justify-center gap-2 mb-12">
						{voiceFilters.map((filter, index) => (
							<motion.div
								key={filter}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.1 }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									variant={
										selectedVoiceFilter === filter
											? "whispr-primary"
											: "outline"
									}
									onClick={() => setSelectedVoiceFilter(filter)}
									className="rounded-full relative overflow-hidden"
								>
									{selectedVoiceFilter === filter && (
										<motion.div
											layoutId="activeFilter"
											className="absolute inset-0 bg-primary"
											initial={false}
											transition={{
												type: "spring",
												stiffness: 300,
												damping: 30,
											}}
										/>
									)}
									<span className="relative z-10">{filter}</span>
								</Button>
							</motion.div>
						))}
						{/* Premium Dropdown for Premium Users */}
						{user?.isPremium ? (
							<div className="relative">
								<Button
									variant="whispr-primary"
									className="rounded-full flex items-center gap-2"
									onClick={() => setShowPremiumDropdown((v) => !v)}
								>
									<ChevronDown className="w-4 h-4" />
									<span>Premium Voices</span>
								</Button>
								{showPremiumDropdown && (
									<div className="absolute left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50 p-4 grid grid-cols-1 gap-2">
										{premiumVoices.map((voice) => (
											<div
												key={voice.name}
												className="flex items-center gap-3 cursor-pointer hover:bg-primary/10 rounded p-2"
												onClick={() => {
													setSelectedVoice(voice.name);
													setShowPremiumDropdown(false);
												}}
											>
												<img
													src={voice.image}
													alt={voice.name}
													className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
												/>
												<div className="flex-1 min-w-0">
													<div className="font-medium text-sm truncate">
														{voice.name}
													</div>
													<div className="text-xs opacity-70 truncate">
														{voice.type}
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						) : (
							<Button
								variant="whispr-primary"
								className="rounded-full flex items-center gap-2 transition-colors bg-primary text-white hover:bg-primary/80 hover:brightness-125 relative"
								onClick={() => smoothScrollTo("pricing")}
							>
								<Lock className="w-4 h-4" />
								<span>UNLOCK FOR ALL VOICES</span>
							</Button>
						)}
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{filteredVoices.map((voice, index) => (
							<motion.div
								key={voice.name}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								whileHover={{ scale: 1.02 }}
								className="group"
							>
								{/* Unlocked Voice Card */}
								<Card
									className={`bg-card/50 backdrop-blur border-border/20 shadow-card hover:shadow-purple transition-all duration-300 cursor-pointer relative overflow-hidden ${selectedVoice === voice.name
										? "border-primary ring-2 ring-primary/20"
										: ""
										}`}
									onClick={() => setSelectedVoice(voice.name)}
								>
									<motion.div
										className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100"
										transition={{ duration: 0.3 }}
									/>
									<CardHeader className="relative z-10 p-4">
										<div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
											<img
												src={voice.image}
												alt={voice.name}
												className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
											/>
											<motion.div
												className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100"
												transition={{ duration: 0.3 }}
											/>
											{selectedVoiceFilter === voice.type && (
												<motion.div
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
												>
													<Star className="h-3 w-3 text-white" />
												</motion.div>
											)}
										</div>
										<div className="text-center">
											<CardTitle className="text-lg mb-1">
												👄 {voice.name}
											</CardTitle>
											<p className="text-sm text-muted-foreground mb-2">
												🎭 {voice.personality}
											</p>
											<p className="text-xs italic text-muted-foreground mb-3">
												"{voice.quote}"
											</p>
											<Badge variant="outline" className="text-xs mb-3">
												{voice.type}
											</Badge>
										</div>
									</CardHeader>
									<CardFooter className="relative z-10 p-4 pt-0 flex gap-2">
										<Button
											variant="outline"
											size="sm"
											className="flex-1"
											onClick={(e) => {
												e.stopPropagation();
												handlePreview(voice);
											}}
										>
											🔊 Preview
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={(e) => {
												e.stopPropagation();
												handleDownload(voice);
											}}
										>
											⬇
										</Button>
									</CardFooter>
								</Card>
							</motion.div>
						))}
						{/* Locked Card for selected filter (not All) */}
						{selectedVoiceFilter !== "All" &&
							lockedVoiceImages[selectedVoiceFilter] && (
								<motion.div
									key="locked-card"
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
									whileHover={{ scale: 1.02 }}
									className="group"
								>
									<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative overflow-hidden opacity-80 cursor-not-allowed">
										<div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
											<img
												src={lockedVoiceImages[selectedVoiceFilter]}
												alt={`Locked ${selectedVoiceFilter}`}
												className="w-full h-full object-cover filter blur-[2px] brightness-75"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
												<Lock className="h-10 w-10 text-primary drop-shadow-lg" />
											</div>
										</div>
										<div className="text-center">
											<CardTitle className="text-lg mb-1 flex items-center justify-center gap-2">
												<Lock className="h-4 w-4 text-primary" />
												Locked {selectedVoiceFilter} Voice
											</CardTitle>
											<p className="text-sm text-muted-foreground mb-2">
												Unlock this stunning {selectedVoiceFilter.toLowerCase()}{" "}
												voice by upgrading your plan.
											</p>
											<Badge variant="outline" className="text-xs mb-3">
												{selectedVoiceFilter}
											</Badge>
										</div>
										<CardFooter className="relative z-10 p-4 pt-0 flex gap-2">
											<Button
												variant="whispr-primary"
												size="sm"
												className="flex-1 opacity-80 cursor-not-allowed"
												disabled
											>
												<Lock className="h-4 w-4 mr-2" /> Locked
											</Button>
										</CardFooter>
									</Card>
								</motion.div>
							)}
					</div>
				</div>
			</section>

			{/* Enhanced Pricing Section */}
			<section id="pricing" className="py-20 px-4 relative overflow-hidden">
				{/* Background Effects */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
					className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
				/>

				<div className="container mx-auto relative z-10">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4">
							Simple, Credit-Based Pricing
						</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Choose the perfect plan for your voice creation needs. Pay for
							what you use with our flexible credit system.
						</p>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground"
						>
							<span>Trusted by</span>
							<span className="font-bold text-primary">
								<AnimatedCounter end={15000} suffix="+" />
							</span>
							<span>creators worldwide</span>
						</motion.div>
					</div>

					<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							whileHover={{ scale: 1.02 }}
						>
							<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card h-full relative">
								<CardHeader>
									<CardTitle className="text-2xl">Starter Plan</CardTitle>
									<CardDescription>Perfect for getting started</CardDescription>
									<div className="text-4xl font-bold">
										$19
										<span className="text-lg text-muted-foreground">
											/month
										</span>
									</div>
									<div className="text-sm text-primary font-medium">
										50 Voice Credits Included
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center gap-2 mb-4">
										<span className="text-sm text-muted-foreground">
											Includes voices:
										</span>
										<div className="flex -space-x-2">
											{voices.slice(0, 2).map((voice, index) => (
												<div
													key={index}
													className="w-6 h-6 rounded-full border-2 border-background overflow-hidden"
												>
													<img
														src={voice.image}
														alt={voice.name}
														className="w-full h-full object-cover"
													/>
												</div>
											))}
										</div>
									</div>
									<ul className="space-y-3">
										{[
											"50 AI Voice Credits",
											"Access to Linh & Miara",
											"MP3 Downloads",
											"Basic Voice Quality",
											"Email Support",
										].map((feature, index) => (
											<motion.li
												key={index}
												initial={{ opacity: 0, x: -20 }}
												whileInView={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.1 }}
												className="flex items-center gap-2"
											>
												<div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
													<span className="text-green-500 text-xs">✓</span>
												</div>
												{feature}
											</motion.li>
										))}
									</ul>
								</CardContent>
								<CardFooter>
									<Button variant="outline" className="w-full">
										Get Started
									</Button>
								</CardFooter>
							</Card>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							whileHover={{ scale: 1.05 }}
							className="relative"
						>
							<motion.div
								initial={{ y: -20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
							>
								<motion.div
									animate={{ rotate: [0, 5, -5, 0] }}
									transition={{ duration: 2, repeat: Infinity }}
								>
									<Badge className="bg-primary px-4 py-2 text-white font-bold animate-pulse shadow-lg">
										🔥 Most Popular
									</Badge>
								</motion.div>
							</motion.div>

							<Card className="bg-gradient-to-br from-card/80 to-primary/10 backdrop-blur border-primary/50 shadow-purple h-full relative overflow-hidden">
								<motion.div
									animate={{ scale: [1, 1.1, 1] }}
									transition={{ duration: 3, repeat: Infinity }}
									className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"
								/>
								<CardHeader className="relative z-10">
									<CardTitle className="text-2xl">Creator Plan</CardTitle>
									<CardDescription>
										Most popular for content creators
									</CardDescription>
									<div className="text-4xl font-bold">
										$49
										<span className="text-lg text-muted-foreground">
											/month
										</span>
									</div>
									<div className="text-sm text-primary font-medium">
										200 Voice Credits Included
									</div>
								</CardHeader>
								<CardContent className="space-y-4 relative z-10">
									<div className="flex items-center gap-2 mb-4">
										<span className="text-sm text-muted-foreground">
											All voice models:
										</span>
										<div className="flex -space-x-2">
											{voices.map((voice, index) => (
												<div
													key={index}
													className="w-6 h-6 rounded-full border-2 border-background overflow-hidden"
												>
													<img
														src={voice.image}
														alt={voice.name}
														className="w-full h-full object-cover"
													/>
												</div>
											))}
										</div>
									</div>
									<ul className="space-y-3">
										{[
											"200 AI Voice Credits",
											"All Voice Models (Linh, Miara, Madison, Aria)",
											"Premium Voice Quality",
											"MP3 & WAV Downloads",
											"Priority Support",
											"Early Access to New Voices",
										].map((feature, index) => (
											<motion.li
												key={index}
												initial={{ opacity: 0, x: -20 }}
												whileInView={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.1 }}
												className="flex items-center gap-2"
											>
												<div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
													<span className="text-green-500 text-xs">✓</span>
												</div>
												{feature}
											</motion.li>
										))}
									</ul>
								</CardContent>
								<CardFooter className="relative z-10">
									<Button variant="whispr-primary" className="w-full">
										Subscribe Now
									</Button>
								</CardFooter>
							</Card>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Creator Success Stories Section */}
			<section className="py-20 px-4 bg-secondary/10">
				<div className="container mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						className="text-center mb-12"
					>
						<h3 className="text-3xl font-bold mb-4">Creator Success Stories</h3>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							See how creators are achieving incredible results with Seducely AI
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						{[
							{
								metric: "500K+",
								label: "Monthly Streams",
								creator: "@VoiceQueen",
							},
							{
								metric: "$12K",
								label: "Monthly Revenue",
								creator: "@AIVoicePro",
							},
							{
								metric: "50K+",
								label: "New Followers",
								creator: "@SeductiveAI",
							},
						].map((result, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.2 }}
								whileHover={{ scale: 1.05 }}
								className="bg-card/50 backdrop-blur rounded-xl p-8 border border-border/20 shadow-card hover:shadow-purple transition-all duration-300"
							>
								<div className="text-4xl font-bold text-primary mb-3">
									{result.metric}
								</div>
								<div className="text-lg font-medium mb-2">{result.label}</div>
								<div className="text-sm text-primary font-medium">
									{result.creator}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-20 px-4 bg-secondary/20">
				<div className="container mx-auto max-w-4xl">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4">
							Frequently Asked Questions
						</h2>
						<p className="text-xl text-muted-foreground">
							Find answers to common questions about Seducely AI. If you don't
							see what you're looking for, reach out to our support team.
						</p>
					</div>

					<Accordion type="single" collapsible className="space-y-4">
						{[
							{
								icon: Lightbulb,
								question: "What is Seducely AI?",
								answer:
									"Seducely AI is an advanced AI voice generation platform that creates ultra-realistic voice notes from text. Our technology allows you to choose from various voice personalities and styles to create engaging audio content.",
							},
							{
								icon: Brain,
								question: "How does the credit system work?",
								answer:
									"Each voice generation uses one credit. Credits reset monthly with your subscription. Unused credits don't roll over, but you can always upgrade your plan for more credits.",
							},
						].map((faq, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<AccordionItem
									value={`item-${index + 1}`}
									className="bg-card/50 backdrop-blur border border-border/20 rounded-lg px-6"
								>
									<AccordionTrigger className="text-left hover:no-underline group">
										<div className="flex items-center gap-3">
											<motion.div
												whileHover={{ rotate: 360, scale: 1.1 }}
												transition={{ duration: 0.5 }}
												className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30"
											>
												<faq.icon className="h-4 w-4 text-primary" />
											</motion.div>
											<span>{faq.question}</span>
										</div>
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground pl-11">
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
										>
											{faq.answer}
										</motion.div>
									</AccordionContent>
								</AccordionItem>
							</motion.div>
						))}
					</Accordion>
				</div>
			</section>

			{/* Enhanced Final CTA Section */}
			<section className="py-20 px-4 relative overflow-hidden">
				{/* Glassmorphism Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20" />
				<motion.div
					animate={{
						background: [
							"radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
							"radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
							"radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
						],
					}}
					transition={{ duration: 8, repeat: Infinity }}
					className="absolute inset-0"
				/>

				{/* Voice Wave Animation Background */}
				<div className="absolute inset-0 flex items-center justify-center opacity-10">
					<motion.div
						animate={{ scale: [1, 1.5, 1] }}
						transition={{ duration: 4, repeat: Infinity }}
						className="w-96 h-96"
					>
						<WaveAnimation isActive={true} />
					</motion.div>
				</div>

				<div className="container mx-auto text-center relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						className="max-w-4xl mx-auto space-y-8 bg-card/20 backdrop-blur-lg rounded-2xl p-12 border border-border/20"
					>
						<motion.h2
							className="text-4xl lg:text-5xl font-bold"
							animate={{
								backgroundImage: [
									"linear-gradient(45deg, #ffffff, #8b5cf6)",
									"linear-gradient(45deg, #8b5cf6, #ffffff)",
									"linear-gradient(45deg, #ffffff, #8b5cf6)",
								],
							}}
							transition={{ duration: 3, repeat: Infinity }}
							style={{
								backgroundClip: "text",
								WebkitBackgroundClip: "text",
								color: "transparent",
							}}
						>
							Ready to Create Your First Seductive AI Voice Note?
						</motion.h2>
						<p className="text-xl text-muted-foreground">
							Join thousands of creators already using Seducely AI to connect
							with their audience through stunning AI voice models.
						</p>

						{/* Urgency Timer */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6"
						>
							<div className="flex items-center justify-center gap-2 text-primary">
								<Clock className="h-5 w-5" />
								<span className="font-bold">
									New voices dropping July 10th — Early access ends in 3 days!
								</span>
							</div>
						</motion.div>

						{/* Social Proof */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							className="flex flex-wrap justify-center gap-6 text-sm"
						>
							<div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
								<Bell className="h-4 w-4 text-primary" />
								<span>
									Loved by <AnimatedCounter end={15000} suffix="+" /> creators
								</span>
							</div>
							<div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
								<span className="text-primary">#1</span>
								<span>Seductive AI Voice Tool</span>
							</div>
						</motion.div>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									variant="whispr-primary"
									size="lg"
									className="relative overflow-hidden group"
									onClick={handleStartCreating}
								>
									<motion.div
										animate={{
											boxShadow: [
												"0 0 20px rgba(139, 92, 246, 0.5)",
												"0 0 40px rgba(139, 92, 246, 0.8)",
												"0 0 20px rgba(139, 92, 246, 0.5)",
											],
										}}
										transition={{ duration: 2, repeat: Infinity }}
										className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
									/>
									<span className="relative z-10">Get Started Free</span>
								</Button>
							</motion.div>
							<Button
								variant="link"
								size="lg"
								className="text-primary hover:text-primary-hover"
								onClick={handleDemoClick}
							>
								<Play className="h-4 w-4 mr-2" />
								Try Live Demo
							</Button>
						</div>

						<motion.p
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="text-sm text-muted-foreground"
						>
							No credit card required to start • Cancel anytime • Free tier
							available
						</motion.p>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default Index;
