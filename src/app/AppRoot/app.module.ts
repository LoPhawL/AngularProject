import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponentComponent } from './header/header-component.component';
import { Routes, RouterModule } from '@angular/router';
import { RecipeService } from '../ServiceDependencies/Recipe.Service';
import { ShoppingListService } from '../ServiceDependencies/ShoppingList.Service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Auth } from '../ServiceDependencies/Auth.Service';
import { AuthInterceptor } from '../ServiceDependencies/AuthInterceptor.service';
import { AuthGuard } from '../ServiceDependencies/AuthGuard.Service';

const routes:Routes =
[
  {path:'',redirectTo:'Auth/Login',pathMatch:'full'},
  {path:'Auth', loadChildren: () => import('../Modules/authentication/Auth.Module').then(m => m.AuthModule)},
  {path:'Recipes',loadChildren: () => import('../Modules/recipes/Recipe.Module').then(m => m.RecipeModule)},
  {path:'ShoppingList',loadChildren: () => import('../Modules/shopping-list/ShoppingList.Module').then(m => m.ShoppingListModule)}  
];
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers:[ShoppingListService,RecipeService,Auth, {provide:HTTP_INTERCEPTORS ,useClass:AuthInterceptor,multi:true},AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
