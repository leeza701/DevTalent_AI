# DevTalent AI

Evidence-Based Developer Talent Intelligence Platform.

## Project Structure

This is a monorepo setup containing:

- `frontend/`: React + Vite + TailwindCSS application for the user interface.
- `backend/`: Node.js + Express API server with MongoDB connection setup.

## Setup Instructions

1. **Install Root Dependencies**:
   From the root folder, install the concurrent scripts tool.
   ```bash
   npm install
   ```
2. **Install Workspace Dependencies**:
   Easily install both frontend and backend dependencies using the root command:
   ```bash
   npm run install-all
   ```

3. **Configure Environment Variables**:
   In the `/backend` folder, duplicate `.env.example` and rename it to `.env`. It contains default placeholder values for the API port and MongoDB URI. (Ensure MongoDB is running locally on your device if using the default host).

## Running the Application

To run both the backend server and the frontend application simultaneously in watch/dev mode, run:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173/` by default, and the backend Express server will run on `http://localhost:5000/`.
