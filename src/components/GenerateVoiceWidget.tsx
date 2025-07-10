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
	audioFile?: string; // Added audioFile property
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
	user?: any;
	onVoiceChanged?: () => void; // <--- add this
	onAudioGenerated?: (audioUrl: string, audioData: any) => void;
	onVoiceChangedAudio?: (audioUrl: string) => void;
}

const lockedVoiceImages: Record<string, string> = {
	Sweet: "/sydney.jpg",
	Cute: "/daissy.jpg",
	Confident: "/kyly.jpg",
	Adventurous: "/lauren.jpg",
};

// Voice name to ID mapping for voice changer
const VOICE_ID_MAP: Record<string, string> = {
	Amaya: "BFvr34n3gOoz0BAf9Rwn",
	Jamie: "hDCQ0elACClokHYB6RkC",
	Kelly: "sScFwemjGrAkDDiTXWMH",
	maya: "arTQWyIIUuAm6uJW7TDn",
	olivia: "GsjQ0ydx7QzhDLqInGtT",
	dasha: "8HSRAwEWAAa6wv9cdi5S",
	beth: "y3UNfL9XC5Bb5htg8B0q",
	mahi: "69nXRvRvFpjSXhH7IM5l",
	noushin: "NZiuR1C6kVMSWHG27sIM",
	koku: "ugCty5z6GlAbXhgvP0zz",
	molly: "NIPHfiR4kB4aHfvaKvYb",
	Kaylin: "X49lnpAfzUKIGC8dsrpV",
	niki: "Okp1kfPgMQ81kjya7BBo",
	aasha: "rxvktZTNrsQlsGIpOQGz",
	grace: "ycvyTVVIzO2xfIGZC7tZ",
	gabrielle: "XLjWd2QoaSR6q14cMbkN",
	"sami real": "O4cGUVdAocn0z4EpQ9yF",
	raven: "NySnOmeQIeaUH8egRnrQ",
	kayla: "fI4LiKng8DlpjWJyDcsj",
	mariaCF: "hdRfHwXmbkQgRE2dNURj",
	jenna: "C2BkQxlGNzBn7WD2bqfR",
	henna: "yA5sg1jAeFs7jFtteRx8",
	Katherine: "0zUZ5qUGb8wympsfJH8d",
	linh: "WxqqAhUiswIRQNTBz2a5", // diana voice id
	miara: "v1IIiVAN4yJaGycxWmjU", // lilirose voice id
	madison: "NL5yDL1ccYeWsAKmxP3r", // raina voice id
	aria: "nWqudYCkXMd4lfMUlT44", // mia voice id
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
	user: propUser,
	onVoiceChanged,
	onAudioGenerated,
	onVoiceChangedAudio,
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
	const { user: contextUser } = useAuth();
	const user = propUser ?? contextUser;
	const isPremium = !!user?.isPremium;
	const [isRecording, setIsRecording] = useState(false);
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
		null
	);
	const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
	const [isProcessingVoiceChange, setIsProcessingVoiceChange] = useState(false);
	const [voiceChangedAudioUrl, setVoiceChangedAudioUrl] = useState<
		string | null
	>(null);

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
						if (onAudioGenerated) onAudioGenerated(url, response.data);

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
						if (onAudioGenerated) onAudioGenerated(url, data.data);

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

	// Start recording
	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const recorder = new MediaRecorder(stream);
			const chunks: BlobPart[] = [];
			recorder.ondataavailable = (e) => {
				if (e.data.size > 0) chunks.push(e.data);
			};
			recorder.onstop = () => {
				const blob = new Blob(chunks, { type: "audio/mp3" });
				setRecordedAudio(blob);
				stream.getTracks().forEach((track) => track.stop());
			};
			setMediaRecorder(recorder);
			recorder.start();
			setIsRecording(true);
		} catch (err) {
			toast({
				title: "Microphone Error",
				description: "Could not access microphone.",
				variant: "destructive",
			});
		}
	};

	// Stop recording
	const stopRecording = () => {
		if (mediaRecorder && isRecording) {
			mediaRecorder.stop();
			setIsRecording(false);
			setMediaRecorder(null);
		}
	};

	// When recordedAudio is set, send to voice changer
	useEffect(() => {
		const processVoiceChange = async () => {
			if (recordedAudio && selectedVoice) {
				setIsProcessingVoiceChange(true);
				try {
					const voiceId =
						VOICE_ID_MAP[selectedVoice.toLowerCase()] || selectedVoice;
					const data = await api.voiceChanger(recordedAudio, voiceId);
					const audioBlob = new Blob(
						[Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0))],
						{ type: data.mimetype }
					);
					const url = URL.createObjectURL(audioBlob);
					setVoiceChangedAudioUrl(url);
					if (onVoiceChangedAudio) onVoiceChangedAudio(url);
					toast({
						title: "Voice Changed!",
						description: "Your voice has been transformed.",
					});
					if (onVoiceChanged) onVoiceChanged();
				} catch (err: any) {
					toast({
						title: "Voice Changer Error",
						description: err.message,
						variant: "destructive",
					});
				}
				setIsProcessingVoiceChange(false);
			}
		};
		processVoiceChange();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recordedAudio]);

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
						<div className="mt-4 flex flex-col gap-2">
							<Button
								variant="whispr-primary"
								className="w-full"
								onClick={isRecording ? stopRecording : startRecording}
								disabled={isProcessingVoiceChange}
							>
								{isRecording ? "Stop Recording" : "Record & Change Voice"}
							</Button>
							{isProcessingVoiceChange && (
								<div className="text-center text-xs text-muted-foreground">
									Processing voice change...
								</div>
							)}
							{voiceChangedAudioUrl && (
								<div className="mt-2">
									<CustomAudioPlayer audioUrl={voiceChangedAudioUrl} />
								</div>
							)}
						</div>
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
										navigate("/waitlist");
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
									{voice.audioFile && (
										<Button
											variant="ghost"
											size="icon"
											className="mt-2"
											onClick={(e) => {
												e.stopPropagation();
												const audio = new Audio(voice.audioFile);
												audio.play();
											}}
											aria-label={`Preview ${voice.name}`}
										>
											<Mic className="h-5 w-5 text-primary" />
										</Button>
									)}
								</motion.div>
							))}
						</div>
						<div className="mt-4">
							{!isPremium ? (
								<div className="relative group">
									<label className="block text-sm font-medium mb-2 opacity-60 cursor-not-allowed flex items-center">
										<svg
											className="w-4 h-4 text-primary mr-1"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 17v.01M12 7v4m0 4h.01M17 21H7a2 2 0 01-2-2V7a2 2 0 012-2h3.28a2 2 0 011.44.59l.72.72a2 2 0 001.44.59H17a2 2 0 012 2v12a2 2 0 01-2 2z"
											/>
										</svg>
										Choose from 150 Voice Models
									</label>
									<div className="relative">
										<select
											className="w-full p-2 border border-border/50 rounded-lg bg-input/50 focus:border-primary/50 transition-colors opacity-60 cursor-not-allowed pointer-events-none"
											value={selectedVoice || ""}
											disabled
										>
											<option value="">-- Select a Voice Model --</option>
										</select>
										<span className="absolute left-1/2 -top-8 -translate-x-1/2 whitespace-nowrap bg-background/90 text-xs text-primary px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
											Only for premium users
										</span>
									</div>
								</div>
							) : (
								<React.Fragment>
									<label className="block text-sm font-medium mb-2">
										Choose from 150 Voice Models
									</label>
									<select
										className="w-full p-2 border border-border/50 rounded-lg bg-input/50 focus:border-primary/50 transition-colors"
										value={selectedVoice || ""}
										onChange={(e) => setSelectedVoice(e.target.value)}
									>
										<option value="">-- Select a Voice Model --</option>
										<optgroup label="Classic & Soft">
											<option value="Emily">Emily </option>
											<option value="Sarah">Sarah </option>
											<option value="Jessica">Jessica </option>
											<option value="Rachel">Rachel </option>
											<option value="Hannah">Hannah </option>
											<option value="Katie">Katie </option>
											<option value="Lauren">Lauren </option>
											<option value="Emma">Emma </option>
											<option value="Megan">Megan </option>
											<option value="Natalie">Natalie </option>
											<option value="Nicole">Nicole </option>
											<option value="Amber">Amber </option>
											<option value="Amy">Amy </option>
											<option value="Rebecca">Rebecca </option>
											<option value="Claire">Claire </option>
											<option value="Samantha">Samantha </option>
											<option value="Julia">Julia </option>
											<option value="Grace">Grace </option>
											<option value="Allison">Allison </option>
											<option value="Molly">Molly </option>
										</optgroup>
										<optgroup label="Trendy / Instagram Baddie Vibes">
											<option value="Kayla">Kayla</option>
											<option value="Ava">Ava</option>
											<option value="Bella">Bella</option>
											<option value="Chloe">Chloe</option>
											<option value="Zoey">Zoey</option>
											<option value="Hailey">Hailey</option>
											<option value="Lexi">Lexi</option>
											<option value="Kylie">Kylie</option>
											<option value="Skylar">Skylar</option>
											<option value="Madison">Madison</option>
											<option value="Brielle">Brielle</option>
											<option value="Savannah">Savannah</option>
											<option value="Alana">Alana</option>
											<option value="Jada">Jada</option>
											<option value="Gia">Gia</option>
											<option value="Talia">Talia</option>
											<option value="Sienna">Sienna</option>
											<option value="Presley">Presley</option>
											<option value="Eliana">Eliana</option>
											<option value="Mila">Mila</option>
										</optgroup>
										<optgroup label="Girl-Next-Door Energy">
											<option value="Paige">Paige </option>
											<option value="Brooke">Brooke </option>
											<option value="Jenna">Jenna </option>
											<option value="Lily">Lily </option>
											<option value="Maya">Maya </option>
											<option value="Autumn">Autumn </option>
											<option value="Sydney">Sydney </option>
											<option value="Casey">Casey </option>
											<option value="Morgan">Morgan </option>
											<option value="Carly">Carly </option>
											<option value="Tessa">Tessa </option>
											<option value="Bailey">Bailey </option>
											<option value="Riley">Riley </option>
											<option value="Kendall">Kendall</option>
											<option value="Sierra">Sierra </option>
											<option value="Harper">Harper </option>
											<option value="Delaney">Delaney</option>
											<option value="Josie">Josie </option>
											<option value="Quinn">Quinn </option>
											<option value="Reese">Reese </option>
										</optgroup>
										<optgroup label="Playful & Flirty">
											<option value="Daisy">Daisy </option>
											<option value="Lola">Lola </option>
											<option value="Poppy">Poppy </option>
											<option value="Ruby">Ruby </option>
											<option value="Ivy">Ivy </option>
											<option value="Eden">Eden </option>
											<option value="Lacey">Lacey </option>
											<option value="Sadie">Sadie </option>
											<option value="Nia">Nia </option>
											<option value="Kira">Kira </option>
											<option value="Zara">Zara </option>
											<option value="Nova">Nova </option>
											<option value="Piper">Piper </option>
											<option value="Callie">Callie </option>
											<option value="Indie">Indie </option>
											<option value="Marlowe">Marlowe </option>
											<option value="Elsie">Elsie </option>
											<option value="Winnie">Winnie </option>
											<option value="Skye">Skye </option>
											<option value="Blair">Blair </option>
										</optgroup>
										<optgroup label="High-Class / Clean Vibes">
											<option value="Charlotte">Charlotte</option>
											<option value="Vivian">Vivian</option>
											<option value="Audrey">Audrey</option>
											<option value="Elle">Elle </option>
											<option value="Evelyn">Evelyn</option>
											<option value="Josephine">Josephine</option>
											<option value="Eloise">Eloise</option>
											<option value="Thea">Thea </option>
											<option value="Celine">Celine</option>
											<option value="Margot">Margot</option>
											<option value="Celeste">Celeste</option>
											<option value="Isla">Isla </option>
											<option value="Colette">Colette</option>
											<option value="Nora">Nora </option>
											<option value="Adeline">Adeline</option>
											<option value="Beatrice">Beatrice</option>
											<option value="Georgia">Georgia</option>
											<option value="Hazel">Hazel</option>
											<option value="Camilla">Camilla</option>
											<option value="Willa">Willa</option>
										</optgroup>
										<optgroup label="Spicy & Confident">
											<option value="Carmen">Carmen </option>
											<option value="Alessia">Alessia </option>
											<option value="Sabrina">Sabrina </option>
											<option value="Bianca">Bianca </option>
											<option value="Giselle">Giselle </option>
											<option value="Natalia">Natalia </option>
											<option value="Desiree">Desiree </option>
											<option value="Carmen">Carmen </option>
											<option value="Sloane">Sloane </option>
											<option value="Raven">Raven </option>
											<option value="Kiana">Kiana </option>
											<option value="Zaria">Zaria </option>
											<option value="Phoenix">Phoenix </option>
											<option value="Leilani">Leilani </option>
											<option value="Noelle">Noelle </option>
											<option value="Esme">Esme </option>
											<option value="Amaya">Amaya </option>
											<option value="Brianna">Brianna </option>
											<option value="Tori">Tori </option>
											<option value="Vienna">Vienna </option>
										</optgroup>
										<optgroup label="AI / Fictional Vibe-Friendly">
											<option value="Aria">Aria</option>
											<option value="Lyra">Lyra</option>
											<option value="Elara">Elara</option>
											<option value="Nyla">Nyla</option>
											<option value="Nova">Nova</option>
											<option value="Kaia">Kaia</option>
											<option value="Azura">Azura</option>
											<option value="Veda">Veda</option>
											<option value="Luma">Luma</option>
											<option value="Solene">Solene</option>
											<option value="Ember">Ember</option>
											<option value="Zephyra">Zephyra</option>
											<option value="Alina">Alina</option>
											<option value="Ophelia">Ophelia</option>
											<option value="Seraphina">Seraphina</option>
											<option value="Aerin">Aerin</option>
											<option value="Freya">Freya</option>
											<option value="Calista">Calista</option>
											<option value="Thalia">Thalia</option>
											<option value="Juniper">Juniper</option>
										</optgroup>
										<optgroup label="Short & Catchy">
											<option value="Ava">Ava </option>
											<option value="Mia">Mia </option>
											<option value="Liv">Liv </option>
											<option value="Gia">Gia </option>
											<option value="Zoe">Zoe </option>
											<option value="Lux">Lux </option>
											<option value="Nia">Nia </option>
											<option value="Lia">Lia </option>
											<option value="Faye">Faye </option>
											<option value="Eve">Eve </option>
										</optgroup>
									</select>
								</React.Fragment>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default GenerateVoiceWidget;
