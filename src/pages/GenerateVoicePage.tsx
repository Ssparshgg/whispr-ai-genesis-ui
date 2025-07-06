import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Home, Menu, X, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import GenerateVoiceWidget from "@/components/GenerateVoiceWidget";
import VoiceHistory from "@/components/VoiceHistory";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const voices = [
	{
		name: "Linh",
		type: "Sweet",
		description: "Sweet Asian voice with gentle, caring tone",
		avatar: "L",
		quote: "Let me take care of you with my sweet voice...",
		image: "/lovable-uploads/14409e85-31c6-4734-9111-93f71150b711.png",
		personality: "Sweet & Caring",
	},
	{
		name: "Miara",
		type: "Cute",
		description: "Adorable Chinese voice with playful charm",
		avatar: "M",
		quote: "I'll make your day brighter with my cute voice...",
		image: "/lovable-uploads/8f3d2a00-ac1a-4dc9-beaa-22ce697945f3.png",
		personality: "Cute & Playful",
	},
	{
		name: "Madison",
		type: "Confident",
		description: "American voice with confident, alluring presence",
		avatar: "M",
		quote: "Ready to hear what confidence sounds like?",
		image: "/lovable-uploads/2f12a378-da34-4abd-8eab-18404ff65ac3.png",
		personality: "Confident & Alluring",
	},
	{
		name: "Aria",
		type: "Adventurous",
		description: "Free-spirited voice for those who love adventure",
		avatar: "A",
		quote: "Let's go on an adventure together...",
		image: "/lovable-uploads/53504ad3-684a-409f-a9ab-4cf6045e0388.png",
		personality: "Free & Adventurous",
	},
];

const GenerateVoicePage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { logout } = useAuth();
	const { toast } = useToast();
	const [selectedVoice, setSelectedVoice] = useState("Linh");
	const [message, setMessage] = useState("");
	const [isTyping, setIsTyping] = useState(false);

	// Responsive state
	const [isMobile, setIsMobile] = useState(false);
	const [historyOpen, setHistoryOpen] = useState(true);
	const [refreshHistory, setRefreshHistory] = useState(0);
	const [isGenerating, setIsGenerating] = useState(false);

	// Check for navigation state and pre-fill the form
	useEffect(() => {
		if (location.state) {
			const { selectedVoice: navVoice, message: navMessage } =
				location.state as {
					selectedVoice?: string;
					message?: string;
				};

			if (navVoice) {
				setSelectedVoice(navVoice);
			}
			if (navMessage) {
				setMessage(navMessage);
				setIsTyping(navMessage.length > 0);
			}
		}
	}, [location.state]);

	// Responsive: detect mobile and set historyOpen accordingly
	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.innerWidth < 1024; // lg breakpoint
			setIsMobile(mobile);
			setHistoryOpen(!mobile); // open on desktop, closed on mobile
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Handle logout
	const handleLogout = () => {
		logout();
		navigate("/");
	};

	// Handle home navigation
	const handleHome = () => {
		navigate("/");
	};

	// Handle dashboard navigation
	const handleDashboard = () => {
		navigate("/dashboard");
	};

	// Toggle history panel (only on mobile)
	const toggleHistory = () => {
		if (isMobile) setHistoryOpen((open) => !open);
	};

	// Handle voice generation from the widget
	const handleGenerateVoice = useCallback(
		async (voice: string, text: string) => {
			setIsGenerating(true);
			try {
				// Check if the selected voice is one of the predefined voices
				const predefinedVoices = voices.map((v) => v.name);
				if (predefinedVoices.includes(voice)) {
					// Use the standard voice generation endpoint
					const response = await api.generateVoice(voice, text);
					if (response.success && response.data && response.data.audioBase64) {
						// Refresh the voice history
						setRefreshHistory((prev) => prev + 1);

						// Process the audio and play it automatically
						try {
							const binaryString = atob(response.data.audioBase64);
							const bytes = new Uint8Array(binaryString.length);
							for (let i = 0; i < binaryString.length; i++) {
								bytes[i] = binaryString.charCodeAt(i);
							}
							const audioBlob = new Blob([bytes], { type: "audio/mp3" });
							const audioUrl = URL.createObjectURL(audioBlob);

							// Create and play audio automatically
							const audio = new Audio(audioUrl);
							audio.play().catch((error) => {
								console.error("Error playing audio:", error);
							});

							// Show success toast
							toast({
								title: "Voice Generated!",
								description: `Successfully generated voice with ${voice}. Playing now...`,
							});

							// Clean up the URL after a delay
							setTimeout(() => {
								URL.revokeObjectURL(audioUrl);
							}, 10000);
						} catch (audioError) {
							console.error("Error processing audio:", audioError);
						}
					} else {
						console.error("Invalid response:", response);
						toast({
							title: "Generation Failed",
							description: response.message || "Failed to generate voice",
							variant: "destructive",
						});
					}
				} else {
					// Use the model voice generation endpoint for other voices
					const data = await api.generateVoiceModel(voice, text);
					if (data.success && data.data && data.data.audioBase64) {
						// Refresh the voice history
						setRefreshHistory((prev) => prev + 1);

						// Process the audio and play it automatically
						try {
							const binaryString = atob(data.data.audioBase64);
							const bytes = new Uint8Array(binaryString.length);
							for (let i = 0; i < binaryString.length; i++) {
								bytes[i] = binaryString.charCodeAt(i);
							}
							const audioBlob = new Blob([bytes], { type: "audio/mp3" });
							const audioUrl = URL.createObjectURL(audioBlob);

							// Create and play audio automatically
							const audio = new Audio(audioUrl);
							audio.play().catch((error) => {
								console.error("Error playing audio:", error);
							});

							// Show success toast
							toast({
								title: "Voice Generated!",
								description: `Successfully generated voice with ${voice}. Playing now...`,
							});

							// Clean up the URL after a delay
							setTimeout(() => {
								URL.revokeObjectURL(audioUrl);
							}, 10000);
						} catch (audioError) {
							console.error("Error processing audio:", audioError);
						}
					} else {
						console.error("Invalid response:", data);
						toast({
							title: "Generation Failed",
							description: data.message || "Failed to generate voice",
							variant: "destructive",
						});
					}
				}
			} catch (error) {
				console.error("Error generating voice:", error);
				toast({
					title: "Generation Failed",
					description: "Failed to generate voice. Please try again.",
					variant: "destructive",
				});
			} finally {
				setIsGenerating(false);
			}
		},
		[voices]
	);

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

							{/* Hamburger Menu - only on mobile */}
							{isMobile && (
								<Button
									variant="ghost"
									onClick={toggleHistory}
									className="lg:hidden"
								>
									{historyOpen ? (
										<X className="h-4 w-4" />
									) : (
										<Menu className="h-4 w-4" />
									)}
								</Button>
							)}
						</div>

						<div className="flex items-center space-x-2 sm:space-x-4">
							<Button
								variant="ghost"
								onClick={handleDashboard}
								className="text-xs sm:text-sm px-2 sm:px-4"
							>
								<BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
								<span className="hidden sm:inline">Dashboard</span>
							</Button>
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

			{/* Main Content with Sidebar Layout */}
			<div className="relative z-10 flex h-[calc(100vh-80px)]">
				{/* Left Sidebar - Generate Voice Widget */}
				<motion.div
					initial={false}
					animate={{
						width: historyOpen ? (isMobile ? "0%" : "60%") : "100%",
						opacity: historyOpen && isMobile ? 0 : 1,
					}}
					transition={{ duration: 0.3, ease: "easeInOut" }}
					className={`border-r border-border/20 bg-background/50 backdrop-blur overflow-hidden ${
						historyOpen && isMobile ? "hidden" : "block"
					}`}
				>
					<div className="p-6 h-full overflow-y-auto">
						<GenerateVoiceWidget
							voices={voices}
							selectedVoice={selectedVoice}
							setSelectedVoice={setSelectedVoice}
							message={message}
							setMessage={setMessage}
							isTyping={isTyping}
							setIsTyping={setIsTyping}
							isCompact={true}
							onGenerateClick={handleGenerateVoice}
							isGenerating={isGenerating}
						/>
					</div>
				</motion.div>

				{/* Right Panel - Voice History */}
				{historyOpen && (
					<motion.div
						initial={false}
						animate={{
							width: isMobile ? "100%" : "40%",
							opacity: 1,
						}}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="bg-background/30 backdrop-blur"
					>
						<div className="p-6 h-full">
							<VoiceHistory
								isMobile={isMobile}
								refreshTrigger={refreshHistory}
							/>
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default GenerateVoicePage;
