import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Trash2, Apple, Loader2 } from "lucide-react";
import type { Meal } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Nutrition() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    mealType: "breakfast",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    servingSize: "",
  });

  const { data: meals = [] } = useQuery<Meal[]>({
    queryKey: ["/api/meals"],
  });

  const addMealMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/meals", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/meals/today"] });
      toast({
        title: "Meal logged!",
        description: "Your meal has been added successfully.",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log meal",
        variant: "destructive",
      });
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/meals/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/meals/today"] });
      toast({
        title: "Meal deleted",
        description: "The meal has been removed.",
      });
    },
  });

  const searchNutritionix = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await apiRequest("POST", "/api/nutrition/search", { query: searchQuery });
      setSearchResults(response.foods || []);
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Could not search foods. Try manual entry.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const selectFood = (food: any) => {
    setFormData({
      name: food.food_name,
      mealType: formData.mealType,
      calories: Math.round(food.nf_calories).toString(),
      protein: food.nf_protein.toFixed(1),
      carbs: food.nf_total_carbohydrate.toFixed(1),
      fats: food.nf_total_fat.toFixed(1),
      servingSize: `${food.serving_qty} ${food.serving_unit}`,
    });
    setSearchResults([]);
    setSearchQuery("");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      mealType: "breakfast",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
      servingSize: "",
    });
    setSearchResults([]);
    setSearchQuery("");
    setIsCustomMode(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMealMutation.mutate({
      ...formData,
      calories: parseInt(formData.calories),
      protein: parseFloat(formData.protein),
      carbs: parseFloat(formData.carbs),
      fats: parseFloat(formData.fats),
      isCustom: isCustomMode,
    });
  };

  const mealsByType = {
    breakfast: meals.filter(m => m.mealType === "breakfast"),
    lunch: meals.filter(m => m.mealType === "lunch"),
    dinner: meals.filter(m => m.mealType === "dinner"),
    snack: meals.filter(m => m.mealType === "snack"),
  };

  return (
    <div className="container py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">Nutrition Tracker</h1>
          <p className="text-muted-foreground">Track your meals and macros</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-meal" className="gap-2">
              <Plus className="h-4 w-4" />
              Log Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log a Meal</DialogTitle>
              <DialogDescription>
                Search from 90,000+ foods or enter manually
              </DialogDescription>
            </DialogHeader>

            {!isCustomMode && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search foods (e.g., chicken breast, apple)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchNutritionix()}
                    data-testid="input-food-search"
                  />
                  <Button onClick={searchNutritionix} disabled={isSearching} data-testid="button-search">
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                    {searchResults.map((food, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectFood(food)}
                        className="w-full p-3 text-left hover-elevate"
                        data-testid={`search-result-${idx}`}
                      >
                        <p className="font-medium">{food.food_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round(food.nf_calories)} cal • {food.serving_qty} {food.serving_unit}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => setIsCustomMode(true)}
                  className="w-full"
                  data-testid="button-manual-entry"
                >
                  Or enter manually
                </Button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Food Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="input-food-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mealType">Meal Type</Label>
                  <Select
                    value={formData.mealType}
                    onValueChange={(value) => setFormData({ ...formData, mealType: value })}
                  >
                    <SelectTrigger data-testid="select-meal-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    required
                    data-testid="input-calories"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    required
                    data-testid="input-protein"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    required
                    data-testid="input-carbs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fats">Fats (g)</Label>
                  <Input
                    id="fats"
                    type="number"
                    step="0.1"
                    value={formData.fats}
                    onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                    required
                    data-testid="input-fats"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="servingSize">Serving Size (optional)</Label>
                <Input
                  id="servingSize"
                  value={formData.servingSize}
                  onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                  placeholder="e.g., 1 cup, 100g"
                  data-testid="input-serving-size"
                />
              </div>

              <Button type="submit" className="w-full" disabled={addMealMutation.isPending} data-testid="button-save-meal">
                {addMealMutation.isPending ? "Logging..." : "Log Meal"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {(["breakfast", "lunch", "dinner", "snack"] as const).map((type) => (
          <Card key={type} className="border-2" data-testid={`card-${type}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 capitalize">
                <Apple className="h-5 w-5 text-primary" />
                {type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mealsByType[type].length === 0 ? (
                <p className="text-muted-foreground text-sm">No meals logged</p>
              ) : (
                <div className="space-y-2">
                  {mealsByType[type].map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate"
                      data-testid={`meal-${meal.id}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{meal.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {meal.servingSize && `${meal.servingSize} • `}
                          P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-mono font-semibold">{meal.calories} kcal</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMealMutation.mutate(meal.id)}
                          data-testid={`button-delete-${meal.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
