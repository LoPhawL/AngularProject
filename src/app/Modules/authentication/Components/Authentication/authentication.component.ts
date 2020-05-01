import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Auth } from 'src/app/ServiceDependencies/Auth.Service';
import { Subject } from 'rxjs';
import { User } from 'src/app/Models/User.model';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  private error = false;
  private errorTitle:string;
  private errorMessage:string;

  private mode:string;
  private authForm;
  private cnfPwdArr;
  public LoggedIn = new Subject<User>();
  private disabledText:string;


  private disableForm = false;
  constructor(private activeRoute:ActivatedRoute, private router:Router, private authService:Auth)
  {
    this.authForm = new FormGroup(
      {
        'email':new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null,[Validators.required, Validators.minLength(6)]),
        'cnfPwdArray':new FormArray([])
      });
    this.activeRoute.params.subscribe(
      params =>
      {
        if(this.mode != params['mode'])
        {
          const email = this.authForm.get('email').value;
          const password = this.authForm.get('password').value;
          this.authForm.reset();
          this.authForm.patchValue({'email':email,'password':password});
          this.mode =  params['mode'];
          if(this.mode == 'SignUp' && (<FormArray>this.authForm.get('cnfPwdArray')).controls.length < 1 )
          {
            const cnfrmPassword = new FormControl(null,[Validators.required,Validators.minLength(6),this.Validator_ConfirmPassword.bind(this)]);
            this.authForm.get('cnfPwdArray').push(cnfrmPassword);
            this.cnfPwdArr = (<FormArray>this.authForm.get('cnfPwdArray')).controls;
          }
        }
      });
  }

  ngOnInit() {
    this.authService.AutoLogin();
  }

  ShowError(errorTitle, errorMessage)
  {
    this.errorTitle = errorTitle;
    this.errorMessage = errorMessage;
    this.error = true;
    setTimeout(() => {
      this.error = false;
      this.errorTitle = null;
      this.errorMessage = null;
    }, 2000);
  }

  SubmitForm()
  {
    // if(this.authForm.valid)
    // {
      let authSubs = null;
      if(this.mode == 'SignUp')
      {
        if(!this.authForm.valid){return;}
        authSubs = this.authService.SignUp(this.authForm.get('email').value,this.authForm.get('password').value);
        this.disabledText = 'Signing you up...';
      }
      else
      {
        if(!(this.authForm.get('email').valid && this.authForm.get('password')).valid ){return;}
        authSubs = this.authService.LogIn(this.authForm.get('email').value,this.authForm.get('password').value);
        this.disabledText = 'Logging you in...';
      }
      this.disableForm = true;
      authSubs.subscribe
        (
          response =>
          {
            this.authForm.reset();
            this.disableForm = false;
            const user = new User(
                                    response.localId,
                                    response.email,
                                    response.idToken,
                                    new Date(new Date().getTime() + (+response.expiresIn * 1000)-60000),
                                    response.refreshToken,
                                    0);
            this.authService.user = user;
            localStorage.setItem('loggedInUser',JSON.stringify(user));
            this.authService.AutoLogout(3600000-60000);
            this.router.navigate(['Recipes']);
          },
          errorDetails =>
          {
            this.disableForm = false;
            this.ShowError(errorDetails[0],errorDetails[1]);
          }
        );
    // }
  }

  Validator_ConfirmPassword(control:FormControl){
    const pwd = (<FormControl>this.authForm.get('password')).value;
    if ( pwd == null || pwd == '')
    {
      return null;
    }
    if(control.value != (<FormControl>this.authForm.get('password')).value)
    {
      return {notMatching:true}
    }
    return null;
  }
}
