import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import WaveAnimation from "@/components/WaveAnimation";

interface CustomAudioPlayerProps {
	audioUrl: string;
	filename?: string;
	onDownload?: () => void;
	generatedVoiceData?: {
		voiceName: string;
		text: string;
		image?: string;
	};
}

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({
	audioUrl,
	filename,
	onDownload,
	generatedVoiceData,
}) => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(audio.duration);
		const handleEnded = () => setIsPlaying(false);

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);
		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("ended", handleEnded);
		};
	}, []);

	const togglePlay = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const handleSeek = (value: number[]) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value[0];
			setCurrentTime(value[0]);
		}
	};

	const handleVolumeChange = (value: number[]) => {
		const newVolume = value[0];
		setVolume(newVolume);
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
		}
		if (newVolume === 0) {
			setIsMuted(true);
		} else {
			setIsMuted(false);
		}
	};

	const toggleMute = () => {
		if (audioRef.current) {
			audioRef.current.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	return (
		<div className="bg-card/30 backdrop-blur border border-border/30 rounded-xl p-4 space-y-4">
			<audio ref={audioRef} src={audioUrl} preload="metadata" />

			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<WaveAnimation isActive={isPlaying} />
					<span className="font-medium text-sm">Generated Audio</span>
				</div>
				{onDownload && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onDownload}
						className="text-primary hover:text-primary/80"
					>
						<Download className="h-4 w-4" />
					</Button>
				)}
			</div>

			{/* Progress Bar */}
			<div className="space-y-2">
				<div className="flex justify-between text-xs text-muted-foreground">
					<span>{formatTime(currentTime)}</span>
					<span>{formatTime(duration)}</span>
				</div>
				<Slider
					value={[currentTime]}
					max={duration}
					step={0.1}
					onValueChange={handleSeek}
					className="w-full"
				/>
			</div>

			{/* Controls */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
						<Button
							variant="ghost"
							size="sm"
							onClick={togglePlay}
							className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/30 text-primary"
						>
							{isPlaying ? (
								<Pause className="h-4 w-4" />
							) : (
								<Play className="h-4 w-4 ml-0.5" />
							)}
						</Button>
					</motion.div>

					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={toggleMute}
							className="w-8 h-8 rounded-full bg-background/50 hover:bg-background/70"
						>
							{isMuted ? (
								<VolumeX className="h-3 w-3" />
							) : (
								<Volume2 className="h-3 w-3" />
							)}
						</Button>
						<div className="w-20">
							<Slider
								value={[isMuted ? 0 : volume]}
								max={1}
								step={0.01}
								onValueChange={handleVolumeChange}
								className="w-full"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomAudioPlayer;
