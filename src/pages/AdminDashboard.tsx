
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, Mail, Calendar, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getWaitlistUsers } from "@/lib/api";

interface WaitlistUser {
  id: string;
  email: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [waitlistUsers, setWaitlistUsers] = useState<WaitlistUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    todaySignups: 0,
    weeklySignups: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchWaitlistData = async () => {
    setIsLoading(true);
    try {
      const data = await getWaitlistUsers();
      setWaitlistUsers(data);
      
      // Calculate stats
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const todaySignups = data.filter(user => 
        new Date(user.createdAt) >= todayStart
      ).length;
      
      const weeklySignups = data.filter(user => 
        new Date(user.createdAt) >= weekAgo
      ).length;
      
      setStats({
        totalUsers: data.length,
        todaySignups,
        weeklySignups,
      });
    } catch (error) {
      toast({
        title: "Error fetching data",
        description: error instanceof Error ? error.message : "Failed to load waitlist data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlistData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/20 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
                <img
                  src="/logo.jpg"
                  alt="Seducely AI Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl sm:text-2xl font-bold">Seducely AI</span>
              <Badge variant="outline" className="ml-2">Admin</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={fetchWaitlistData}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage waitlist users and monitor platform statistics
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 backdrop-blur border-border/20 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Total waitlist signups
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/20 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Signups</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.todaySignups}</div>
                <p className="text-xs text-muted-foreground">
                  New signups today
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/20 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.weeklySignups}</div>
                <p className="text-xs text-muted-foreground">
                  Signups this week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Waitlist Users */}
          <Card className="bg-card/50 backdrop-blur border-border/20 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Waitlist Users
              </CardTitle>
              <CardDescription>
                All users who have joined the waitlist
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Loading waitlist data...</span>
                </div>
              ) : waitlistUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users have joined the waitlist yet.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {waitlistUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-secondary/20 rounded-lg p-4 border border-border/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                            <span className="text-primary font-semibold">
                              {getInitials(user.email)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user.email}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(user.createdAt)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
