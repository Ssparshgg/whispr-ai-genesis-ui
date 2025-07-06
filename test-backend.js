const API_BASE_URL =
	process.env.NODE_ENV === "production"
		? "https://second.anshtyagi.me/api"
		: "http://localhost:5001/api";

async function testBackend() {
	console.log("🔍 Testing backend connectivity...");
	console.log(`📍 API URL: ${API_BASE_URL}`);

	try {
		// Test health endpoint
		console.log("\n1. Testing health endpoint...");
		const healthResponse = await fetch(`${API_BASE_URL}/health`);
		const healthData = await healthResponse.json();

		if (healthResponse.ok) {
			console.log("✅ Health check passed:", healthData);
		} else {
			console.log("❌ Health check failed:", healthData);
		}
	} catch (error) {
		console.log("❌ Health check error:", error.message);
		console.log("\n💡 Possible solutions:");
		console.log("   - Make sure the backend server is running");
		console.log("   - Check if MongoDB is connected");
		console.log("   - Verify environment variables are set");
		console.log("   - Run: cd backend && npm start");
	}

	try {
		// Test if server is reachable
		console.log("\n2. Testing server reachability...");
		const response = await fetch(`${API_BASE_URL}/profile`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.status === 401) {
			console.log("✅ Server is reachable (401 expected without auth token)");
		} else if (response.status === 404) {
			console.log("❌ Server returned 404 - routes not found");
		} else {
			console.log(`ℹ️  Server responded with status: ${response.status}`);
		}
	} catch (error) {
		console.log("❌ Server not reachable:", error.message);
	}
}

testBackend();
