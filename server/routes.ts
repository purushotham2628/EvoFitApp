import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import axios from "axios";
import { User } from "./models/User";
import { Meal } from "./models/Meal";
import { Workout } from "./models/Workout";
import { Post } from "./models/Post";
import { Goal } from "./models/Goal";
import { authenticateToken, generateToken, type AuthRequest } from "./middleware/auth";
import { connectDatabase } from "./db";
import { startOfDay, endOfDay } from "date-fns";

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to MongoDB
  await connectDatabase();

  // Auth Routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, email, password, fullName } = req.body;

      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: "Username or email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        fullName,
      });

      // Create default goal for user
      await Goal.create({ userId: user._id });

      const token = generateToken(user._id.toString());
      const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      };

      res.json({ user: userResponse, token });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user._id.toString());
      const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      };

      res.json({ user: userResponse, token });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Nutritionix Search
  app.post("/api/nutrition/search", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { query } = req.body;
      
      const response = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        { query },
        {
          headers: {
            "x-app-id": process.env.NUTRITIONIX_APP_ID,
            "x-app-key": process.env.NUTRITIONIX_APP_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      res.json({ foods: response.data.foods });
    } catch (error: any) {
      res.status(500).json({ message: "Nutritionix search failed", error: error.message });
    }
  });

  // Meal Routes
  app.get("/api/meals", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const meals = await Meal.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
      const mealsWithId = meals.map(meal => ({ ...meal, id: meal._id.toString(), _id: undefined }));
      res.json(mealsWithId);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/meals/today", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const today = new Date();
      const meals = await Meal.find({
        userId: req.userId,
        createdAt: {
          $gte: startOfDay(today),
          $lte: endOfDay(today),
        },
      }).sort({ createdAt: -1 }).lean();
      const mealsWithId = meals.map(meal => ({ ...meal, id: meal._id.toString(), _id: undefined }));
      res.json(mealsWithId);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/meals", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const meal = await Meal.create({
        ...req.body,
        userId: req.userId,
      });
      const mealWithId = { ...meal.toObject(), id: meal._id.toString(), _id: undefined };
      res.json(mealWithId);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/meals/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      await Meal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
      res.json({ message: "Meal deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Workout Routes
  app.get("/api/workouts", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const workouts = await Workout.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
      const workoutsWithId = workouts.map(workout => ({ ...workout, id: workout._id.toString(), _id: undefined }));
      res.json(workoutsWithId);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/workouts/today", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const today = new Date();
      const workouts = await Workout.find({
        userId: req.userId,
        createdAt: {
          $gte: startOfDay(today),
          $lte: endOfDay(today),
        },
      }).sort({ createdAt: -1 }).lean();
      const workoutsWithId = workouts.map(workout => ({ ...workout, id: workout._id.toString(), _id: undefined }));
      res.json(workoutsWithId);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/workouts", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const workout = await Workout.create({
        ...req.body,
        userId: req.userId,
      });
      const workoutWithId = { ...workout.toObject(), id: workout._id.toString(), _id: undefined };
      res.json(workoutWithId);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/workouts/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      await Workout.findOneAndDelete({ _id: req.params.id, userId: req.userId });
      res.json({ message: "Workout deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Goal Routes
  app.get("/api/goals", authenticateToken, async (req: AuthRequest, res) => {
    try {
      let goal = await Goal.findOne({ userId: req.userId }).lean();
      if (!goal) {
        const newGoal = await Goal.create({ userId: req.userId });
        goal = newGoal.toObject();
      }
      const goalWithId = { ...goal, id: goal._id.toString(), _id: undefined };
      res.json(goalWithId);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/goals", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const goal = await Goal.findOneAndUpdate(
        { userId: req.userId },
        { ...req.body, updatedAt: new Date() },
        { new: true, upsert: true }
      ).lean();
      const goalWithId = { ...goal, id: goal._id.toString(), _id: undefined };
      res.json(goalWithId);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Post Routes
  app.get("/api/posts", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      const postsWithUsers = await Promise.all(
        posts.map(async (post) => {
          const user = await User.findById(post.userId).select("fullName username");
          return {
            ...post,
            id: post._id.toString(),
            _id: undefined,
            user: user ? { fullName: user.fullName, username: user.username } : null,
          };
        })
      );

      res.json(postsWithUsers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/posts", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const post = await Post.create({
        ...req.body,
        userId: req.userId,
      });
      const postWithId = { ...post.toObject(), id: post._id.toString(), _id: undefined };
      res.json(postWithId);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/posts/:id/like", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } },
        { new: true }
      ).lean();
      const postWithId = { ...post, id: post._id.toString(), _id: undefined };
      res.json(postWithId);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
