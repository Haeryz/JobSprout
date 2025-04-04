# JobSprout

JobSprout is a full-stack job application management platform designed to streamline job searching, application tracking, and profile management. It features a React-based frontend and a Node.js/Express backend integrated with Firebase and Azure Blob Storage.

## Features

### Frontend
- Built with React, TypeScript, and Vite for fast development and performance.
- State management using Zustand.
- TailwindCSS for modern and responsive UI design.
- Authentication and profile management.
- Job search and application tracking.

### Backend
- Node.js/Express server with Firebase Admin SDK integration.
- Authentication using Firebase (email/password and Google login).
- Job search powered by JSearch API.
- Profile management with Azure Blob Storage for resume uploads.
- Security features including XSS protection, NoSQL injection prevention, and rate limiting.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Firebase project with proper credentials
- Azure Blob Storage account

## Setup

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email
   FIREBASE_PRIVATE_KEY=your-firebase-private-key
   AZURE_STORAGE_ACCOUNT=your-azure-storage-account
   AZURE_STORAGE_ACCESS_KEY=your-azure-storage-access-key
   JSEARCH_API_KEY=your-jsearch-api-key
   JWT_SECRET=your-jwt-secret
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Backend
- The backend server runs on `http://localhost:5000` by default.
- API endpoints include:
  - `/api/auth` for authentication
  - `/api/profile` for profile management
  - `/api/jobs` for job search and application tracking

### Frontend
- The frontend runs on `http://localhost:5173` by default.
- Key pages include:
  - **Home**: Landing page
  - **Job Search**: Search and apply for jobs
  - **Profile**: Manage user profile and upload resumes
  - **Subscription**: View subscription plans

## Testing

### Backend
- Run tests using Vitest:
  ```bash
  npm test
  ```

### Frontend
- Add your preferred testing framework (e.g., Jest, React Testing Library) for frontend tests.

## Deployment

### Backend
- Deploy the backend to a cloud provider (e.g., AWS, Google Cloud, or Azure).
- Ensure environment variables are properly configured in the production environment.

### Frontend
- Build the frontend for production:
  ```bash
  npm run build
  ```
- Deploy the `dist` folder to a static hosting service (e.g., Netlify, Vercel, or Firebase Hosting).

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License.