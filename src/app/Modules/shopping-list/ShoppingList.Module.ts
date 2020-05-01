import { NgModule } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingListEditComponent } from './shopping-list-edit/shopping-list-edit.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule(
    {
        declarations:
        [
            ShoppingListComponent,
            ShoppingListEditComponent,
        ],
        imports:
        [
            CommonModule,
            RouterModule.forChild([{path:'',component:ShoppingListComponent}]),
            FormsModule
        ]
    })
export class ShoppingListModule{}