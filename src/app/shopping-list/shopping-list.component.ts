import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model'
import { ShoppingService } from './shopping.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
  // providers: [ShoppingService]
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[]
  private igChangeSub: Subscription

  constructor(private shoppingService: ShoppingService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingService.getIngredients()
    this, this.igChangeSub = this.shoppingService.ingredientsChange.subscribe((ingredients: Ingredient[]) => {
      this.ingredients = ingredients
    })
  }

  onEditItem(index: number) {
    this.shoppingService.startedEditing.next(index)
  }

  ngOnDestroy(): void {
    this.igChangeSub.unsubscribe()
  }



  // onIngredientAdded(ingredient: Ingredient) {
  //    this.shoppingService.getIngredients()
  // }

}
