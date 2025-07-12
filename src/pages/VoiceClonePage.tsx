import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Mic,
	MicOff,
	Upload,
	AudioWaveform,
	Loader2,
	ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomAudioPlayer from "@/components/CustomAudioPlayer";
import VoiceHistory from "@/components/VoiceHistory";

interface AudioRecorder {
	mediaRecorder: MediaRecorder | null;
	stream: MediaStream | null;
}

const VoiceClonePage: React.FC = () => {
	const { user } = useAuth();
	const { toast } = useToast();
	const navigate = useNavigate();

	const [audioFile, setAudioFile] = useState<File | null>(null);
	const [isRecording, setIsRecording] = useState(false);
	const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
	const [recordingTime, setRecordingTime] = useState(0);
	const [countdown, setCountdown] = useState(0);
	const [consentGiven, setConsentGiven] = useState(false);
	const [uploadMethod, setUploadMethod] = useState<"upload" | "record">(
		"upload"
	);
	const [isCloning, setIsCloning] = useState(false);
	const [progress, setProgress] = useState(0);
	const [voiceId, setVoiceId] = useState<string | null>(null);
	const [ttsText, setTtsText] = useState("");
	const [audioBase64, setAudioBase64] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isPremium, setIsPremium] = useState<boolean | null>(
		user?.isPremium ?? null
	);

	const audioRecorder = useRef<AudioRecorder>({
		mediaRecorder: null,
		stream: null,
	});
	const recordingInterval = useRef<NodeJS.Timeout | null>(null);
	const historyRef = useRef<HTMLDivElement | null>(null);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (audioRecorder.current.stream) {
				audioRecorder.current.stream
					.getTracks()
					.forEach((track) => track.stop());
			}
			if (recordingInterval.current) {
				clearInterval(recordingInterval.current);
			}
		};
	}, []);

	useEffect(() => {
		const fetchProfile = async () => {
			if (user) {
				try {
					const response = await api.getProfile();
					if (response.success && response.user) {
						setIsPremium(!!response.user.is_premium);
					} else {
						setIsPremium(false);
					}
				} catch (error) {
					setIsPremium(false);
				}
			} else {
				setIsPremium(false);
			}
		};
		fetchProfile();
	}, [user]);

	const startCountdown = () => {
		setCountdown(3);
		const interval = setInterval(() => {
			setCountdown((prev) => {
				if (prev === 1) {
					clearInterval(interval);
					startRecording();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			audioRecorder.current.stream = stream;

			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: "audio/webm",
			}); // force webm
			audioRecorder.current.mediaRecorder = mediaRecorder;

			const chunks: BlobPart[] = [];

			mediaRecorder.ondataavailable = (event) => {
				chunks.push(event.data);
			};

			mediaRecorder.onstop = () => {
				const blob = new Blob(chunks, {
					type: mediaRecorder.mimeType || "audio/webm",
				});
				setRecordedBlob(blob);
				stream.getTracks().forEach((track) => track.stop());
			};

			mediaRecorder.start();
			setIsRecording(true);
			setRecordingTime(0);

			// Start timer
			recordingInterval.current = setInterval(() => {
				setRecordingTime((prev) => prev + 1);
			}, 1000);
		} catch (error) {
			toast({
				title: "Error",
				description: "Could not access microphone. Please check permissions.",
				variant: "destructive",
			});
		}
	};

	const stopRecording = () => {
		if (
			audioRecorder.current.mediaRecorder &&
			audioRecorder.current.mediaRecorder.state === "recording"
		) {
			audioRecorder.current.mediaRecorder.stop();
			setIsRecording(false);
			if (recordingInterval.current) {
				clearInterval(recordingInterval.current);
			}
		}
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// Check if it's an audio file
			if (!file.type.startsWith("audio/")) {
				toast({
					title: "Invalid File",
					description: "Please upload an audio file.",
					variant: "destructive",
				});
				return;
			}

			setAudioFile(file);
		}
	};

	const handleCloneVoice = async () => {
		if (!consentGiven) {
			toast({
				title: "Consent Required",
				description:
					"Please confirm that you have the rights to use this voice sample.",
				variant: "destructive",
			});
			return;
		}

		const audioToClone = audioFile || recordedBlob;
		if (!audioToClone) {
			toast({
				title: "No Audio",
				description: "Please upload or record an audio sample first.",
				variant: "destructive",
			});
			return;
		}

		// Check minimum recording time if using recorded audio
		if (recordedBlob && recordingTime < 10) {
			toast({
				title: "Recording Too Short",
				description: "Please record at least 10 seconds of audio.",
				variant: "destructive",
			});
			return;
		}

		setIsCloning(true);
		setProgress(0);

		// Simulate progress
		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 90) {
					clearInterval(progressInterval);
					return 90;
				}
				return prev + Math.random() * 15;
			});
		}, 500);

		try {
			const response = await api.cloneVoice(audioToClone);

			clearInterval(progressInterval);
			setProgress(100);

			if (response.success) {
				setVoiceId(response.voiceId); // Save the voiceId for TTS
				toast({
					title: "Voice Cloned Successfully!",
					description: "Your voice model has been created and is ready to use.",
				});
				// Reset form
				setAudioFile(null);
				setRecordedBlob(null);
				setConsentGiven(false);
				setRecordingTime(0);
			} else {
				throw new Error(response.message || "Failed to clone voice");
			}
		} catch (error) {
			toast({
				title: "Cloning Failed",
				description:
					error instanceof Error
						? error.message
						: "Failed to clone voice. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsCloning(false);
			setProgress(0);
			clearInterval(progressInterval);
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="border-b border-border/40">
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => navigate("/dashboard")}
							className="text-muted-foreground hover:text-foreground"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Dashboard
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								if (historyRef.current) {
									historyRef.current.scrollIntoView({ behavior: "smooth" });
								}
							}}
							className="text-primary border-primary/30 hover:bg-primary/10"
						>
							Go to Voice History
						</Button>
					</div>
					<h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mt-8">
						Instant Voice Cloning
					</h1>
					<p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto">
						Upload or record your voice to create a personalized AI voice model.
						Train with your unique vocal characteristics.
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 py-12">
				<div className="max-w-4xl mx-auto">
					{/* Method Selection */}
					<div className="grid md:grid-cols-2 gap-8 mb-12">
						<Card
							className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
								uploadMethod === "upload" ? "ring-2 ring-primary" : ""
							}`}
							onClick={() => setUploadMethod("upload")}
						>
							<CardHeader className="text-center pb-4">
								<div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
									<Upload className="h-8 w-8 text-primary" />
								</div>
								<CardTitle>Upload Audio File</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground text-center mb-4">
									Upload an existing audio file of your voice
								</p>
								{uploadMethod === "upload" && (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className="space-y-4 flex flex-col items-center"
									>
										<input
											id="audio-upload"
											type="file"
											accept="audio/*"
											onChange={handleFileUpload}
											className="hidden"
										/>
										<label
											htmlFor="audio-upload"
											className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary via-primary/80 to-primary/60 text-white font-semibold shadow hover:brightness-110 transition border border-primary/40"
										>
											<Upload className="h-5 w-5" />
											Choose Audio File
										</label>
										{audioFile && (
											<div className="text-sm text-white bg-background/80 px-4 py-2 rounded mt-2 border border-border/30">
												<span className="font-medium">Selected:</span>{" "}
												{audioFile.name}
											</div>
										)}
									</motion.div>
								)}
							</CardContent>
						</Card>

						<Card
							className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
								uploadMethod === "record" ? "ring-2 ring-primary" : ""
							}`}
							onClick={() => setUploadMethod("record")}
						>
							<CardHeader className="text-center pb-4">
								<div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
									<Mic className="h-8 w-8 text-primary" />
								</div>
								<CardTitle>Record Your Voice</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground text-center mb-4">
									Record your voice directly in the browser
								</p>
								{uploadMethod === "record" && (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className="text-center space-y-4"
									>
										<p className="text-sm text-muted-foreground">
											Minimum recording time: 10 seconds
										</p>

										{/* Countdown */}
										<AnimatePresence>
											{countdown > 0 && (
												<motion.div
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													exit={{ opacity: 0, scale: 0.8 }}
													className="text-6xl font-bold text-primary"
												>
													{countdown}
												</motion.div>
											)}
										</AnimatePresence>

										{/* Recording Button */}
										{!isRecording && countdown === 0 && !recordedBlob && (
											<Button
												onClick={startCountdown}
												size="lg"
												className="w-full"
											>
												<Mic className="h-5 w-5 mr-2" />
												Start Recording
											</Button>
										)}

										{/* Recording State */}
										{isRecording && (
											<motion.div
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												className="space-y-4"
											>
												<div className="flex items-center justify-center">
													<motion.div
														animate={{ scale: [1, 1.2, 1] }}
														transition={{ duration: 1, repeat: Infinity }}
														className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center"
													>
														<AudioWaveform className="h-10 w-10 text-white" />
													</motion.div>
												</div>
												<div className="text-2xl font-mono text-primary">
													{formatTime(recordingTime)}
												</div>
												<Button
													onClick={stopRecording}
													variant="destructive"
													size="lg"
													disabled={recordingTime < 10}
													className="w-full"
												>
													<MicOff className="h-5 w-5 mr-2" />
													Stop Recording{" "}
													{recordingTime < 10
														? `(${10 - recordingTime}s remaining)`
														: ""}
												</Button>
											</motion.div>
										)}

										{/* Recorded State */}
										{recordedBlob && (
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												className="text-center space-y-2"
											>
												<div className="text-sm text-green-600">
													✓ Recording completed ({formatTime(recordingTime)})
												</div>
												<Button
													onClick={() => {
														setRecordedBlob(null);
														setRecordingTime(0);
													}}
													variant="outline"
													size="sm"
												>
													Record Again
												</Button>
											</motion.div>
										)}
									</motion.div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Consent and Clone Section */}
					{(audioFile || recordedBlob) && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="space-y-6"
						>
							<Card>
								<CardContent className="p-6">
									<div className="flex items-start space-x-3 mb-6">
										<Checkbox
											id="consent"
											checked={consentGiven}
											onCheckedChange={(checked) =>
												setConsentGiven(checked as boolean)
											}
										/>
										<label
											htmlFor="consent"
											className="text-sm text-muted-foreground leading-relaxed"
										>
											I hereby confirm that I have all necessary rights or
											consents to upload and clone these voice samples and that
											I will not use the platform-generated content for any
											illegal, fraudulent, or harmful purpose.
										</label>
									</div>

									{/* Progress Bar */}
									{isCloning && (
										<div className="mb-6">
											<div className="flex justify-between text-sm text-muted-foreground mb-2">
												<span>Training your voice model...</span>
												<span>{Math.round(progress)}%</span>
											</div>
											<Progress value={progress} className="h-2" />
										</div>
									)}

									<Button
										onClick={handleCloneVoice}
										disabled={!consentGiven || isCloning || !isPremium}
										size="lg"
										className="w-full relative"
									>
										{isCloning ? (
											<>
												<Loader2 className="h-5 w-5 mr-2 animate-spin" />
												Cloning Voice Model...
											</>
										) : (
											<>
												<AudioWaveform className="h-5 w-5 mr-2" />
												Clone My Voice
												{!isPremium && (
													<span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 bg-background text-primary text-xs rounded px-2 py-1 shadow-lg opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
														Premium users only
													</span>
												)}
											</>
										)}
									</Button>
								</CardContent>
							</Card>
						</motion.div>
					)}

					{voiceId && (
						<div className="mt-10 max-w-xl mx-auto bg-card/80 border border-border/40 rounded-2xl p-8 shadow-lg">
							<h2 className="text-2xl font-bold mb-4 text-white text-center">
								Try your cloned voice!
							</h2>
							<textarea
								className="w-full p-4 rounded-lg bg-background/80 border border-border/30 text-white placeholder:text-muted-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
								placeholder="Type something for your voice to say..."
								value={ttsText}
								onChange={(e) => setTtsText(e.target.value)}
								rows={3}
							/>
							<Button
								onClick={async () => {
									if (!ttsText.trim()) {
										toast({
											title: "No Text",
											description: "Please enter some text to generate audio.",
											variant: "destructive",
										});
										return;
									}
									if (!isPremium) {
										toast({
											title: "Premium Feature",
											description:
												"Generating audio with your cloned voice is available for premium users only.",
											variant: "destructive",
										});
										return;
									}
									setIsGenerating(true);
									setAudioBase64(null);
									try {
										const res = await api.generateClonedVoice(voiceId, ttsText);
										if (res.success) {
											setAudioBase64(res.audioBase64);
											toast({
												title: "Audio Generated!",
												description:
													"Your cloned voice audio has been created.",
											});
										} else {
											throw new Error(
												res.message || "Failed to generate audio"
											);
										}
									} catch (error) {
										toast({
											title: "Generation Failed",
											description:
												error instanceof Error
													? error.message
													: "Failed to generate audio. Please try again.",
											variant: "destructive",
										});
									} finally {
										setIsGenerating(false);
									}
								}}
								disabled={!ttsText.trim() || isGenerating}
								className="w-full mt-4"
							>
								{isGenerating ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Generating...
									</>
								) : (
									"Generate Audio"
								)}
							</Button>
							{audioBase64 && (
								<div className="mt-6">
									<CustomAudioPlayer
										audioUrl={`data:audio/mp3;base64,${audioBase64}`}
										filename="cloned-voice.mp3"
										onDownload={() => {
											// Create a link and trigger download
											const link = document.createElement("a");
											link.href = `data:audio/mp3;base64,${audioBase64}`;
											link.download = "cloned-voice.mp3";
											document.body.appendChild(link);
											link.click();
											document.body.removeChild(link);
										}}
									/>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
			{/* Voice History for cloned voices only */}
			<div className="mt-12" ref={historyRef}>
				<FilteredClonedVoiceHistory />
			</div>
		</div>
	);
};

const FilteredClonedVoiceHistory = () => {
	const [refreshTrigger, setRefreshTrigger] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [filteredHistory, setFilteredHistory] = useState([]);

	useEffect(() => {
		// Check if mobile
		setIsMobile(window.innerWidth <= 768);
		const handleResize = () => setIsMobile(window.innerWidth <= 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const fetchHistory = async () => {
			const response = await api.getVoiceHistory();
			if (response.success) {
				const filtered = response.history
					.filter((item: any) => item.type === "cloned")
					.map((item: any) => ({
						id: item.id,
						voiceName: item.voiceName,
						text: item.text,
						audioUrl:
							item.audioUrl && item.audioUrl.startsWith("http")
								? item.audioUrl
								: `https://second.anshtyagi.me${item.audioUrl}`,
						createdAt: new Date(item.createdAt).toLocaleString(),
						duration: item.duration,
						type: item.type,
					}));
				setFilteredHistory(filtered);
			}
		};
		fetchHistory();
	}, [refreshTrigger]);

	// Pass filteredHistory as a prop to VoiceHistory by extending it to accept items
	return (
		<VoiceHistory
			isMobile={isMobile}
			refreshTrigger={refreshTrigger}
			customHistoryItems={filteredHistory}
		/>
	);
};

export default VoiceClonePage;
