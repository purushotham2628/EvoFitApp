# EvoFit – Next-Gen Fitness Evolution Platform

![EvoFit Banner](./attached_assets/stock_images/athletic_person_doin_f44ce44d.jpg)

A comprehensive full-stack fitness platform that enables personalized workout and meal tracking with real-time progress monitoring and community features.

## 🌟 Features

### 📊 Nutrition Tracking
- **90,000+ Foods Database** - Powered by Nutritionix API for comprehensive nutritional data
- **Smart Food Search** - Natural language search for instant food lookup
- **Manual Entry** - Custom food creation with detailed macro tracking
- **Meal Categories** - Organize meals by Breakfast, Lunch, Dinner, and Snacks
- **Daily Macro Goals** - Track calories, protein, carbs, and fats with visual progress

### 💪 Workout Logger
- **Exercise Tracking** - Log sets, reps, weight, and duration
- **Workout History** - View all workouts organized by date
- **Progress Notes** - Add personal notes to each workout
- **Flexible Logging** - Track cardio, strength training, and custom exercises

### 📈 Visual Analytics Dashboard
- **Interactive Charts** - Beautiful visualizations using Recharts
- **Calorie Trends** - Track daily calorie intake over time (7d/30d/90d views)
- **Macro Breakdown** - Visualize protein, carbs, and fats distribution
- **Workout Frequency** - Monitor exercise consistency
- **Goal Progress** - Real-time progress tracking with circular indicators

### 👥 Community Features
- **Progress Sharing** - Post achievements and motivate others
- **Social Feed** - View community updates and success stories
- **Like & Engage** - Support fellow fitness enthusiasts
- **User Profiles** - Track your journey with personal stats

### 🎨 Modern Design
- **Dark/Light Mode** - Seamless theme switching with localStorage persistence
- **Responsive Design** - Perfect experience across all devices
- **Energetic Color Scheme** - Vibrant emerald and electric blue theme
- **Smooth Animations** - Polished micro-interactions and transitions
- **Accessibility** - WCAG compliant with proper contrast ratios

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Wouter** - Lightweight routing
- **TanStack Query** - Powerful data fetching
- **Recharts** - Interactive data visualization
- **shadcn/ui** - Beautiful component library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **Nutritionix API** - Comprehensive food database

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- MongoDB Atlas account (or local MongoDB)
- Nutritionix API credentials

### Environment Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd evofit
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Nutritionix API Credentials
NUTRITIONIX_APP_ID=your_nutritionix_app_id
NUTRITIONIX_APP_KEY=your_nutritionix_api_key

# JWT Secret (change in production)
JWT_SECRET=your_jwt_secret_key
```

**Get your API credentials:**
- MongoDB: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Nutritionix: [https://www.nutritionix.com/business/api](https://www.nutritionix.com/business/api)

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
evofit/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React context providers
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and configurations
│   │   └── App.tsx        # Main app component
│   └── index.html
│
├── server/                # Backend Express application
│   ├── models/           # Mongoose database models
│   ├── middleware/       # Authentication & validation
│   ├── routes.ts         # API route definitions
│   └── db.ts            # Database connection
│
├── shared/               # Shared TypeScript types
│   └── schema.ts        # Data models and Zod schemas
│
└── README.md
```

## 🔑 Key Features Explained

### Authentication
- JWT-based authentication with 7-day token expiry
- Secure password hashing using bcrypt
- Protected routes with automatic redirect

### Data Flow
1. User logs in → JWT token stored in localStorage
2. Authenticated requests include Bearer token
3. Backend validates token and returns user-specific data
4. Frontend caches data with TanStack Query

### Nutritionix Integration
- Real-time food search with natural language processing
- Automatic macro calculation from 90,000+ foods
- Fallback to manual entry for custom foods

## 📊 Database Schema

### Users
- Username, email, password (hashed)
- Full name and creation timestamp

### Meals
- Food name, meal type, serving size
- Calories, protein, carbs, fats
- Custom/API flag and timestamp

### Workouts
- Exercise name, sets, reps
- Weight, duration, notes
- Timestamp for history tracking

### Posts
- User content and optional image
- Like count and timestamp
- User reference for display

### Goals
- Target calories and macros
- Weight goals
- User-specific settings

## 🎯 Usage Guide

### Getting Started
1. **Sign Up** - Create your account
2. **Set Goals** - Configure your nutrition targets (auto-created on signup)
3. **Log Meals** - Search foods or enter manually
4. **Track Workouts** - Record your exercises
5. **View Analytics** - Monitor your progress
6. **Share Journey** - Post updates to the community

### Daily Workflow
1. Start your day on the Dashboard to see your overview
2. Log meals after eating (breakfast, lunch, dinner, snacks)
3. Record workouts after exercising
4. Check Analytics to visualize progress
5. Share achievements with the Community

## 🚀 Deployment

### Separate Frontend/Backend Deployment

**Frontend (Vercel/Netlify):**
```bash
# Build the frontend
npm run build

# Deploy the 'dist' folder
```

**Backend (Railway/Render/Heroku):**
- Set environment variables in your hosting platform
- Deploy the entire project (backend will auto-start)

### Combined Deployment
The project is configured to run both frontend and backend on the same server. Simply deploy and ensure all environment variables are set.

## 🔒 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with secure signing
- Protected API routes with authentication middleware
- Input validation on all endpoints
- CORS configured for security

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Nutritionix API** - Comprehensive food database
- **MongoDB Atlas** - Cloud database hosting
- **shadcn/ui** - Beautiful component library
- **Recharts** - Data visualization library

## 📧 Support

For questions or support, please open an issue in the GitHub repository.

---

**Built with ❤️ for the fitness community**

Transform your fitness journey with EvoFit - Track, Analyze, Evolve! 🚀💪
