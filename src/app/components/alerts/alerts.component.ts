import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  constructor(
    private toastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.apiError(false);
    this.betaTesting(false);
    this.registrationOpen(false);
 }

  apiError(bool: boolean){
    if(bool == true){
       this.toastService.error('There is currently a problem with the authorization API. <br/><b>AWE may not work as expected.<b>', {
        style: {
          width: '100%',
          textAlign: 'center',
        },
        theme: 'snackbar',
        position: 'top-center',
        autoClose: false,
        id: 'auth-api-error-8-13-2021',
        persist: { enabled: false, count: 1 },
      });
    }
  }

  betaTesting(bool: boolean){
    if(bool == true){
       this.toastService.info('<b>BETA TESTING UPDATE</b><br/>We are currently in the proccess of prepping AWE for beta testing.<br/><i>Stay Tuned!</i>', {
        style: {
          width: '100%',
          textAlign: 'center',
        },
        theme: 'snackbar',
        position: 'top-center',
        autoClose: false,
        id: 'beta-testing-8-11-2021',
        persist: { enabled: false, count: 1 },
      });
    }
  }

  registrationOpen(bool: boolean){
    if(bool == true){
       this.toastService.success('<b>REGISTRATION IS OPEN</b><br/>We have enabled registration!<br/>Feel free to create an account and have a look around AWE v2.<br/>We hope you enjoy it!', {
        style: {
          width: '100%',
          textAlign: 'center',
        },
        theme: 'snackbar',
        position: 'top-center',
        autoClose: false,
        id: 'beta-testing-8-11-2021',
        persist: { enabled: false, count: 1 },
      });
    }
  }

}
