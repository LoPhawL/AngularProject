import { Component, OnInit} from '@angular/core';
import { Recipe } from 'src/app/Models/Recipe.model';//src/app/Models/Recipe.model
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/ServiceDependencies/Recipe.Service';
import { ShoppingListService } from 'src/app/ServiceDependencies/ShoppingList.Service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  private recipe:Recipe;
  private selectedRecipeId:number;

  constructor(private router:Router,  
              private recipeService: RecipeService,
              private activeRoute: ActivatedRoute, 
              private shoppingListService:ShoppingListService) 
  {
    this.activeRoute.params.subscribe
    (
      params => 
      {
        if (this.recipeService.RecipeCount() <= params['index'] )
        {
          this.router.navigate(['Recipes'])
        }
        else{
         this.recipe = this.recipeService.GetRecipe(params['index']); 
         this.selectedRecipeId = params['index'];
        }
      }
    );
  }

  ngOnInit() {
   
  }

  DeleteRecipe()
  {
    this.recipeService.DeleteRecipe(this.selectedRecipeId);
    this.router.navigate(['Recipes'])

  }

  AddToCart()
  {
    this.shoppingListService.InsertIngredients(this.recipe.ingredients);
    this.router.navigate(['ShoppingList'])
    // document.getElementById('nav_ShoppingList').click();
  }
  ReplaceCart()
  {
    this.shoppingListService.ReplaceIngredients(this.recipe.ingredients);
    this.router.navigate(['ShoppingList'])
    // document.getElementById('nav_ShoppingList').click();
  }
}

