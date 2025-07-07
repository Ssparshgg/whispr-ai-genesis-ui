import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Loader2, ChevronDown } from "lucide-react";
import WaveAnimation from "@/components/WaveAnimation";
import CustomAudioPlayer from "@/components/CustomAudioPlayer";
import React, { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Voice {
	name: string;
	type: string;
	description: string;
	avatar: string;
	quote: string;
	image: string;
	personality: string;
}

interface GenerateVoiceWidgetProps {
	voices: Voice[];
	selectedVoice: string;
	setSelectedVoice: (voice: string) => void;
	message: string;
	setMessage: (msg: string) => void;
	isTyping: boolean;
	setIsTyping: (typing: boolean) => void;
	onGenerateClick?: (voice: string, text: string) => void;
	isCompact?: boolean;
	isGenerating?: boolean;
}

const lockedVoiceImages: Record<string, string> = {
	Sweet: "/sydney.jpg",
	Cute: "/daissy.jpg",
	Confident: "/kyly.jpg",
	Adventurous: "/lauren.jpg",
};

const GenerateVoiceWidget: React.FC<GenerateVoiceWidgetProps> = ({
	voices,
	selectedVoice,
	setSelectedVoice,
	message,
	setMessage,
	isTyping,
	setIsTyping,
	onGenerateClick,
	isCompact = false,
	isGenerating: externalIsGenerating,
}) => {
	const [isGenerating, setIsGenerating] = useState(false);
	const actualIsGenerating =
		externalIsGenerating !== undefined ? externalIsGenerating : isGenerating;
	const [generatedAudio, setGeneratedAudio] = useState<{
		audioBase64: string;
		filename: string;
		voiceName: string;
		text: string;
	} | null>(null);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const navigate = useNavigate();
	const { toast } = useToast();
	const { user } = useAuth();

	const handleGenerateVoice = async () => {
		if (!message.trim()) {
			toast({
				title: "Message Required",
				description: "Please enter a message to generate voice",
				variant: "destructive",
			});
			return;
		}

		// Check credits before generating (use cached user data if available)
		if (user && user.credits !== undefined && user.credits <= 0) {
			toast({
				title: "Insufficient Credits",
				description:
					"You don't have enough credits to generate voice. Please upgrade your plan.",
				variant: "destructive",
			});
			return;
		}

		// If onGenerateClick is provided and we're in compact mode, call it instead
		if (onGenerateClick && isCompact) {
			onGenerateClick(selectedVoice, message);
			return;
		}

		setIsGenerating(true);
		setGeneratedAudio(null);
		setAudioUrl(null);

		try {
			// Check if the selected voice is one of the predefined voices
			const predefinedVoices = voices.map((v) => v.name);
			if (predefinedVoices.includes(selectedVoice)) {
				// Use the standard voice generation endpoint
				const response = await api.generateVoice(selectedVoice, message);
				if (response.success && response.data && response.data.audioBase64) {
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
							description: `Successfully generated voice with ${selectedVoice}. Use the player below to listen.`,
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
				const data = await api.generateVoiceModel(selectedVoice, message);
				if (data.success && data.data && data.data.audioBase64) {
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
							description: `Successfully generated voice with ${selectedVoice}. Use the player below to listen.`,
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
					// Clear auth and redirect to login
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					navigate("/login");
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
	};

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

	// Cleanup audio URL when component unmounts
	React.useEffect(() => {
		return () => {
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
		};
	}, [audioUrl]);

	const selectedVoiceData = voices.find(
		(voice) => voice.name === selectedVoice
	);

	return (
		<div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto items-stretch">
			{/* Main Left Panel */}
			<div className="flex-1 space-y-6 flex flex-col">
				<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative overflow-hidden flex flex-col h-full">
					<motion.div
						className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
						animate={{ opacity: [0.5, 0.8, 0.5] }}
						transition={{ duration: 4, repeat: Infinity }}
					/>
					<CardHeader className="relative z-10">
						<CardTitle className="flex items-center gap-2">
							Generate Voice
							<Badge className="bg-primary/20 text-primary animate-pulse">
								AI Powered
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6 relative z-10">
						{/* Text Input Section */}
						<div className="space-y-3">
							<label className="text-sm font-medium">
								Your Seducing Text Here
							</label>
							<Textarea
								placeholder="Write the most seducing text here"
								value={message}
								onChange={(e) => {
									setMessage(e.target.value);
									setIsTyping(e.target.value.length > 0);
								}}
								className="min-h-[120px] bg-input/50 border-border/50 focus:border-primary/50 transition-colors resize-none"
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

						{/* Generate Button */}
						<motion.div
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="flex items-center gap-2 relative"
						>
							<Button
								variant="whispr-primary"
								className="w-full relative overflow-hidden group flex-1"
								size="lg"
								onClick={handleGenerateVoice}
								disabled={actualIsGenerating || !message.trim()}
							>
								<motion.div
									animate={{ scale: [1, 1.05, 1] }}
									transition={{ duration: 2, repeat: Infinity }}
									className="absolute inset-0 bg-gradient-to-r from-primary via-primary-hover to-primary opacity-80"
								/>
								<span className="relative z-10">
									{actualIsGenerating ? "Generating..." : "Generate Voice Note"}
								</span>
								<motion.div
									animate={{ rotate: actualIsGenerating ? 360 : 0 }}
									transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
									className="ml-2 relative z-10"
								>
									{actualIsGenerating ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Mic className="h-4 w-4" />
									)}
								</motion.div>
							</Button>
						</motion.div>

						{/* Output Section */}
						{generatedAudio && audioUrl && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="flex flex-col sm:flex-row gap-4 items-start"
							>
								{/* Audio Player */}
								<div className="flex-1">
									<CustomAudioPlayer
										audioUrl={audioUrl}
										filename={generatedAudio.filename}
										onDownload={handleDownload}
										generatedVoiceData={{
											voiceName: generatedAudio.voiceName,
											text: generatedAudio.text,
											image: selectedVoiceData?.image,
										}}
									/>
								</div>

								{/* Generated Model Image */}
								{generatedAudio && selectedVoiceData && (
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										className="flex-shrink-0 self-center sm:self-start"
									>
										<Card className="bg-card/30 backdrop-blur border border-border/30 rounded-xl p-3 shadow-lg">
											<div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-primary/20">
												<img
													src={selectedVoiceData.image}
													alt={generatedAudio.voiceName}
													className="w-full h-full object-cover"
												/>
											</div>
											<div className="mt-2 text-center">
												<div className="font-medium text-sm">
													{generatedAudio.voiceName}
												</div>
												<div className="text-xs opacity-70">
													{selectedVoiceData.type}
												</div>
											</div>
										</Card>
									</motion.div>
								)}
							</motion.div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Right Panel - Voice Models */}
			<div className="w-full lg:w-80 flex flex-col h-full">
				<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative overflow-hidden h-full flex flex-col">
					<motion.div
						className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
						animate={{ opacity: [0.3, 0.6, 0.3] }}
						transition={{ duration: 6, repeat: Infinity }}
					/>
					<CardHeader className="relative z-10 flex flex-row items-center justify-between gap-2">
						<CardTitle className="text-lg whitespace-nowrap">
							Voice Models
						</CardTitle>
						<div className="flex items-center gap-1 ml-2">
							{Object.entries(lockedVoiceImages).map(([type, img]) => (
								<motion.div
									key={type}
									className="relative group cursor-pointer"
									whileHover={{ scale: 1.08 }}
									onClick={() => {
										navigate("/");
										setTimeout(() => {
											const el = document.getElementById("pricing");
											if (el) {
												const headerOffset = 80;
												const elementPosition = el.getBoundingClientRect().top;
												const offsetPosition =
													elementPosition + window.pageYOffset - headerOffset;
												window.scrollTo({
													top: offsetPosition,
													behavior: "smooth",
												});
											}
										}, 100);
									}}
								>
									<img
										src={img}
										alt={`Locked ${type}`}
										className="w-7 h-7 rounded-full object-cover filter blur-[0.5px] brightness-90 border-2 border-primary/30"
									/>
									<span className="absolute left-1/2 -bottom-7 -translate-x-1/2 whitespace-nowrap bg-background/90 text-xs text-primary px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity z-20">
										Click to unlock
									</span>
								</motion.div>
							))}
						</div>
					</CardHeader>
					<CardContent className="space-y-4 relative z-10">
						<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
							{voices.map((voice) => (
								<motion.div
									key={voice.name}
									whileHover={{
										scale: 1.05,
										boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
									}}
									whileTap={{ scale: 0.95 }}
									className="relative"
								>
									<Button
										variant="ghost"
										className={`w-full h-auto p-3 rounded-xl border-2 transition-all duration-300 ${
											selectedVoice === voice.name
												? "border-primary bg-primary/20 shadow-lg shadow-primary/20"
												: "border-border/30 bg-card/30 hover:border-primary/50 hover:bg-primary/10"
										}`}
										onClick={() => setSelectedVoice(voice.name)}
									>
										<div className="space-y-2">
											<div className="w-16 h-16 rounded-lg overflow-hidden border border-primary/20 mx-auto">
												<img
													src={voice.image}
													alt={voice.name}
													className="w-full h-full object-cover"
												/>
											</div>
											<div className="text-center">
												<div className="font-medium text-sm">{voice.name}</div>
												<div className="text-xs opacity-70">{voice.type}</div>
											</div>
										</div>
										{selectedVoice === voice.name && (
											<div className="absolute top-2 right-2">
												<WaveAnimation isActive={true} />
											</div>
										)}
									</Button>
								</motion.div>
							))}
						</div>
						<div className="mt-4">
							<label className="block text-sm font-medium mb-2">
								Choose from 150 Voice Models
							</label>
							<select
								className="w-full p-2 border border-border/50 rounded-lg bg-input/50 focus:border-primary/50 transition-colors"
								value={selectedVoice}
								onChange={(e) => setSelectedVoice(e.target.value)}
							>
								<optgroup label="Classic & Soft">
									<option value="Emily">Emily (Classic & Soft)</option>
									<option value="Sarah">Sarah (Classic & Soft)</option>
									<option value="Jessica">Jessica (Classic & Soft)</option>
									<option value="Rachel">Rachel (Classic & Soft)</option>
									<option value="Hannah">Hannah (Classic & Soft)</option>
									<option value="Katie">Katie (Classic & Soft)</option>
									<option value="Lauren">Lauren (Classic & Soft)</option>
									<option value="Emma">Emma (Classic & Soft)</option>
									<option value="Megan">Megan (Classic & Soft)</option>
									<option value="Natalie">Natalie (Classic & Soft)</option>
									<option value="Nicole">Nicole (Classic & Soft)</option>
									<option value="Amber">Amber (Classic & Soft)</option>
									<option value="Amy">Amy (Classic & Soft)</option>
									<option value="Rebecca">Rebecca (Classic & Soft)</option>
									<option value="Claire">Claire (Classic & Soft)</option>
									<option value="Samantha">Samantha (Classic & Soft)</option>
									<option value="Julia">Julia (Classic & Soft)</option>
									<option value="Grace">Grace (Classic & Soft)</option>
									<option value="Allison">Allison (Classic & Soft)</option>
									<option value="Molly">Molly (Classic & Soft)</option>
								</optgroup>
								<optgroup label="Trendy / Instagram Baddie Vibes">
									<option value="Kayla">
										Kayla (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Ava">
										Ava (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Bella">
										Bella (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Chloe">
										Chloe (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Zoey">
										Zoey (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Hailey">
										Hailey (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Lexi">
										Lexi (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Kylie">
										Kylie (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Skylar">
										Skylar (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Madison">
										Madison (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Brielle">
										Brielle (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Savannah">
										Savannah (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Alana">
										Alana (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Jada">
										Jada (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Gia">
										Gia (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Talia">
										Talia (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Sienna">
										Sienna (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Presley">
										Presley (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Eliana">
										Eliana (Trendy / Instagram Baddie Vibes)
									</option>
									<option value="Mila">
										Mila (Trendy / Instagram Baddie Vibes)
									</option>
								</optgroup>
								<optgroup label="Girl-Next-Door Energy">
									<option value="Paige">Paige (Girl-Next-Door Energy)</option>
									<option value="Brooke">Brooke (Girl-Next-Door Energy)</option>
									<option value="Jenna">Jenna (Girl-Next-Door Energy)</option>
									<option value="Lily">Lily (Girl-Next-Door Energy)</option>
									<option value="Maya">Maya (Girl-Next-Door Energy)</option>
									<option value="Autumn">Autumn (Girl-Next-Door Energy)</option>
									<option value="Sydney">Sydney (Girl-Next-Door Energy)</option>
									<option value="Casey">Casey (Girl-Next-Door Energy)</option>
									<option value="Morgan">Morgan (Girl-Next-Door Energy)</option>
									<option value="Carly">Carly (Girl-Next-Door Energy)</option>
									<option value="Tessa">Tessa (Girl-Next-Door Energy)</option>
									<option value="Bailey">Bailey (Girl-Next-Door Energy)</option>
									<option value="Riley">Riley (Girl-Next-Door Energy)</option>
									<option value="Kendall">
										Kendall (Girl-Next-Door Energy)
									</option>
									<option value="Sierra">Sierra (Girl-Next-Door Energy)</option>
									<option value="Harper">Harper (Girl-Next-Door Energy)</option>
									<option value="Delaney">
										Delaney (Girl-Next-Door Energy)
									</option>
									<option value="Josie">Josie (Girl-Next-Door Energy)</option>
									<option value="Quinn">Quinn (Girl-Next-Door Energy)</option>
									<option value="Reese">Reese (Girl-Next-Door Energy)</option>
								</optgroup>
								<optgroup label="Playful & Flirty">
									<option value="Daisy">Daisy (Playful & Flirty)</option>
									<option value="Lola">Lola (Playful & Flirty)</option>
									<option value="Poppy">Poppy (Playful & Flirty)</option>
									<option value="Ruby">Ruby (Playful & Flirty)</option>
									<option value="Ivy">Ivy (Playful & Flirty)</option>
									<option value="Eden">Eden (Playful & Flirty)</option>
									<option value="Lacey">Lacey (Playful & Flirty)</option>
									<option value="Sadie">Sadie (Playful & Flirty)</option>
									<option value="Nia">Nia (Playful & Flirty)</option>
									<option value="Kira">Kira (Playful & Flirty)</option>
									<option value="Zara">Zara (Playful & Flirty)</option>
									<option value="Nova">Nova (Playful & Flirty)</option>
									<option value="Piper">Piper (Playful & Flirty)</option>
									<option value="Callie">Callie (Playful & Flirty)</option>
									<option value="Indie">Indie (Playful & Flirty)</option>
									<option value="Marlowe">Marlowe (Playful & Flirty)</option>
									<option value="Elsie">Elsie (Playful & Flirty)</option>
									<option value="Winnie">Winnie (Playful & Flirty)</option>
									<option value="Skye">Skye (Playful & Flirty)</option>
									<option value="Blair">Blair (Playful & Flirty)</option>
								</optgroup>
								<optgroup label="High-Class / Clean Vibes">
									<option value="Charlotte">
										Charlotte (High-Class / Clean Vibes)
									</option>
									<option value="Vivian">
										Vivian (High-Class / Clean Vibes)
									</option>
									<option value="Audrey">
										Audrey (High-Class / Clean Vibes)
									</option>
									<option value="Elle">Elle (High-Class / Clean Vibes)</option>
									<option value="Evelyn">
										Evelyn (High-Class / Clean Vibes)
									</option>
									<option value="Josephine">
										Josephine (High-Class / Clean Vibes)
									</option>
									<option value="Eloise">
										Eloise (High-Class / Clean Vibes)
									</option>
									<option value="Thea">Thea (High-Class / Clean Vibes)</option>
									<option value="Celine">
										Celine (High-Class / Clean Vibes)
									</option>
									<option value="Margot">
										Margot (High-Class / Clean Vibes)
									</option>
									<option value="Celeste">
										Celeste (High-Class / Clean Vibes)
									</option>
									<option value="Isla">Isla (High-Class / Clean Vibes)</option>
									<option value="Colette">
										Colette (High-Class / Clean Vibes)
									</option>
									<option value="Nora">Nora (High-Class / Clean Vibes)</option>
									<option value="Adeline">
										Adeline (High-Class / Clean Vibes)
									</option>
									<option value="Beatrice">
										Beatrice (High-Class / Clean Vibes)
									</option>
									<option value="Georgia">
										Georgia (High-Class / Clean Vibes)
									</option>
									<option value="Hazel">
										Hazel (High-Class / Clean Vibes)
									</option>
									<option value="Camilla">
										Camilla (High-Class / Clean Vibes)
									</option>
									<option value="Willa">
										Willa (High-Class / Clean Vibes)
									</option>
								</optgroup>
								<optgroup label="Spicy & Confident">
									<option value="Carmen">Carmen (Spicy & Confident)</option>
									<option value="Alessia">Alessia (Spicy & Confident)</option>
									<option value="Sabrina">Sabrina (Spicy & Confident)</option>
									<option value="Bianca">Bianca (Spicy & Confident)</option>
									<option value="Giselle">Giselle (Spicy & Confident)</option>
									<option value="Natalia">Natalia (Spicy & Confident)</option>
									<option value="Desiree">Desiree (Spicy & Confident)</option>
									<option value="Carmen">Carmen (Spicy & Confident)</option>
									<option value="Sloane">Sloane (Spicy & Confident)</option>
									<option value="Raven">Raven (Spicy & Confident)</option>
									<option value="Kiana">Kiana (Spicy & Confident)</option>
									<option value="Zaria">Zaria (Spicy & Confident)</option>
									<option value="Phoenix">Phoenix (Spicy & Confident)</option>
									<option value="Leilani">Leilani (Spicy & Confident)</option>
									<option value="Noelle">Noelle (Spicy & Confident)</option>
									<option value="Esme">Esme (Spicy & Confident)</option>
									<option value="Amaya">Amaya (Spicy & Confident)</option>
									<option value="Brianna">Brianna (Spicy & Confident)</option>
									<option value="Tori">Tori (Spicy & Confident)</option>
									<option value="Vienna">Vienna (Spicy & Confident)</option>
								</optgroup>
								<optgroup label="AI / Fictional Vibe-Friendly">
									<option value="Aria">
										Aria (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Lyra">
										Lyra (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Elara">
										Elara (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Nyla">
										Nyla (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Nova">
										Nova (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Kaia">
										Kaia (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Azura">
										Azura (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Veda">
										Veda (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Luma">
										Luma (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Solene">
										Solene (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Ember">
										Ember (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Zephyra">
										Zephyra (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Alina">
										Alina (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Ophelia">
										Ophelia (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Seraphina">
										Seraphina (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Aerin">
										Aerin (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Freya">
										Freya (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Calista">
										Calista (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Thalia">
										Thalia (AI / Fictional Vibe-Friendly)
									</option>
									<option value="Juniper">
										Juniper (AI / Fictional Vibe-Friendly)
									</option>
								</optgroup>
								<optgroup label="Short & Catchy">
									<option value="Ava">Ava (Short & Catchy)</option>
									<option value="Mia">Mia (Short & Catchy)</option>
									<option value="Liv">Liv (Short & Catchy)</option>
									<option value="Gia">Gia (Short & Catchy)</option>
									<option value="Zoe">Zoe (Short & Catchy)</option>
									<option value="Lux">Lux (Short & Catchy)</option>
									<option value="Nia">Nia (Short & Catchy)</option>
									<option value="Lia">Lia (Short & Catchy)</option>
									<option value="Faye">Faye (Short & Catchy)</option>
									<option value="Eve">Eve (Short & Catchy)</option>
								</optgroup>
							</select>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default GenerateVoiceWidget;
