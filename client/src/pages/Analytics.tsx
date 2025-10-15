import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Calendar, Activity } from "lucide-react";
import type { Meal, Workout } from "@shared/schema";
import { format, subDays, startOfDay } from "date-fns";
import { useState } from "react";

type TimeRange = "7d" | "30d" | "90d";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  const { data: meals = [] } = useQuery<Meal[]>({
    queryKey: ["/api/meals"],
  });

  const { data: workouts = [] } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const startDate = subDays(new Date(), days - 1);

  const dailyData = Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayMeals = meals.filter(m => format(new Date(m.createdAt), "yyyy-MM-dd") === dateStr);
    const dayWorkouts = workouts.filter(w => format(new Date(w.createdAt), "yyyy-MM-dd") === dateStr);

    return {
      date: format(date, "MMM d"),
      calories: dayMeals.reduce((sum, m) => sum + m.calories, 0),
      protein: dayMeals.reduce((sum, m) => sum + parseFloat(m.protein.toString()), 0),
      carbs: dayMeals.reduce((sum, m) => sum + parseFloat(m.carbs.toString()), 0),
      fats: dayMeals.reduce((sum, m) => sum + parseFloat(m.fats.toString()), 0),
      workouts: dayWorkouts.length,
    };
  });

  const avgCalories = Math.round(dailyData.reduce((sum, d) => sum + d.calories, 0) / days);
  const avgProtein = Math.round(dailyData.reduce((sum, d) => sum + d.protein, 0) / days);
  const totalWorkouts = dailyData.reduce((sum, d) => sum + d.workouts, 0);

  return (
    <div className="container py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Visualize your fitness progress</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7d")}
            data-testid="button-7d"
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30d")}
            data-testid="button-30d"
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("90d")}
            data-testid="button-90d"
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2" data-testid="card-avg-calories">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily Calories</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-avg-calories">
              {avgCalories}
            </div>
            <p className="text-xs text-muted-foreground">kcal per day</p>
          </CardContent>
        </Card>

        <Card className="border-2" data-testid="card-avg-protein">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily Protein</CardTitle>
            <Activity className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-avg-protein">
              {avgProtein}g
            </div>
            <p className="text-xs text-muted-foreground">per day</p>
          </CardContent>
        </Card>

        <Card className="border-2" data-testid="card-total-workouts">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Calendar className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-total-workouts">
              {totalWorkouts}
            </div>
            <p className="text-xs text-muted-foreground">in last {days} days</p>
          </CardContent>
        </Card>
      </div>

      {/* Calorie Trend */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Calorie Intake Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="calories" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-3))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Macros Breakdown */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Macronutrient Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px"
                }}
              />
              <Legend />
              <Bar dataKey="protein" fill="hsl(var(--chart-1))" name="Protein (g)" />
              <Bar dataKey="carbs" fill="hsl(var(--chart-3))" name="Carbs (g)" />
              <Bar dataKey="fats" fill="hsl(var(--chart-2))" name="Fats (g)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Workout Frequency */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Workout Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px"
                }}
              />
              <Bar 
                dataKey="workouts" 
                fill="hsl(var(--chart-2))" 
                name="Workouts"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
