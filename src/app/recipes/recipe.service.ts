import { Subject } from "rxjs"
import { Ingredient } from "../shared/ingredient.model"
import { Recipe } from "./recipe.model"

export class RecipeService {

    recipeChanged = new Subject<Recipe[]>()

    // private recipes: Recipe[] = [
    //     new Recipe('A Test Recipe', 'This is simply a test', 'https://www.das-koehle.at/uploads/tx_bh/food_web_008.jpg', [new Ingredient('Pasta', 1), new Ingredient('Tomato Sauce', 1), new Ingredient('Tomato', 3)]),
    //     new Recipe('Another Test Recipe', 'This is simply a test', 'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg', [new Ingredient('Meat', 1), new Ingredient('Salad', 1)])
    // ]

    private recipes: Recipe[] = []

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes
        this.recipeChanged.next(this.recipes.slice())
    }

    getRecipes() {
        return this.recipes.slice()
    }

    getRecipe(index: number) {
        return this.recipes[index]
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe)
        this.recipeChanged.next(this.recipes.slice())
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe
        this.recipeChanged.next(this.recipes.slice())
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1)
        this.recipeChanged.next(this.recipes.slice())
    }
}