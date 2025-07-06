# Whisper AI - Voice Generation App

A React-based voice generation application using ElevenLabs API for AI-powered voice synthesis.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- ElevenLabs API key

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Setup Environment Variables

```bash
# Run the setup script to create .env file
npm run setup:backend
```

Then edit `backend/.env` with your actual values:

```env
# MongoDB Connection (use MongoDB Atlas for cloud hosting)
MONGODB_URI=mongodb://localhost:27017/whisper_db

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# ElevenLabs API Key (get from https://elevenlabs.io/)
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here

# Server Ports
PORT=5001
HTTPS_PORT=443
```

### 3. Start the Development Servers

**Terminal 1 - Backend:**

```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## 🔧 Configuration

### MongoDB Setup

1. **Local MongoDB**: Install MongoDB locally and start the service
2. **MongoDB Atlas**: Create a free cluster at https://cloud.mongodb.com/
   - Get your connection string
   - Replace `MONGODB_URI` in `.env`

### ElevenLabs API

1. Sign up at https://elevenlabs.io/
2. Get your API key from the dashboard
3. Add it to `ELEVENLABS_API_KEY` in `.env`

## 📁 Project Structure

```
whisper/
├── src/                    # Frontend React code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities and API
│   └── ...
├── backend/               # Backend server
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── .env              # Backend environment variables
└── ...
```

## 🚀 Deployment

### Frontend (Vercel)

The frontend is configured for Vercel deployment. The `vercel.json` handles routing.

### Backend

Deploy the backend to a server (e.g., DigitalOcean, Heroku, Railway) or use a serverless solution.

Update the `API_BASE_URL` in `src/lib/api.ts` to point to your deployed backend.

## 🔍 Troubleshooting

### "User not found" or 404 errors

- Ensure the backend server is running
- Check that MongoDB is connected
- Verify environment variables are set correctly
- Check the browser console for CORS errors

### Voice generation fails

- Verify ElevenLabs API key is valid
- Check user has sufficient credits
- Ensure text input is not empty

### Authentication issues

- Clear browser localStorage
- Check JWT token expiration
- Verify backend is accessible

## 📝 API Endpoints

- `POST /api/signup` - User registration
- `POST /api/login` - User authentication
- `GET /api/profile` - Get user profile
- `POST /api/generate-voice` - Generate voice with predefined voices
- `POST /api/generate-voice-model` - Generate voice with model voices
- `GET /api/voice-history` - Get user's voice history
- `GET /api/health` - Health check

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
