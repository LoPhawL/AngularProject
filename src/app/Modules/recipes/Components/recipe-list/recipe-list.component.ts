import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Recipe } from 'src/app/Models/Recipe.model';
import { RecipeService } from 'src/app/ServiceDependencies/Recipe.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  private recepies:Recipe[];
  private loadingData = false;
  private loadingText = 'Fetching recipes... Hang on.';

  constructor(private recipeService:RecipeService) {}

  ngOnInit() {
    this.recipeService.recipeLoading.subscribe(status => {this.loadingData = status;});
    this.recepies =  this.recipeService.GetRecepies();
    this.recipeService.recipeAltered.subscribe( data=>
      {//1* - a recipe
        if(data.edit == false) //added or deleted 1*
        {
          if(data.recipe == null)//deleted 1*
          {this.recepies = this.recipeService.GetRecepies();}
          else//added 1*
          {this.recepies.push(data.recipe);}
         }
        else //edited 1*
        {this.recepies[data.ind] = data.recipe;}
      },
            error=>{if(error == 401){this.loadingText = "Login to see the recipes."}});
    this.recipeService.FetchData();

  }

  mouseEnter(index:number,ele)
  {
    document.getElementById('img'+index).classList.add('hoverCard') ;
  }

  mouseLeave(index:number,ele)
  {
    document.getElementById('img'+index).classList.remove('hoverCard') ;
  }

  // RecipeClicked(clickIndex:number)
  // {
  //   this.recipeService.recipeSelected.emit(this.recepies[clickIndex]);
  // }
}
