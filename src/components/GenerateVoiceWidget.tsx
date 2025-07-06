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
}

const lockedVoiceImages: Record<string, string> = {
	Sweet: "/sydney.jpg",
	Cute: "/daissy.jpg",
	Confident: "/kyly.jpg",
	Adventurous: "/lauren.jpg",
};

const VOICE_MODEL_NAMES = Array.from(
	{ length: 150 },
	(_, i) => `Voice ${i + 1}`
);

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
}) => {
	const [isGenerating, setIsGenerating] = useState(false);
	const [generatedAudio, setGeneratedAudio] = useState<{
		audioBase64: string;
		filename: string;
		voiceName: string;
		text: string;
	} | null>(null);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleGenerateVoice = async () => {
		if (!message.trim()) {
			alert("Please enter a message to generate voice");
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
			// Use the new endpoint for the 150 voice models
			if (VOICE_MODEL_NAMES.includes(selectedVoice)) {
				const response = await fetch("/api/generate-voice-model", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ modelName: selectedVoice, text: message }),
				});
				const data = await response.json();
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
					} catch (audioError) {
						console.error("Error processing audio:", audioError);
						alert("Error processing the generated audio. Please try again.");
					}
				} else {
					console.error("Invalid response:", data);
					alert(`Error: ${data.message || "Failed to generate voice"}`);
				}
				setIsGenerating(false);
				return;
			}
			// fallback to old API for other voices (if any)
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
				} catch (audioError) {
					console.error("Error processing audio:", audioError);
					alert("Error processing the generated audio. Please try again.");
				}
			} else {
				console.error("Invalid response:", response);
				alert(`Error: ${response.message || "Failed to generate voice"}`);
			}
		} catch (error) {
			console.error("Error generating voice:", error);
			alert("Failed to generate voice. Please try again.");
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
								disabled={isGenerating || !message.trim()}
							>
								<motion.div
									animate={{ scale: [1, 1.05, 1] }}
									transition={{ duration: 2, repeat: Infinity }}
									className="absolute inset-0 bg-gradient-to-r from-primary via-primary-hover to-primary opacity-80"
								/>
								<span className="relative z-10">
									{isGenerating ? "Generating..." : "Generate Voice Note"}
								</span>
								<motion.div
									animate={{ rotate: isGenerating ? 360 : 0 }}
									transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
									className="ml-2 relative z-10"
								>
									{isGenerating ? (
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
								{VOICE_MODEL_NAMES.map((modelName, i) => {
									const type = ["Sweet", "Cute", "Confident", "Adventurous"][
										i % 4
									];
									return (
										<option key={modelName} value={modelName}>
											{modelName} ({type})
										</option>
									);
								})}
							</select>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default GenerateVoiceWidget;
