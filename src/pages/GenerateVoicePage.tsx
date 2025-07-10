import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import GenerateVoiceWidget from "@/components/GenerateVoiceWidget";
import VoiceHistory from "@/components/VoiceHistory";
import CustomAudioPlayer from "@/components/CustomAudioPlayer";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";

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

const GenerateVoicePage = () => {
	const location = useLocation();
	const { user: authUser, refreshUser } = useAuth();
	const [user, setUser] = useState(authUser);
	const { toast } = useToast();
	const [selectedVoice, setSelectedVoice] = useState("Linh");
	const [message, setMessage] = useState("");
	const [isTyping, setIsTyping] = useState(false);

	// Responsive state
	const [isMobile, setIsMobile] = useState(false);
	const [historyOpen, setHistoryOpen] = useState(true);
	const [refreshHistory, setRefreshHistory] = useState(0);
	const [isGenerating, setIsGenerating] = useState(false);

	// Generated audio state
	const [generatedAudio, setGeneratedAudio] = useState<{
		audioBase64: string;
		filename: string;
		voiceName: string;
		text: string;
	} | null>(null);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	// Add state for voiceChangedAudioUrl
	const [voiceChangedAudioUrl, setVoiceChangedAudioUrl] = useState<
		string | null
	>(null);

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

	// Cleanup audio URL when component unmounts
	useEffect(() => {
		return () => {
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
		};
	}, [audioUrl]);

	// Fetch latest user profile on mount and map is_premium to isPremium locally
	useEffect(() => {
		const fetchProfile = async () => {
			if (typeof refreshUser === "function") {
				await refreshUser();
			}
			const response = await api.getProfile();
			if (response.success && response.user) {
				setUser({
					...response.user,
					isPremium:
						response.user.isPremium ?? response.user.is_premium ?? false,
				});
			}
		};
		fetchProfile();
	}, []);

	// Toggle history panel (only on mobile)
	const toggleHistory = () => {
		if (isMobile) setHistoryOpen((open) => !open);
	};

	// Handle download
	const handleDownload = () => {
		if (audioUrl) {
			const link = document.createElement("a");
			link.href = audioUrl;
			link.download = generatedAudio?.filename || `${selectedVoice}_audio.mp3`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	// Handle voice generation from the widget
	const handleGenerateVoice = useCallback(
		async (voice: string, text: string) => {
			setIsGenerating(true);
			setGeneratedAudio(null);
			setAudioUrl(null);

			try {
				// Check credits before generating
				if (user && user.credits !== undefined && user.credits <= 0) {
					toast({
						title: "Insufficient Credits",
						description:
							"You don't have enough credits to generate voice. Please upgrade your plan.",
						variant: "destructive",
					});
					return;
				}

				// Check if the selected voice is one of the predefined voices
				const predefinedVoices = voices.map((v) => v.name);
				if (predefinedVoices.includes(voice)) {
					// Use the standard voice generation endpoint
					const response = await api.generateVoice(voice, text);
					if (response.success && response.data && response.data.audioBase64) {
						// Refresh the voice history
						setRefreshHistory((prev) => prev + 1);

						// Process the audio and create URL for CustomAudioPlayer
						try {
							const binaryString = atob(response.data.audioBase64);
							const bytes = new Uint8Array(binaryString.length);
							for (let i = 0; i < binaryString.length; i++) {
								bytes[i] = binaryString.charCodeAt(i);
							}
							const audioBlob = new Blob([bytes], { type: "audio/mp3" });
							const url = URL.createObjectURL(audioBlob);
							setAudioUrl(url);
							setGeneratedAudio(response.data);

							// Show success toast
							toast({
								title: "Voice Generated!",
								description: `Successfully generated voice with ${voice}. Use the player below to listen.`,
							});
						} catch (audioError) {
							console.error("Error processing audio:", audioError);
							toast({
								title: "Audio Processing Error",
								description:
									"Error processing the generated audio. Please try again.",
								variant: "destructive",
							});
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

						// Process the audio and create URL for CustomAudioPlayer
						try {
							const binaryString = atob(data.data.audioBase64);
							const bytes = new Uint8Array(binaryString.length);
							for (let i = 0; i < binaryString.length; i++) {
								bytes[i] = binaryString.charCodeAt(i);
							}
							const audioBlob = new Blob([bytes], { type: "audio/mp3" });
							const url = URL.createObjectURL(audioBlob);
							setAudioUrl(url);
							setGeneratedAudio(data.data);

							// Show success toast
							toast({
								title: "Voice Generated!",
								description: `Successfully generated voice with ${voice}. Use the player below to listen.`,
							});
						} catch (audioError) {
							console.error("Error processing audio:", audioError);
							toast({
								title: "Audio Processing Error",
								description:
									"Error processing the generated audio. Please try again.",
								variant: "destructive",
							});
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
				if (error instanceof Error) {
					if (error.message.includes("Insufficient credits")) {
						toast({
							title: "Insufficient Credits",
							description: error.message,
							variant: "destructive",
						});
					} else if (
						error.message.includes("No token found") ||
						error.message.includes("401") ||
						error.message.includes("403")
					) {
						toast({
							title: "Authentication Error",
							description: "Please log in again to continue.",
							variant: "destructive",
						});
					} else {
						toast({
							title: "Generation Failed",
							description:
								error.message || "Failed to generate voice. Please try again.",
							variant: "destructive",
						});
					}
				} else {
					toast({
						title: "Generation Failed",
						description: "Failed to generate voice. Please try again.",
						variant: "destructive",
					});
				}
			} finally {
				setIsGenerating(false);
			}
		},
		[voices, user, toast]
	);

	return (
		<DashboardLayout>
			{/* Mobile History Toggle */}
			{isMobile && (
				<div className="p-4 border-b border-border/20">
					<Button
						variant="ghost"
						onClick={toggleHistory}
						className="w-full justify-between"
					>
						<span>Voice History</span>
						{historyOpen ? (
							<X className="h-4 w-4" />
						) : (
							<Menu className="h-4 w-4" />
						)}
					</Button>
				</div>
			)}

			{/* Main Content with Sidebar Layout */}
			<div
				className={
					isMobile
						? "flex flex-col overflow-y-auto min-h-[calc(100vh-120px)]"
						: "flex h-[calc(100vh-120px)]"
				}
			>
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
					<div className={isMobile ? "p-6" : "p-6 h-full"}>
						<GenerateVoiceWidget
							voices={voices}
							selectedVoice={selectedVoice}
							setSelectedVoice={setSelectedVoice}
							message={message}
							setMessage={setMessage}
							isTyping={isTyping}
							setIsTyping={setIsTyping}
							user={user}
							onVoiceChanged={() => setRefreshHistory((prev) => prev + 1)}
							onAudioGenerated={(url, data) => {
								console.log("Audio generated (GenerateVoicePage):", url, data);
								setAudioUrl(url);
								setGeneratedAudio(data);
								setVoiceChangedAudioUrl(null);
							}}
							onVoiceChangedAudio={(url) => {
								setVoiceChangedAudioUrl(url);
								setAudioUrl(null);
								setGeneratedAudio(null);
							}}
						/>
						{/* Place CustomAudioPlayer below the widget, not inside it */}
					</div>
					{/* Below the widget, render CustomAudioPlayer for either generatedAudio/audioUrl or voiceChangedAudioUrl */}
					{audioUrl || voiceChangedAudioUrl ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="px-6 pb-6"
						>
							<CustomAudioPlayer
								audioUrl={voiceChangedAudioUrl || audioUrl!}
								filename={generatedAudio?.filename}
								onDownload={handleDownload}
								generatedVoiceData={
									generatedAudio
										? {
												voiceName: generatedAudio.voiceName,
												text: generatedAudio.text,
												image: voices.find(
													(v) => v.name === generatedAudio.voiceName
												)?.image,
										  }
										: undefined
								}
							/>
						</motion.div>
					) : null}
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
						className="bg-background/30 backdrop-blur h-full"
					>
						<div className="p-6 h-full max-h-full overflow-y-auto">
							<VoiceHistory
								isMobile={isMobile}
								refreshTrigger={refreshHistory}
							/>
						</div>
					</motion.div>
				)}
			</div>
		</DashboardLayout>
	);
};

export default GenerateVoicePage;
