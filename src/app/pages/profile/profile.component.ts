import { Component, OnInit } from '@angular/core';
import { faFacebook, faInstagram, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { HotToastService } from '@ngneat/hot-toast';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  authRequest: any = [];
  fetchedUserData: any = [];
  faTwitter = faTwitter;
  faInsta = faInstagram;
  faFacebook = faFacebook;
  faLinkedIn = faLinkedin;
  faYoutube = faYoutube;
  constructor(
    private profileApi: ProfileService,
    private toastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.authRequest[0] = window.localStorage.getItem('jwt');
    this.authRequest[1] = window.localStorage.getItem('loggedUsername');
    if(this.authRequest[0] && this.authRequest[1]){
    this.profileApi.getMyProfile(this.authRequest).subscribe(res =>{
      this.fetchedUserData.username = res.username;
      this.fetchedUserData.email = res.email;
      this.fetchedUserData.role = res.role;
      this.fetchedUserData.image = res.image;
      this.fetchedUserData.phone = res.phone;
      this.fetchedUserData.fname = res.fname;
      this.fetchedUserData.lname = res.lname;
      this.fetchedUserData.street = res.street;
      this.fetchedUserData.city = res.city;
      this.fetchedUserData.state = res.state;
      this.fetchedUserData.country = res.country;
      this.fetchedUserData.twitter = res.twitter;
      this.fetchedUserData.instagram = res.instagram;
      this.fetchedUserData.facebook = res.facebook;
      this.fetchedUserData.linkedin = res.linkedin;
      this.fetchedUserData.youtube = res.youtube;
    },
    err => {
      this.toastService.error('Unknown Error: ' + err);
    })
    }
    console.log(this.fetchedUserData);
  }

}
