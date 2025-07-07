import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Users, Mail, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface WaitlistUser {
	id: string;
	email: string;
	createdAt: string;
}

const AdminDashboard = () => {
	const [waitlistUsers, setWaitlistUsers] = useState<WaitlistUser[]>([]);
	const [stats, setStats] = useState({ totalUsers: 0, todaySignups: 0 });
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const { toast } = useToast();

	const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

	useEffect(() => {
		fetchWaitlistData();
	}, []);

	const fetchWaitlistData = async () => {
		try {
			const response = await api.getWaitlistUsers();
			if (response.success) {
				setWaitlistUsers(response.entries); // Use entries from backend
				setStats({ totalUsers: response.count, todaySignups: 0 }); // Use count, set todaySignups to 0
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch waitlist data",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("adminToken");
		localStorage.removeItem("adminUser");
		navigate("/admin/login");
	};

	const handleDeleteUser = async (userId: string) => {
		try {
			const response = await api.deleteWaitlistUser(userId);
			if (response.success) {
				setWaitlistUsers((users) => users.filter((user) => user.id !== userId));
				toast({
					title: "Success",
					description: "User removed from waitlist",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to remove user",
				variant: "destructive",
			});
		}
	};

	const getInitials = (email: string) => {
		return email.substring(0, 2).toUpperCase();
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString();
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b border-border/20 bg-background/95 backdrop-blur-sm">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<h1 className="text-2xl font-bold">Admin Dashboard</h1>
							<Badge className="bg-primary/20 text-primary">Seducely AI</Badge>
						</div>
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2">
								<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
									<span className="text-sm font-medium text-primary">
										{getInitials(adminUser.email || "AD")}
									</span>
								</div>
								<span className="text-sm text-muted-foreground">
									{adminUser.email}
								</span>
							</div>
							<Button variant="ghost" onClick={handleLogout}>
								<LogOut className="h-4 w-4 mr-2" />
								Logout
							</Button>
						</div>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				{/* Stats Cards */}
				<div className="grid md:grid-cols-2 gap-6 mb-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Users
								</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stats.totalUsers}</div>
								<p className="text-xs text-muted-foreground">
									Total waitlist signups
								</p>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Today's Signups
								</CardTitle>
								<Clock className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stats.todaySignups}</div>
								<p className="text-xs text-muted-foreground">
									New signups today
								</p>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* Waitlist Users */}
				<Card className="bg-card/50 backdrop-blur border-border/20 shadow-card">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Mail className="h-5 w-5" />
							Waitlist Users
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{waitlistUsers.length === 0 ? (
								<p className="text-center text-muted-foreground py-8">
									No users in waitlist yet
								</p>
							) : (
								waitlistUsers.map((user, index) => (
									<motion.div
										key={user.id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
										className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/20"
									>
										<div className="flex items-center space-x-3">
											<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
												<span className="text-sm font-medium text-primary">
													{getInitials(user.email)}
												</span>
											</div>
											<div>
												<p className="font-medium">{user.email}</p>
												<p className="text-sm text-muted-foreground">
													Joined {formatDate(user.createdAt)} at{" "}
													{formatTime(user.createdAt)}
												</p>
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleDeleteUser(user.id)}
											className="text-destructive hover:text-destructive hover:bg-destructive/10"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</motion.div>
								))
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AdminDashboard;
