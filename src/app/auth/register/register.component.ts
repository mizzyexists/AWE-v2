import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { RecaptchaService } from '../../../services/recaptcha.service';
import { AuthService } from '../../services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  recaptcha: any;
  captchaGRes: any;
  responseData: any;
  openRegistration: any;
  constructor(
    private formBuilder:FormBuilder,
    private authApi: AuthService,
    private toastService: HotToastService,
    private appApi: AppService
  )
  {
    this.registerForm = this.formBuilder.group({
      uid: [],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
    });
    this.appApi.getAppSettings().subscribe(res => {
      this.openRegistration = res[1]['setting_value'];
    }, err =>{
      console.log(err);
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
            this.authApi.login(loginData).subscribe(res => {
              if(res.code == 1 && res.jwt && res.username) {
                window.localStorage.setItem('jwt', res.jwt);
                window.localStorage.setItem('loggedUsername', res.username);
                this.toastService.loading(res.message);
                setTimeout(() => window.location.href = './', 1000);
              }
              else {
                window.localStorage.removeItem('jwt');
                window.localStorage.removeItem('loggedUsername');
                this.toastService.error(res.message);
              }
            }, err => {
              window.localStorage.removeItem('jwt');
              window.localStorage.removeItem('loggedUsername');
              this.toastService.error('Unknown Error: '+err);
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
            default: {
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
    }
  }
}
