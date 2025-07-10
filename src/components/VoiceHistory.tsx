import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Download, History, Loader2, Mic } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface VoiceHistoryItem {
	id: string;
	voiceName: string;
	text: string;
	audioUrl: string;
	createdAt: string;
	duration: number;
	type: string;
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
	const { logout } = useAuth();
	const navigate = useNavigate();

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
				if (
					response.message === "No token provided" ||
					response.message === "Invalid token" ||
					response.message === "User not found"
				) {
					logout();
					navigate("/login");
				}
			}
		} catch (error) {
			console.error("Error fetching voice history:", error);
			if (error instanceof Error) {
				if (
					error.message.includes("Invalid token") ||
					error.message.includes("User not found")
				) {
					logout();
					navigate("/login");
				}
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handlePlay = (item: VoiceHistoryItem) => {
		if (playingId === item.id) {
			if (currentAudio) {
				currentAudio.pause();
				currentAudio.currentTime = 0;
			}
			setPlayingId(null);
			setCurrentAudio(null);
		} else {
			if (currentAudio) {
				currentAudio.pause();
				currentAudio.currentTime = 0;
			}

			const audio = new Audio(item.audioUrl);
			audio.addEventListener("ended", () => {
				setPlayingId(null);
				setCurrentAudio(null);
			});
			audio.addEventListener("error", () => {
				console.error("Error playing audio:", item.audioUrl);
				setPlayingId(null);
				setCurrentAudio(null);
			});

			audio.play().catch((error) => {
				console.error("Error playing audio:", error);
				setPlayingId(null);
				setCurrentAudio(null);
			});

			setPlayingId(item.id);
			setCurrentAudio(audio);
		}
	};

	const handleDownload = async (item: VoiceHistoryItem) => {
		try {
			const response = await fetch(item.audioUrl);
			const blob = await response.blob();

			const blobUrl = URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = `${item.voiceName}_${item.id}.mp3`;
			link.style.display = "none";

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			URL.revokeObjectURL(blobUrl);
		} catch (error) {
			console.error("Error downloading audio:", error);
			// Fallback to original method
			const link = document.createElement("a");
			link.href = item.audioUrl;
			link.download = `${item.voiceName}_${item.id}.mp3`;
			link.setAttribute("target", "_self");
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	// Cleanup audio when component unmounts
	useEffect(() => {
		return () => {
			if (currentAudio) {
				currentAudio.pause();
				currentAudio.currentTime = 0;
			}
		};
	}, [currentAudio]);

	if (isLoading) {
		return (
			<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card h-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<History className="h-5 w-5" />
						Voice History
					</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center justify-center h-64">
					<div className="text-center">
						<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
						<p className="text-muted-foreground">Loading voice history...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card h-full flex flex-col">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<History className="h-5 w-5" />
					Voice History
					<Badge variant="secondary" className="ml-auto">
						{historyItems.length}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 max-h-full flex-1 overflow-y-auto overflow-x-hidden break-words">
				{historyItems.length === 0 ? (
					<div className="text-center py-8">
						<History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<p className="text-muted-foreground">No voice history yet</p>
						<p className="text-sm text-muted-foreground">
							Generate your first voice to see it here
						</p>
					</div>
				) : (
					historyItems.map((item) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-card/30 backdrop-blur border border-border/30 rounded-lg p-4 space-y-3"
						>
							{/* Header */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Badge variant="outline" className="text-xs">
										{item.type}
									</Badge>
									<div className="flex items-center gap-2">
										{item.type === "voice-changed" ? (
											<Mic className="w-5 h-5 text-primary" />
										) : (
											<span className="font-medium text-sm">
												{item.voiceName}
											</span>
										)}
									</div>
								</div>
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handlePlay(item)}
										className="w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/30 text-primary"
									>
										{playingId === item.id ? (
											<Pause className="h-3 w-3" />
										) : (
											<Play className="h-3 w-3 ml-0.5" />
										)}
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleDownload(item)}
										className="w-8 h-8 rounded-full bg-background/50 hover:bg-background/70"
									>
										<Download className="h-3 w-3" />
									</Button>
								</div>
							</div>

							{/* Text */}
							<p className="text-sm text-muted-foreground line-clamp-2">
								{item.text}
							</p>

							{/* Footer */}
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<span>{item.createdAt}</span>
								<span>{item.duration}s</span>
							</div>
						</motion.div>
					))
				)}
			</CardContent>
		</Card>
	);
};

export default VoiceHistory;
