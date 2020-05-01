import { Component, OnInit, Input } from '@angular/core';
import { Ingredient } from 'src/app/Models/Ingredient.model';
import { ShoppingListService } from 'src/app/ServiceDependencies/ShoppingList.Service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {

  public ingredients:Ingredient[] = []
  constructor(private shoppingListService:ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.GetIngredients();

    this.shoppingListService.ingredientAdded.subscribe
    (
      (ing:Ingredient[])=>
      {
        this.ingredients =  ing;
      }
    );
  }

  CardClick(elementId:string)
  {
    document.getElementById('ingr_'+elementId).click();
  }
  EditIngredient(index:number)
  {
    this.shoppingListService.EditingIngredient.next(index);
    return false;
  }
}
