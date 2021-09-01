import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  authRequest: any = [];
  response: any;
  jwtUsername: any;
  hasInactiveAccount:any = null;
  @ViewChild('inactiveAccountModal') templateRef?: TemplateRef<any>;
  constructor(
    private toastService: HotToastService,
    private formBuilder:FormBuilder,
    private authApi: AuthService,
    private modalService: NgbModal
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
      this.modalService.dismissAll();
      if(this.response.code == 1 && this.response.jwt && this.response.username) {
        window.localStorage.setItem('jwt', this.response.jwt);
        window.localStorage.setItem('loggedUsername', this.response.username);
        this.toastService.loading(this.response.message);
        setTimeout(() => window.location.href = './', 1000);
      }
      else if(this.response.code == 2 && this.response.jwt && this.response.username){
        this.openInactiveModal();
        window.localStorage.setItem('inactiveuser', loginData.username);
      }
      else {
        window.localStorage.removeItem('jwt');
        window.localStorage.removeItem('loggedUsername');
        this.toastService.error(this.response.message);
      }
    }, err => {
      window.localStorage.removeItem('jwt');
      window.localStorage.removeItem('loggedUsername');
      this.toastService.error('Unknown Error: '+err);
    })
  }

  // Modal Service
  openInactiveModal() {
    this.modalService.open(this.templateRef, { centered: true, size: 'lg' });
  }

  cancelReactivation(){
    window.localStorage.removeItem('inactiveuser');
  }

  reactivateAccount(){
    this.authRequest[0] = 'INACTIVE: NO TOKEN';
    this.authRequest[1] = window.localStorage.getItem('inactiveuser');
    this.authApi.reactivateAccount(this.authRequest).subscribe(res => {
      if(res.code == 1){
        this.toastService.success(res.message);
        window.localStorage.removeItem('inactiveuser');
      }
      else{
        this.toastService.error(res.message);
        window.localStorage.removeItem('inactiveuser');
      }
    })
  }
}
