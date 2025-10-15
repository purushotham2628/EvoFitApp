import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Dumbbell, Calendar } from "lucide-react";
import type { Workout } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

export default function Workouts() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    exerciseName: "",
    sets: "",
    reps: "",
    weight: "",
    duration: "",
    notes: "",
  });

  const { data: workouts = [] } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const addWorkoutMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/workouts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts/today"] });
      toast({
        title: "Workout logged!",
        description: "Your workout has been added successfully.",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log workout",
        variant: "destructive",
      });
    },
  });

  const deleteWorkoutMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/workouts/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts/today"] });
      toast({
        title: "Workout deleted",
        description: "The workout has been removed.",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      exerciseName: "",
      sets: "",
      reps: "",
      weight: "",
      duration: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWorkoutMutation.mutate({
      exerciseName: formData.exerciseName,
      sets: parseInt(formData.sets),
      reps: parseInt(formData.reps),
      weight: formData.weight ? parseFloat(formData.weight) : null,
      duration: formData.duration ? parseInt(formData.duration) : null,
      notes: formData.notes || null,
    });
  };

  const groupByDate = (workouts: Workout[]) => {
    const groups: Record<string, Workout[]> = {};
    workouts.forEach((workout) => {
      const date = format(new Date(workout.createdAt), "yyyy-MM-dd");
      if (!groups[date]) groups[date] = [];
      groups[date].push(workout);
    });
    return groups;
  };

  const groupedWorkouts = groupByDate(workouts);
  const sortedDates = Object.keys(groupedWorkouts).sort((a, b) => b.localeCompare(a));

  return (
    <div className="container py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">Workout Logger</h1>
          <p className="text-muted-foreground">Track your exercises and progress</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-workout" className="gap-2">
              <Plus className="h-4 w-4" />
              Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Log a Workout</DialogTitle>
              <DialogDescription>
                Record your exercise details
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exerciseName">Exercise Name</Label>
                <Input
                  id="exerciseName"
                  placeholder="e.g., Bench Press, Squats"
                  value={formData.exerciseName}
                  onChange={(e) => setFormData({ ...formData, exerciseName: e.target.value })}
                  required
                  data-testid="input-exercise-name"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sets">Sets</Label>
                  <Input
                    id="sets"
                    type="number"
                    value={formData.sets}
                    onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                    required
                    data-testid="input-sets"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    id="reps"
                    type="number"
                    value={formData.reps}
                    onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                    required
                    data-testid="input-reps"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg) - Optional</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    data-testid="input-weight"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min) - Optional</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    data-testid="input-duration"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this workout..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  data-testid="input-notes"
                />
              </div>

              <Button type="submit" className="w-full" disabled={addWorkoutMutation.isPending} data-testid="button-save-workout">
                {addWorkoutMutation.isPending ? "Logging..." : "Log Workout"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {sortedDates.length === 0 ? (
          <Card className="border-2">
            <CardContent className="py-12 text-center">
              <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No workouts logged yet. Start tracking your progress!</p>
            </CardContent>
          </Card>
        ) : (
          sortedDates.map((date) => (
            <Card key={date} className="border-2" data-testid={`workout-date-${date}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {format(new Date(date), "EEEE, MMMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groupedWorkouts[date].map((workout) => (
                    <div
                      key={workout.id}
                      className="flex items-start justify-between p-4 rounded-lg bg-muted/50 hover-elevate"
                      data-testid={`workout-${workout.id}`}
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{workout.exerciseName}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {workout.sets} sets × {workout.reps} reps
                          {workout.weight && ` • ${workout.weight} kg`}
                          {workout.duration && ` • ${workout.duration} min`}
                        </p>
                        {workout.notes && (
                          <p className="text-sm text-muted-foreground italic">{workout.notes}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteWorkoutMutation.mutate(workout.id)}
                        data-testid={`button-delete-${workout.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
