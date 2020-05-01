import { Component, OnInit, Output,EventEmitter, OnDestroy } from '@angular/core';
import { RecipeService } from 'src/app/ServiceDependencies/Recipe.Service';
import { Subject } from 'rxjs';
import { User } from 'src/app/Models/User.model';
import { Auth } from 'src/app/ServiceDependencies/Auth.Service';

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.css']
})
export class HeaderComponentComponent implements OnInit, OnDestroy{

  private accountName='Accounts';
  private loggedIn = false;
  constructor(private recipeService:RecipeService, private authService:Auth) { }

  userSubscription:Subject<User>;
  ngOnInit() {
    this.userSubscription = this.authService.LoggedInUser;
    this.userSubscription.subscribe(user =>
      {
        if (user && user.token)
        {
          this.loggedIn = true;
          this.accountName = user.email;
        }
        else
        {
          this.loggedIn = false;
          this.accountName = 'Accounts';
        }
      });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
