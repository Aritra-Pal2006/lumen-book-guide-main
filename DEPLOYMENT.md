# Deployment to Render

This document provides instructions for deploying the BookAI application to Render.

## Prerequisites

1. A Render account (https://render.com)
2. A GitHub account with the repository pushed
3. Environment variables configured in Render

## Environment Variables

The following environment variables need to be set in your Render dashboard:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_GOOGLE_BOOKS_API_KEY=your_google_books_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Deployment Steps

1. Push your code to a GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New" and select "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - Name: bookai-app (or any name you prefer)
   - Environment: Node
   - Build command: `npm install --include=dev && npm run build`
   - Start command: `npm run preview`
   - Auto-deploy: Yes
6. Add your environment variables in the "Environment" section
7. Click "Create Web Service"

## Render Configuration

This project includes a `render.yaml` file that defines the deployment configuration:

```yaml
services:
  - type: web
    name: bookai-app
    env: node
    buildCommand: npm install --include=dev && npm run build
    startCommand: npm run preview
    envVars:
      - key: NODE_VERSION
        value: 18
```

## Build and Start Commands

- Build command: `npm run build`
- Start command: `npm run preview`

The application will be built and served on Render using these commands.