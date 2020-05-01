import { NgModule } from '@angular/core';
import { RecipesComponent } from './Components/recipes.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './Components/recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeStartComponent } from './Components/recipe-start/recipe-start.component';
import { RecipeEditComponent } from './Components/recipe-edit/recipe-edit.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from 'src/app/ServiceDependencies/AuthGuard.Service';


@NgModule(
    {
        declarations:
        [
            RecipesComponent,
            RecipeListComponent,
            RecipeDetailComponent,
            RecipeItemComponent,
            RecipeStartComponent,
            RecipeEditComponent,
        ],
        imports:
        [ 
            RouterModule.forChild(
                [
                    {path:'',component:RecipesComponent, canActivate:[AuthGuard],
                    children:
                    [
                        {path:'',component:RecipeStartComponent},
                        {path:'New',component:RecipeEditComponent},
                        {path:':index/Edit',component:RecipeEditComponent},
                        {path:':index',component:RecipeDetailComponent}
                    ]},
                ]),
            CommonModule,
            FormsModule,
            ReactiveFormsModule
        ],
       
    })
export class RecipeModule
{

}