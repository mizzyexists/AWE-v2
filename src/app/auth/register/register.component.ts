import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthData } from 'src/app/models/authdata';
// import { RecaptchaService } from '../../../services/recaptcha.service';
import { AuthService } from '../../services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  authCheck: AuthData | undefined;
  recaptcha: any;
  captchaGRes: any;
  responseData: any;
  constructor(
    private formBuilder:FormBuilder,
    private authApi: AuthService,
    private toastService: HotToastService
  )
  {
    this.registerForm = this.formBuilder.group({
      uid: [],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  onSubmit(){
    this.captchaGRes = window.localStorage.getItem('captchaRes');
    if(!this.registerForm.value.username){
      this.toastService.error('No Username');
    }
    if(!this.registerForm.value.email){
      this.toastService.error('No Email');
    }
    if(!this.registerForm.value.password){
      this.toastService.error('No Password');
    }
    if(this.registerForm.value.password && this.registerForm.value.password.length<=5){
      this.toastService.error('Password must be longer than 5 characters');
    }
    // if(!this.captchaGRes || this.captchaGRes!='1'){
    //   this.toastService.error('ReCaptcha Invalid');
    // }
    if(this.registerForm.value.username && this.registerForm.value.email && this.registerForm.value.password && this.registerForm.value.password2 && this.registerForm.value.password.length>=6){
      if(this.registerForm.value.password == this.registerForm.value.password2){
        this.authApi.register(this.registerForm.value).subscribe((data)=>{
          this.responseData = data;
          switch(this.responseData.code){
            case 1: {
            const loginData = {username: this.registerForm.value.username, password: this.registerForm.value.password};
            this.authApi.login(loginData).subscribe((data: any) => {
              if(data.code==1 && data.jwt) {
                window.localStorage.setItem('jwt', data.jwt);
                this.registerForm.reset();
                // window.localStorage.removeItem('captchaRes');
                setTimeout(() => window.location.href = './', 500);
              }
              else{
                this.toastService.error('An Error Occured');
              }
              })
              break;
            }
            case 998: {
              this.toastService.error('User Already Exists');
              break;
            }
            case 999: {
              this.toastService.error('An Unknown Error Occured');
              break;
            }
          }
        });
      }
      else{
        this.toastService.warning('Passwords do not match');
      }
    }
    else{
      this.toastService.error('An Error Occured');
    }
  }
}
