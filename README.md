# Kudos Wall

Kudos Wall is a web application where team members can share appreciation and praise with each other. Users can send kudos (compliments), collect badges, and manage their profiles.

## Key Features

- 👥 User Authentication (Firebase Auth)
- 🎉 Create and Share Kudos
- 🏆 Badge System
- 👤 Profile Management
- 🖼️ Avatar Proxy System

## Tech Stack

- Frontend: React + TypeScript + Vite
- UI: Material-UI + Emotion + Styled Components
- State Management: Redux Toolkit
- Backend: Firebase (Auth, Firestore, Storage)
- Deployment: Vercel

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Firebase Project
- Vercel Account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/kudos-wall.git
cd kudos-wall
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the project root and configure the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start the development server:
```bash
npm run dev
```

### Deployment

1. Before deploying to Vercel, add the following environment variables to your Vercel project settings:
   - All `VITE_FIREBASE_*` environment variables

2. Connect your GitHub repository to Vercel, and deployment will start automatically.

## Project Structure

```
kudos-wall/
├── api/              # Vercel Serverless Functions
├── public/           # Static files
├── src/
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── utils/        # Utility functions
│   ├── store/        # Redux store
│   ├── types/        # TypeScript type definitions
│   └── styles/       # Global styles
└── ...
```

## API Endpoints

### Avatar Proxy (`/api/avatar`)

Proxies external images to solve CORS issues and provides caching.

## License

This project is licensed under the MIT License.
