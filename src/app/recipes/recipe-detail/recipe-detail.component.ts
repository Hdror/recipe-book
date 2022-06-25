import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ShoppingService } from 'src/app/shopping-list/shopping.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe
  id: number
  constructor(private shoppingService: ShoppingService, private router: Router, private route: ActivatedRoute, private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id']
      console.log(params['id']);

      this.recipe = this.recipeService.getRecipe(this.id)
    })
  }

  onAddIngredients() {
    this.shoppingService.onAddIngredients(this.recipe.ingredients)
  }

  onAddedRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route })
  }

  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.id)
    this.router.navigate(['/recipes'])
  }

}
