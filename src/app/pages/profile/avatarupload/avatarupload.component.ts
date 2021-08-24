import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-avatarupload',
  templateUrl: './avatarupload.component.html',
  styleUrls: ['./avatarupload.component.scss']
})
export class AvataruploadComponent implements OnInit {
  authRequest: any = [];
  fetchedUserData: any = [];
  uploadAvatarForm: FormGroup;
  uploadedAvatar: any;
  uploadResponse: any;
  file: any = '';
  authAvatarRequest: any = [];
  faUpload = faUpload;

  constructor(
    private formBuilder:FormBuilder,
    private profileApi: ProfileService,
    private authApi: AuthService,
    private toastService: HotToastService
  ) {
    this.uploadAvatarForm = this.formBuilder.group({
      avatar: [''],
    });
  }

  ngOnInit(): void {
    // Get Auth Data
    this.authRequest[0] = window.localStorage.getItem('jwt');
    this.authRequest[1] = window.localStorage.getItem('loggedUsername');
  }

  onFileSelect(event: any) {
     if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.uploadAvatarForm.get('avatar')!.setValue(this.file);
    }
  }

  submitAvatar(){
    const formData = new FormData();
    formData.append('avatar', this.uploadAvatarForm.get('avatar')!.value);
    this.authApi.authenticateUser(this.authRequest).subscribe(res => {
      this.uploadResponse = res;
      if(this.uploadResponse == true){
        this.profileApi.uploadAvatar(formData).subscribe(res => {
          if(res.code == 1){
            this.authAvatarRequest = [this.authRequest, res.url];
            this.profileApi.setAvatar(this.authAvatarRequest).subscribe(res => {
              if(res.code == 1){
                this.toastService.success(res.message);
                setTimeout(() => window.location.href = '/profile', 1500);
              }else{
                this.toastService.error(res.message);
              }
            }, err => {
              this.toastService.error("An unknown error occured");
              console.log(err);
            })
          }
          else{
            this.toastService.error(res.message);
          }
        }, err => {
          this.toastService.error("An unknown error occured");
          console.log(err);
        })
      }
      else{

      }
    });
  }
}
