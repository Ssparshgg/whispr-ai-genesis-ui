
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download, Trash2, Clock } from "lucide-react";
import { useState } from "react";

interface VoiceHistoryItem {
	id: string;
	voiceName: string;
	text: string;
	audioUrl: string;
	createdAt: string;
	duration: string;
}

const VoiceHistory = () => {
	const [historyItems] = useState<VoiceHistoryItem[]>([
		{
			id: "1",
			voiceName: "Linh",
			text: "Hey there, I've been thinking about you all day...",
			audioUrl: "/sweet.mp3",
			createdAt: "2 hours ago",
			duration: "0:15",
		},
		{
			id: "2",
			voiceName: "Miara",
			text: "You make my heart skip a beat every time...",
			audioUrl: "/cute.mp3",
			createdAt: "1 day ago",
			duration: "0:12",
		},
		{
			id: "3",
			voiceName: "Madison",
			text: "I know exactly what you're thinking right now...",
			audioUrl: "/confident.mp3",
			createdAt: "2 days ago",
			duration: "0:18",
		},
	]);

	const [playingId, setPlayingId] = useState<string | null>(null);

	const handlePlay = (id: string, audioUrl: string) => {
		if (playingId === id) {
			setPlayingId(null);
			return;
		}

		setPlayingId(id);
		const audio = new Audio(audioUrl);
		audio.play();
		audio.onended = () => setPlayingId(null);
	};

	const handleDownload = (audioUrl: string, voiceName: string) => {
		const link = document.createElement("a");
		link.href = audioUrl;
		link.download = `${voiceName}_voice.mp3`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
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
				{historyItems.length === 0 ? (
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
											onClick={() => handleDownload(item.audioUrl, item.voiceName)}
										>
											<Download className="h-4 w-4" />
										</Button>
										<Button variant="ghost" size="sm">
											<Trash2 className="h-4 w-4 text-destructive" />
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
