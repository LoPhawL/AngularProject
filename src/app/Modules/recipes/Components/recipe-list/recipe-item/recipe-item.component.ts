import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from 'src/app/Models/Recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  @Input() public currentRecipe:Recipe;
  @Input() public currentIndex:number;
  constructor() 
  {}

  ngOnInit() {
    // console.log(this.currentRecipe.name);
  }

}
