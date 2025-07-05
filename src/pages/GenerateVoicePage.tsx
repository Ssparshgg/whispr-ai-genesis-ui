import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Mic, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import GenerateVoiceWidget from "@/components/GenerateVoiceWidget";

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
	const [selectedVoice, setSelectedVoice] = useState("Linh");
	const [message, setMessage] = useState("");
	const [isTyping, setIsTyping] = useState(false);

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

	// Handle logout
	const handleLogout = () => {
		logout();
		navigate("/");
	};

	// Handle home navigation
	const handleHome = () => {
		navigate("/");
	};

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
						<motion.div
							initial={{ x: -50, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							className="flex items-center space-x-2"
						>
							<motion.div
								animate={{ rotate: [0, 15, -15, 0] }}
								transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
							>
								<Mic className="h-8 w-8 text-primary" />
							</motion.div>
							<span className="text-xl sm:text-2xl font-bold">Seducely.AI</span>
						</motion.div>

						<div className="flex items-center space-x-2 sm:space-x-4">
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

			{/* Main Content */}
			<div className="relative z-10 container mx-auto px-4 py-8">
				<GenerateVoiceWidget
					voices={voices}
					selectedVoice={selectedVoice}
					setSelectedVoice={setSelectedVoice}
					message={message}
					setMessage={setMessage}
					isTyping={isTyping}
					setIsTyping={setIsTyping}
				/>
			</div>
		</div>
	);
};

export default GenerateVoicePage;
