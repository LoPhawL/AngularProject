import { Component } from '@angular/core';
import { Ingredient } from '../Models/Ingredient.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'UdmProject';
  ShowRecipe:boolean=true;
  public newIngredient:Ingredient;
}
