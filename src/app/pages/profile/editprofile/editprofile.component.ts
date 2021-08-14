import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { ProfileService } from 'src/app/services/profile.service';


@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss']
})
export class EditprofileComponent implements OnInit {
  authRequest: any = [];
  fetchedUserData: any = [];
  editUserForm: FormGroup;

  constructor(
    private formBuilder:FormBuilder,
    private profileApi: ProfileService,
    private toastService: HotToastService
  ) {
    this.editUserForm = this.formBuilder.group({
      uid: [],
      username: [{value: '', disabled: true}, Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      twitter: ['', Validators.required],
      instagram: ['', Validators.required],
      facebook: ['', Validators.required],
      linkedin: ['', Validators.required],
      youtube: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authRequest[0] = window.localStorage.getItem('jwt');
    this.authRequest[1] = window.localStorage.getItem('loggedUsername');
    if(this.authRequest[0] && this.authRequest[1]){
    this.profileApi.getMyProfile(this.authRequest).subscribe(res =>{
      this.fetchedUserData.username = res.username;
      this.fetchedUserData.image = res.image;
      this.editUserForm.patchValue(res);
    },
    err => {
      this.toastService.error('Unknown Error: ' + err);
    })
    }
  }

  onUpdate(){
       this.profileApi.editMyProfile([this.authRequest, this.editUserForm.getRawValue()]).subscribe(res => {
         if(res.code == 1){
           this.toastService.success(res.message);
           setTimeout(() => window.location.href = '/profile', 1500);
        }
        else{
          this.toastService.error(res.message);
        }
       },err => {
         this.toastService.error('Unknown Error: '+ err);
       })
     }
}