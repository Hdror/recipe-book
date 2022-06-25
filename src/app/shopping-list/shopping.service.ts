import { EventEmitter } from "@angular/core"
import { Subject } from "rxjs"
import { Ingredient } from "../shared/ingredient.model"

export class ShoppingService {

    ingredientsChange = new Subject<Ingredient[]>()
    startedEditing = new Subject<number>()
    ingredientAdded = new EventEmitter<Ingredient>()

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatos', 10)
    ]

    onAddIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient)
        this.ingredientsChange.next(this.ingredients.slice())
    }

    onAddIngredients(ingredients: Ingredient[]) {
        // ingredients.map((ingredient: Ingredient) => {
        //     this.onAddIngredient(ingredient)
        // })
        this.ingredients.push(...ingredients)
        this.ingredientsChange.next(this.ingredients.slice())

    }

    getIngredients() {
        return this.ingredients.slice()
    }

    getIngredient(index: number) {
        return this.ingredients[index]
    }

    updateIngredient(ingredientIdx: number, ingredient: Ingredient) {
        this.ingredients[ingredientIdx] = ingredient
        this.ingredientsChange.next(this.ingredients.slice())
    }

    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1)
        this.ingredientsChange.next(this.ingredients.slice())
    }

}