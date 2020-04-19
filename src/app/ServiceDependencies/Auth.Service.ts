import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../TypeDefinitions/SignUpResponse.iType';
import {catchError} from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { User } from '../Models/User.model';
import { Router } from '@angular/router';

@Injectable()
export class Auth
{

    private _user:User;
    public LoggedInUser = new Subject<User>();
    set user(user:User)
    {
        this._user = user;
        this.LoggedInUser.next(this._user);
    }

    isLoggedIn():boolean
    {
      return !!this._user;
    }
    constructor(private http:HttpClient, private router:Router){}

    GetUserToken()
    {
      if(!this._user)
      {localStorage.removeItem('loggedInUser');return null;}
      const token = this._user.token;
      if (token){return token;}
      // this.LogOut();
      return null;
    }

    SignUp(email,password)
    {
        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCuPFtWEySlJoXrtP9yPe8FovriULgJGNg',
            {email:email,password:password,returnSecureToken:true})
            .pipe(catchError(errorResponse =>
                {
                    let errorTitle = 'Unknown error.';
                    let errorMessage = 'An unexpected error occurred.';

                    if(!(errorResponse.error && errorResponse.error.error)){return throwError([errorTitle,errorMessage]);}

                    if(errorResponse.error.error.message == 'EMAIL_EXISTS')
                    {
                        errorTitle = 'Duplicate email';
                        errorMessage = 'The entered email id is already registered.';
                    }

                    else if(errorResponse.error.error.message == 'INVALID_EMAIL')
                    {
                        errorTitle = 'Invalid email';
                        errorMessage = 'The entered email id is invalid.';
                    }
                    return throwError([errorTitle,errorMessage]);
                }));
    }

    LogIn(email,password)
    {
        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCuPFtWEySlJoXrtP9yPe8FovriULgJGNg',
            {email:email,password:password,returnSecureToken:true})
            .pipe(catchError(errorResponse =>
                {
                    let errorTitle = 'Unknown error.';
                    let errorMessage = 'An unexpected error occurred.';

                    if(!(errorResponse.error && errorResponse.error.error)){return throwError([errorTitle,errorMessage])}

                    if(errorResponse.error.error.message == 'INVALID_PASSWORD')
                    {
                        errorTitle = 'Wrong password';
                        errorMessage = 'The password entered is incorrect.';
                    }
                    else if(errorResponse.error.error.message == 'EMAIL_NOT_FOUND')
                    {
                        errorTitle = 'Invalid email';
                        errorMessage = 'The email entered is invalid or incorrect.';
                    }
                    return throwError([errorTitle,errorMessage]);
                }));
    }

    LogOut()
    {
      localStorage.removeItem('loggedInUser');
      this.user = null;
      this.router.navigate(['Auth/Login']);
    }

    AutoLogin()
    {
      const userDetails = localStorage.getItem('loggedInUser');
      if(!userDetails)
        {return;}
      const userRep:{id:string,email:string,_token:string,_expiresBy:string,_refreshToken:string,renewalCount:number} = JSON.parse(userDetails);
      // console.log(new Date(userRep._expiresBy).getTime() - new Date().getTime() );

      if( new Date() > new Date(userRep._expiresBy))
      // if( new Date(userRep._expiresBy).getTime() - new Date().getTime() < 3590000)
      {
        console.log('idle time exceeded, logging out.');
        this.LogOut();
        return;
      }
      this.user = new User(userRep.id,userRep.email,userRep._token,new Date(userRep._expiresBy),userRep._refreshToken,userRep.renewalCount);
      this.AutoLogout(new Date(userRep._expiresBy).getTime() - new Date().getTime());
      this.router.navigate(['Recipes']);
    }

    AutoLogout(expMlSec:number)
    {
      setTimeout(() => {
        // this.LogOut();
        this.AutoRenew();
      },expMlSec// expMlSec
      );
    }

    AutoRenew()
    {
      const userDetails = localStorage.getItem('loggedInUser');
      if(!userDetails )
        {this.LogOut();return;}
      const userRep:{id:string,email:string,_token:string,_expiresBy:string,_refreshToken:string,renewalCount:number} = JSON.parse(userDetails);
      // if(userRep.renewalCount == 10)
      // {
      //   console.log('renewal count exceeded 10, logged out.');
      //   this.LogOut();
      //   return;
      // }

      this.http.post<{expires_in:string,token_type:string,refresh_token:string,id_token:string,user_id:string,project_id:string}>
        ('https://securetoken.googleapis.com/v1/token?key=AIzaSyCuPFtWEySlJoXrtP9yPe8FovriULgJGNg',
          {grant_type:'refresh_token',refresh_token: userRep._refreshToken}).subscribe
            (
              grant =>
              {
                const localId = userRep.id;
                const locEmail = userRep.email;
                if( (localId && locEmail) && localId == grant.user_id)
                {
                  const expBy = new Date(new Date().getTime() + (+grant.expires_in * 1000)-60000);
                  this.user = new User
                  (
                    grant.user_id,
                    locEmail,
                    grant.id_token,
                    expBy,
                    grant.refresh_token,
                    userRep.renewalCount+1,
                  );
                  // localStorage.setItem('loggedInUser',JSON.stringify({id:localId,email:locEmail,_token:grant.id_token,_expiresBy:expBy,_refreshToken:grant.refresh_token}));
                  localStorage.setItem('loggedInUser',JSON.stringify(this._user));
                  // console.log('renewed' , this._user.renewalCount);
                  this.AutoLogout(3600000-60000);
                }
                else{this.LogOut();}
              },
              error =>
              {
                this.LogOut();
              }
            );
          }
    }
