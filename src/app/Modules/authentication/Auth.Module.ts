import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticationComponent } from './Components/Authentication/authentication.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule(
    {
        declarations:[AuthenticationComponent],
        imports:
        [
            CommonModule,
            ReactiveFormsModule,
            RouterModule.forChild([{path:'', children:[{path:':mode',component:AuthenticationComponent},]}]),
        ]
    })

export class AuthModule
{

}