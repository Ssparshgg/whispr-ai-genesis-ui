import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	SidebarProvider,
	SidebarTrigger,
	SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
	children: React.ReactNode;
	defaultSidebarOpen?: boolean;
}

const getPageTitle = (pathname: string) => {
	switch (pathname) {
		case "/dashboard":
			return "Dashboard";
		case "/generate-voice":
			return "Text to Speech";
		case "/clone":
			return "Clone Voice";
		default:
			return "Dashboard";
	}
};

export function DashboardLayout({
	children,
	defaultSidebarOpen,
}: DashboardLayoutProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const { logout } = useAuth();
	const isMobile = useIsMobile();

	const handleLogout = () => {
		logout();
		navigate("/waitlist");
	};

	const handleHome = () => {
		navigate("/waitlist");
	};

	return (
		<SidebarProvider defaultOpen={defaultSidebarOpen}>
			<div className="min-h-screen bg-background text-foreground relative overflow-hidden w-full">
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
				<header className="border-b border-border/20 bg-background/95 backdrop-blur-sm fixed top-0 left-0 w-full z-50">
					<div className="container mx-auto px-4 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<SidebarTrigger />
								<motion.div
									initial={{ x: -50, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									className="flex items-center space-x-2 cursor-pointer"
									onClick={handleHome}
								>
									<motion.div
										animate={{ rotate: [0, 15, -15, 0] }}
										transition={{
											duration: 2,
											repeat: Infinity,
											repeatDelay: 3,
										}}
									>
										<img
											src="/logo.jpg"
											alt="Seducely AI Logo"
											className="h-8 w-8 rounded-full object-cover"
										/>
									</motion.div>
									<span className="text-xl sm:text-2xl font-bold">
										Seducely AI
									</span>
								</motion.div>
								<span className="text-lg font-medium text-muted-foreground">
									{getPageTitle(location.pathname)}
								</span>
							</div>

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

				{/* Main content below header */}
				<div className="flex w-full pt-16">
					{" "}
					{/* <-- pt-16 matches header height */}
					<AppSidebar />
					<SidebarInset className="relative z-10">{children}</SidebarInset>
				</div>
			</div>
		</SidebarProvider>
	);
}
