# EvoFit - Fitness Evolution Platform

## Project Overview
EvoFit is a comprehensive full-stack fitness tracking platform built with React, Node.js, Express, and MongoDB. It features nutrition tracking with Nutritionix API integration, workout logging, visual analytics, and community features.

## Recent Changes
- **October 15, 2025**: Initial MVP implementation completed
  - Built complete frontend with React, TypeScript, Tailwind CSS
  - Implemented MongoDB backend with Mongoose ODM
  - Integrated Nutritionix API for food tracking
  - Created JWT-based authentication system
  - Developed all core features: nutrition tracking, workout logging, analytics dashboard, community feed

## Tech Stack
- **Frontend**: React.js, TypeScript, Tailwind CSS, Wouter, TanStack Query, Recharts, shadcn/ui
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Axios
- **APIs**: Nutritionix API for food database (90,000+ foods)

## Project Architecture
- Separate frontend and backend structure for easy deployment
- MongoDB for data persistence with Mongoose models
- JWT authentication with Bearer tokens
- Protected API routes with auth middleware
- React Query for efficient data fetching and caching

## Environment Variables Required
- `MONGODB_URI` - MongoDB connection string
- `NUTRITIONIX_APP_ID` - Nutritionix application ID
- `NUTRITIONIX_APP_KEY` - Nutritionix API key
- `JWT_SECRET` - Secret for JWT signing (optional, has default)
- `SESSION_SECRET` - Session secret (already configured)

## Key Features
1. **Nutrition Tracker** - Search 90,000+ foods via Nutritionix API or manual entry
2. **Workout Logger** - Track exercises, sets, reps, weight with history
3. **Analytics Dashboard** - Visual charts for calories, macros, workout frequency
4. **Community Feed** - Share progress and engage with other users
5. **Dark/Light Mode** - Theme switching with persistence
6. **Responsive Design** - Mobile-first approach

## User Preferences
- Using energetic emerald green (#10b981) and electric blue (#3b82f6) color scheme
- Modern, athletic design with smooth animations
- Data-driven visualizations with Recharts
- Clean, accessible UI following WCAG guidelines

## Running the Project
```bash
npm run dev
```
This starts both the Express backend and Vite frontend on port 5000.

## Database Schema
- **Users**: Authentication and profile data
- **Meals**: Nutrition tracking with macros
- **Workouts**: Exercise logging with details
- **Posts**: Community sharing
- **Goals**: User nutrition and fitness targets

## API Routes
- `/api/auth/*` - Authentication (signup, login)
- `/api/nutrition/search` - Nutritionix food search
- `/api/meals/*` - Meal CRUD operations
- `/api/workouts/*` - Workout CRUD operations
- `/api/posts/*` - Community posts
- `/api/goals/*` - User goals management

## Design Guidelines
- Follow design_guidelines.md for all UI implementations
- Use shadcn components for consistency
- Implement hover-elevate and active-elevate-2 utilities
- Maintain proper spacing (p-4, gap-4 standard)
- Ensure proper contrast ratios for accessibility
