import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/Models/Recipe.model';
import { RecipeService } from 'src/app/ServiceDependencies/Recipe.Service';


@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {

  public recipeClicked :Recipe;
  public isRecepiSelected:boolean = false;
  constructor(private recipeService:RecipeService) { }

  ngOnInit() {
    this.recipeService.recipeSelected.subscribe
    (
      (recipeFromService:Recipe) =>
      {
        this.recipeClicked = recipeFromService;
        this.isRecepiSelected = true;
      }
    );
  }
}
