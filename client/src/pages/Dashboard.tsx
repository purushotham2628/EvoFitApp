import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Flame, 
  Dumbbell, 
  TrendingUp, 
  Calendar,
  Plus,
  Apple,
  Activity
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Meal, Workout, Goal } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: todayMeals = [] } = useQuery<Meal[]>({
    queryKey: ["/api/meals/today"],
  });

  const { data: todayWorkouts = [] } = useQuery<Workout[]>({
    queryKey: ["/api/workouts/today"],
  });

  const { data: goal } = useQuery<Goal>({
    queryKey: ["/api/goals"],
  });

  const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = todayMeals.reduce((sum, meal) => sum + parseFloat(meal.protein.toString()), 0);
  const totalCarbs = todayMeals.reduce((sum, meal) => sum + parseFloat(meal.carbs.toString()), 0);
  const totalFats = todayMeals.reduce((sum, meal) => sum + parseFloat(meal.fats.toString()), 0);

  const calorieProgress = goal ? (totalCalories / goal.targetCalories) * 100 : 0;
  const proteinProgress = goal ? (totalProtein / goal.targetProtein) * 100 : 0;

  return (
    <div className="container py-8 px-4 space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="font-display text-4xl font-bold mb-2" data-testid="text-welcome">
          Welcome back, {user?.fullName?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">Here's your fitness overview for today</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/nutrition">
          <a>
            <Button data-testid="button-log-meal" className="gap-2">
              <Plus className="h-4 w-4" />
              Log Meal
            </Button>
          </a>
        </Link>
        <Link href="/workouts">
          <a>
            <Button variant="outline" data-testid="button-log-workout" className="gap-2">
              <Plus className="h-4 w-4" />
              Log Workout
            </Button>
          </a>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2" data-testid="card-calories">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Today</CardTitle>
            <Flame className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-calories">
              {totalCalories}
            </div>
            <p className="text-xs text-muted-foreground">
              Goal: {goal?.targetCalories || 2000} kcal
            </p>
            <Progress value={calorieProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-2" data-testid="card-protein">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
            <Apple className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-protein">
              {Math.round(totalProtein)}g
            </div>
            <p className="text-xs text-muted-foreground">
              Goal: {goal?.targetProtein || 150}g
            </p>
            <Progress value={proteinProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-2" data-testid="card-workouts">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-workout-count">
              {todayWorkouts.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Exercises completed today
            </p>
          </CardContent>
        </Card>

        <Card className="border-2" data-testid="card-streak">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-streak">
              7 days
            </div>
            <p className="text-xs text-muted-foreground">
              Keep it going!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Meals */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-primary" />
              Today's Meals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayMeals.length === 0 ? (
              <p className="text-muted-foreground text-sm" data-testid="text-no-meals">
                No meals logged yet. Start tracking your nutrition!
              </p>
            ) : (
              <div className="space-y-3">
                {todayMeals.slice(0, 3).map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate" data-testid={`meal-item-${meal.id}`}>
                    <div>
                      <p className="font-medium">{meal.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{meal.mealType}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold">{meal.calories} kcal</p>
                      <p className="text-xs text-muted-foreground">
                        P: {meal.protein}g • C: {meal.carbs}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workouts */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-chart-2" />
              Today's Workouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayWorkouts.length === 0 ? (
              <p className="text-muted-foreground text-sm" data-testid="text-no-workouts">
                No workouts logged yet. Time to hit the gym!
              </p>
            ) : (
              <div className="space-y-3">
                {todayWorkouts.slice(0, 3).map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate" data-testid={`workout-item-${workout.id}`}>
                    <div>
                      <p className="font-medium">{workout.exerciseName}</p>
                      <p className="text-sm text-muted-foreground">
                        {workout.sets} sets × {workout.reps} reps
                      </p>
                    </div>
                    {workout.weight && (
                      <div className="text-right">
                        <p className="font-mono font-semibold">{workout.weight} kg</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Macros Overview */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Today's Macros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Protein</span>
                <span className="font-mono font-semibold" data-testid="text-macro-protein">
                  {Math.round(totalProtein)}g / {goal?.targetProtein || 150}g
                </span>
              </div>
              <Progress value={proteinProgress} className="bg-chart-1/20" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Carbs</span>
                <span className="font-mono font-semibold" data-testid="text-macro-carbs">
                  {Math.round(totalCarbs)}g / {goal?.targetCarbs || 200}g
                </span>
              </div>
              <Progress value={goal ? (totalCarbs / goal.targetCarbs) * 100 : 0} className="bg-chart-3/20" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fats</span>
                <span className="font-mono font-semibold" data-testid="text-macro-fats">
                  {Math.round(totalFats)}g / {goal?.targetFats || 65}g
                </span>
              </div>
              <Progress value={goal ? (totalFats / goal.targetFats) * 100 : 0} className="bg-chart-2/20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
