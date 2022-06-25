import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from '../shopping.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f') slForm: NgForm
  // @ViewChild('amountInput') amountInputRef: ElementRef

  subscreption: Subscription
  editMode = false
  editItemIndex: number
  editItem: Ingredient
  // @Output() ingredientAdded = new EventEmitter<Ingredient>()
  constructor(private shoppingService: ShoppingService) { }

  ngOnInit(): void {
    this.subscreption = this.shoppingService.startedEditing.subscribe((index: number) => {
      this.editItemIndex = index
      this.editMode = true
      this.editItem = this.shoppingService.getIngredient(index)
      const { name, amount } = this.editItem
      this.slForm.setValue({ name, amount })
    })
  }

  onAddItem(form: NgForm) {

    const newIngredient = new Ingredient(form.value.name, form.value.amount)
    if (this.editMode) this.shoppingService.updateIngredient(this.editItemIndex, newIngredient)
    else this.shoppingService.onAddIngredient(newIngredient)
    this.editMode = false
    form.reset()

  }

  onDeleteItem(){
    this.shoppingService.deleteIngredient(this.editItemIndex)
    this.onClear()
  }

  ngOnDestroy() {
    this.subscreption.unsubscribe()
  }

  onClear(){
    
    this.slForm.reset()
    this.editMode ==false
  }

}
