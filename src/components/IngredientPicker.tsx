import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, ChefHat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IngredientPickerProps {
  onGenerateRecipes: (ingredients: string[]) => void;
  isLoading?: boolean;
}

const commonIngredients = [
  "Chicken", "Beef", "Fish", "Rice", "Pasta", "Tomatoes", "Onions", "Garlic",
  "Bell Peppers", "Mushrooms", "Cheese", "Eggs", "Potatoes", "Carrots", "Spinach",
  "Olive Oil", "Salt", "Pepper", "Herbs", "Lemon"
];

const IngredientPicker = ({ onGenerateRecipes, isLoading = false }: IngredientPickerProps) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customIngredient, setCustomIngredient] = useState("");

  const addIngredient = (ingredient: string) => {
    if (ingredient && !selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };

  const addCustomIngredient = () => {
    if (customIngredient.trim()) {
      addIngredient(customIngredient.trim());
      setCustomIngredient("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCustomIngredient();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-ingredient bg-gradient-card">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
          <ChefHat className="h-6 w-6 text-primary" />
          What's in your kitchen?
        </CardTitle>
        <p className="text-muted-foreground">
          Select ingredients and let our AI chef create amazing recipes for you
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Custom ingredient input */}
        <div className="flex gap-2">
          <Input
            placeholder="Add your own ingredient..."
            value={customIngredient}
            onChange={(e) => setCustomIngredient(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={addCustomIngredient}
            variant="outline"
            size="icon"
            disabled={!customIngredient.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Common ingredients grid */}
        <div className="space-y-3">
          <h3 className="font-medium text-foreground">Popular Ingredients</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {commonIngredients.map((ingredient) => (
              <Button
                key={ingredient}
                variant={selectedIngredients.includes(ingredient) ? "default" : "outline"}
                size="sm"
                onClick={() => 
                  selectedIngredients.includes(ingredient) 
                    ? removeIngredient(ingredient)
                    : addIngredient(ingredient)
                }
                className="justify-start text-sm"
              >
                {ingredient}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected ingredients */}
        {selectedIngredients.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Selected Ingredients ({selectedIngredients.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient) => (
                <Badge key={ingredient} variant="secondary" className="gap-1 py-1">
                  {ingredient}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => removeIngredient(ingredient)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Generate button */}
        <Button
          onClick={() => onGenerateRecipes(selectedIngredients)}
          disabled={selectedIngredients.length === 0 || isLoading}
          size="lg"
          className="w-full bg-gradient-hero text-primary-foreground font-semibold"
        >
          {isLoading ? (
            "Cooking up recipes..."
          ) : (
            `Generate 3 Recipes (${selectedIngredients.length} ingredients)`
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default IngredientPicker;