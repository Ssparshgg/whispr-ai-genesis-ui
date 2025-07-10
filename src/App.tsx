import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import GenerateVoicePage from "./pages/GenerateVoicePage";
import Waitlist from "./pages/Waitlist";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CheckoutPage from "./pages/Checkout";
import VoiceClonePage from "./pages/VoiceClonePage";

// Component to handle auto-redirect for authenticated users
const HomeRedirect = () => {
	const { isAuthenticated, isLoading } = useAuth();
	
	if (isLoading) {
		return <div>Loading...</div>;
	}
	
	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}
	
	return <Waitlist />;
};

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<TooltipProvider>
				<Toaster />
				<Sonner />
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<HomeRedirect />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/waitlist" element={<Index />} />
						<Route path="/admin/login" element={<AdminLogin />} />
						<Route path="/admin/dashboard" element={<AdminDashboard />} />
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/generate-voice"
							element={
								<ProtectedRoute>
									<GenerateVoicePage />
								</ProtectedRoute>
							}
						/>
						<Route path="/terms" element={<Terms />} />
						<Route path="/privacy" element={<Privacy />} />
						<Route path="/checkout" element={<CheckoutPage />} />
						<Route
							path="/clone"
							element={
								<ProtectedRoute>
									<VoiceClonePage />
								</ProtectedRoute>
							}
						/>
						{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
						<Route path="*" element={<NotFound />} />
					</Routes>
				</BrowserRouter>
			</TooltipProvider>
		</AuthProvider>
	</QueryClientProvider>
);

export default App;
