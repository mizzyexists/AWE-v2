import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthData } from 'src/app/models/authdata';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message: any;
  authToken: any;
  authCheck: any;
  loggedUser: string | undefined;
  usertype: string | undefined;
  jwtData: any;
  response: any;
  jwtUsername: any;
  constructor(
    private toastService: HotToastService,
    private formBuilder:FormBuilder,
    private authApi: AuthService,
    private router: Router,
    private titleService: Title
  ){}
  ngOnInit() {
    this.authToken = window.localStorage.getItem('jwt');
    this.authApi.authorize(this.authToken).subscribe((res: any) => {
      this.authCheck = res;
      if(this.authCheck && this.authCheck[0]==true){
        this.jwtData = this.authCheck[1];
        this.jwtUsername = this.jwtData.data.username;
        window.location.href = './'
      };
    });
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required]
    });
  }

  onSubmit(){
    if(this.loginForm.invalid){
      return;
    }
    const loginData = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    };
    this.authApi.login(loginData).subscribe(res => {
      this.response = res;
      if(this.response.jwt && this.response.username) {
        window.localStorage.setItem('jwt', this.response.jwt);
        window.localStorage.setItem('loggedUsername', this.response.username);
        this.toastService.success(this.response.message);
        setTimeout(() => window.location.href = './', 500);
      }
      else {
        this.toastService.error(this.response.message);
      }
    })
  }
}
