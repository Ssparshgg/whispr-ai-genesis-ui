import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download, Trash2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface VoiceHistoryItem {
	id: string;
	voiceName: string;
	text: string;
	audioUrl: string;
	createdAt: string;
	duration: string;
	type: "standard" | "model";
}

interface VoiceHistoryProps {
	isMobile?: boolean;
	refreshTrigger?: number;
}

const VoiceHistory = ({
	isMobile = false,
	refreshTrigger = 0,
}: VoiceHistoryProps) => {
	const [historyItems, setHistoryItems] = useState<VoiceHistoryItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [playingId, setPlayingId] = useState<string | null>(null);
	const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
		null
	);

	useEffect(() => {
		fetchHistory();
	}, [refreshTrigger]);

	const fetchHistory = async () => {
		try {
			const response = await api.getVoiceHistory();
			if (response.success) {
				const formattedHistory = response.history.map((item: any) => ({
					id: item.id,
					voiceName: item.voiceName,
					text: item.text,
					audioUrl: item.audioUrl.startsWith("http")
						? item.audioUrl
						: `https://second.anshtyagi.me${item.audioUrl}`,
					createdAt: new Date(item.createdAt).toLocaleString(),
					duration: item.duration,
					type: item.type,
				}));
				setHistoryItems(formattedHistory);
			} else {
				console.error("Failed to fetch voice history:", response.message);
				// If it's an authentication error, we might want to redirect to login
				if (
					response.message === "No token provided" ||
					response.message === "Invalid token"
				) {
					// Clear invalid token and redirect to login
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					window.location.href = "/login";
				}
			}
		} catch (error) {
			console.error("Error fetching voice history:", error);
			// Check if it's a network error or authentication error
			if (error instanceof Error) {
				if (error.message.includes("401") || error.message.includes("403")) {
					// Clear invalid token and redirect to login
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					window.location.href = "/login";
				}
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handlePlay = async (id: string, audioUrl: string) => {
		if (playingId === id) {
			currentAudio?.pause();
			setPlayingId(null);
			setCurrentAudio(null);
			return;
		}

		// Stop currently playing audio if any
		if (currentAudio) {
			currentAudio.pause();
		}

		try {
			const token = localStorage.getItem("token");

			// Create audio element with proper authentication
			const audio = new Audio();
			audio.crossOrigin = "anonymous";

			// Add authorization header for the audio request
			if (token) {
				// For audio elements, we need to handle authentication differently
				// We'll use a fetch request to get the audio blob first
				const response = await fetch(audioUrl, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const blob = await response.blob();
				const audioBlobUrl = URL.createObjectURL(blob);
				audio.src = audioBlobUrl;

				// Clean up the blob URL when audio ends
				audio.onended = () => {
					setPlayingId(null);
					setCurrentAudio(null);
					URL.revokeObjectURL(audioBlobUrl);
				};
			} else {
				// Fallback to direct audio URL if no token
				audio.src = audioUrl;
				audio.onended = () => {
					setPlayingId(null);
					setCurrentAudio(null);
				};
			}

			setCurrentAudio(audio);
			setPlayingId(id);

			await audio.play();
		} catch (error) {
			console.error("Error playing audio:", error);
			setPlayingId(null);
			setCurrentAudio(null);
		}
	};

	const handleDownload = async (audioUrl: string, voiceName: string) => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(audioUrl, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = url;
			link.download = `${voiceName}_voice.mp3`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error downloading audio:", error);
		}
	};

	return (
		<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card h-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Clock className="h-5 w-5" />
					Voice History
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
				{isLoading ? (
					<div className="text-center py-8">
						<motion.div
							animate={{ opacity: [0.5, 1, 0.5] }}
							transition={{ duration: 1, repeat: Infinity }}
						>
							Loading history...
						</motion.div>
					</div>
				) : historyItems.length === 0 ? (
					<div className="text-center py-8">
						<motion.div
							animate={{ opacity: [0.5, 1, 0.5] }}
							transition={{ duration: 2, repeat: Infinity }}
						>
							<Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						</motion.div>
						<p className="text-muted-foreground">No voice history yet</p>
						<p className="text-sm text-muted-foreground">
							Generate your first voice to see it here
						</p>
					</div>
				) : (
					historyItems.map((item, index) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
						>
							<Card className="bg-background/50 border-border/30">
								<CardContent className="p-4">
									<div className="flex items-start justify-between mb-3">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<span className="font-medium text-primary">
													{item.voiceName}
												</span>
												<span className="text-xs text-muted-foreground">
													{item.duration}
												</span>
												<span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
													{item.type}
												</span>
											</div>
											<p className="text-sm text-muted-foreground line-clamp-2">
												{item.text}
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												{item.createdAt}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handlePlay(item.id, item.audioUrl)}
											className="flex-1"
										>
											<Play
												className={`h-4 w-4 mr-1 ${
													playingId === item.id ? "animate-pulse" : ""
												}`}
											/>
											{playingId === item.id ? "Playing..." : "Play"}
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												handleDownload(item.audioUrl, item.voiceName)
											}
										>
											<Download className="h-4 w-4" />
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))
				)}
			</CardContent>
		</Card>
	);
};

export default VoiceHistory;
