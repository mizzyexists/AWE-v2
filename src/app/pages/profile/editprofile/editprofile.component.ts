import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';


@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss']
})
export class EditprofileComponent implements OnInit {
  authRequest: any = [];
  fetchedUserData: any = [];
  deleteConfirm: any;
  editUserForm: FormGroup;

  constructor(
    private formBuilder:FormBuilder,
    private profileApi: ProfileService,
    private authApi: AuthService,
    private toastService: HotToastService,
    private modalService: NgbModal
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

 // Modal Service
 open(content: any) {
   this.modalService.open(content, { centered: true, size: 'lg' });
 }

 deleteAccount(deleteConfirm: any){
   if(deleteConfirm == "DELETE"){
     this.toastService.warning("Account has been deleted");
   }
   else{
     this.toastService.error("Confirmation was entered incorrectly");
   }
 }

 deactivateAccount(){
   this.authApi.deactivateAccount(this.authRequest).subscribe(res => {
     if(res.code == 1){
       this.toastService.loading("Deactivating Account...");
       window.localStorage.removeItem('jwt');
       window.localStorage.removeItem('loggedUsername');
       setTimeout(() => window.location.href = '/', 2500);
     }
     else{
       this.toastService.error(res.message);
     }
   }, err => {
     this.toastService.error("An unknown error occured");
   })
 }


}
