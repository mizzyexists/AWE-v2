import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { AdminService } from 'src/app/services/admin.service';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';


@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {
  createAlertForm!: FormGroup;
  editAlertForm!: FormGroup;
  createNotiForm!: FormGroup;
  updateAppForm!: FormGroup;
  alertRequest: any;
  notificationRequest: any;
  authNotificationRequest: any;
  authRequest: any = [];
  authAppRequest: any = [];
  authAlertRequest: any;
  fetchedActiveAlerts: any = [];
  alertsLoading: any;
  proccessedAppSettings: any = [];
  fetchedAppSettings: any = [];
  appSettingsRequest: any = [];

  constructor(
    private modalService: NgbModal,
    private toastService: HotToastService,
    private formBuilder:FormBuilder,
    private adminApi: AdminService,
    private profileApi: ProfileService,
    private appApi: AppService,
    private router: Router,
    private authApi: AuthService
  ) {
    this.prepareNotiForm();
    this.prepareAlertForm();
    this.getAppSettingsForm();
    this.getActiveAlerts();
    // Get Auth Data
    this.authRequest[0] = window.localStorage.getItem('jwt');
    this.authRequest[1] = window.localStorage.getItem('loggedUsername');
  }

  ngOnInit(): void {

  }

  // Modal service
  open(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  // "Create Alert" Form Builder
  prepareAlertForm(){
    this.createAlertForm = this.formBuilder.group({
      alertMessage: ['', Validators.required],
      alertType: ['show', Validators.required],
      alertTheme: ['toast', Validators.required],
      alertAutoclose: [true, Validators.required],
      alertPersist: [false, Validators.required],
      persistID: [null, Validators.required],
      persistCount: [0, Validators.required]
    });
  }

  // "Create Notifcation" Form Builder
  prepareNotiForm(){
    this.createNotiForm = this.formBuilder.group({
      notiTarget: ['', Validators.required],
      notiTitle: ['', Validators.required],
      notiBody: ['', Validators.required],
      notiSlug: ['/', Validators.required]
    });
  }

  // 'App Settings' Form Builder
  getAppSettingsForm(){
    this.appApi.getAppSettings().subscribe(res => {
      this.fetchedAppSettings = res;
      let i = 0;
      let proccessedAppSettings:any = [];
      for(proccessedAppSettings of this.fetchedAppSettings){
        this.proccessedAppSettings[i] = proccessedAppSettings;
        if(this.proccessedAppSettings[i]['setting_value'] == 'true' || this.proccessedAppSettings[i]['setting_value'] == true){
          this.proccessedAppSettings[i]['setting_value'] = true;
        }else{
          this.proccessedAppSettings[i]['setting_value'] = false;
        }
        i++;
      }
      this.updateAppForm = this.formBuilder.group({
        maintenanceMode: [this.proccessedAppSettings[0]['setting_value'], Validators.required],
        allowRegistration: [this.proccessedAppSettings[1]['setting_value'], Validators.required],
        notificationPolling: [this.proccessedAppSettings[2]['setting_value'], Validators.required]
      });
    }, err =>{
      console.log(err);
    });
  }

  // Get form data and submit to update application settings
  updateAppSubmit(){
    this.appSettingsRequest = {
      setMaintenanceMode: this.updateAppForm.controls.maintenanceMode.value,
      setAllowRegistration: this.updateAppForm.controls.allowRegistration.value,
      setNotificationPolling: this.updateAppForm.controls.notificationPolling.value
    };
      this.authAppRequest = [this.authRequest, this.appSettingsRequest];
      this.appApi.updateAppSettings(this.authAppRequest).subscribe(res => {
        if(res.code == 1){
          this.toastService.success(res.message);
          this.getAppSettingsForm();
        }else{
          this.toastService.error(res.message);
          this.getAppSettingsForm();
        }
      },err => {
        this.toastService.error("An unknown error occured");
      })
  }


  // Get form data and submit to generate global application alert
  createAlertSubmit(){
    this.alertRequest = {
      message: this.createAlertForm.controls.alertMessage.value,
      type: this.createAlertForm.controls.alertType.value,
      theme: this.createAlertForm.controls.alertTheme.value,
      autoclose: this.createAlertForm.controls.alertAutoclose.value,
      persist: this.createAlertForm.controls.alertPersist.value,
      persistID: this.createAlertForm.controls.persistID.value,
      persistCount: this.createAlertForm.controls.persistCount.value
    };
    if(this.alertRequest.message != ''){
      this.authAlertRequest = [this.authRequest, this.alertRequest];
      this.adminApi.adminCreateAlert(this.authAlertRequest).subscribe(res => {
        if(res.code == 1){
          this.toastService.success(res.message);
          this.prepareAlertForm();
          this.getActiveAlerts();
          var date = new Date().toLocaleString();
          this.profileApi.generateNotification(this.authRequest[0], this.authRequest[1], "mizzy", '⚠️ Alert Created', "There was a new global alert created by "+this.authRequest[1]+" at "+date, "/admin-menu").subscribe();
        }
        else{
          this.toastService.error(res.message);
        }
      });
    }else{
      this.toastService.error('No alert message entered.');
    }
  }

  getActiveAlerts(){
    this.alertsLoading = true;
    this.adminApi.adminGetActiveAlerts().subscribe(res => {
      this.fetchedActiveAlerts = res;
      if(this.fetchedActiveAlerts == null){
        this.fetchedActiveAlerts = [];
        this.alertsLoading = false;
      }
    })
  }

  // Edit selected Alert
  updateAlertForm(alert_id: any, type: any, message: any, theme: any, persist: any, persist_id: any, persist_count: any, autoclose: any){
    if(autoclose == 'true'){
      autoclose = true;
    }else{
      autoclose = false;
    }
    if(persist == 'true'){
      persist = true;
    }else{
      persist = false;
    }
    this.editAlertForm = this.formBuilder.group({
      alertID: [alert_id, Validators.required],
      alertMessage: [message, Validators.required],
      alertType: [type, Validators.required],
      alertTheme: [theme, Validators.required],
      alertAutoclose: [autoclose, Validators.required],
      alertPersist: [persist, Validators.required],
      persistID: [persist_id, Validators.required],
      persistCount: [persist_count, Validators.required]
    });
  }

  // Get form data and submit to edit selected global application alert
  editAlertSubmit(){
    this.alertRequest = {
      alertID: this.editAlertForm.controls.alertID.value,
      message: this.editAlertForm.controls.alertMessage.value,
      type: this.editAlertForm.controls.alertType.value,
      theme: this.editAlertForm.controls.alertTheme.value,
      autoclose: this.editAlertForm.controls.alertAutoclose.value,
      persist: this.editAlertForm.controls.alertPersist.value,
      persistID: this.editAlertForm.controls.persistID.value,
      persistCount: this.editAlertForm.controls.persistCount.value
    };
    if(this.alertRequest.message != ''){
      this.authAlertRequest = [this.authRequest, this.alertRequest];
      this.adminApi.adminEditAlert(this.authAlertRequest).subscribe(res => {
        if(res.code == 1){
          this.toastService.success(res.message);
          this.editAlertForm.reset();
          this.getActiveAlerts();
          var date = new Date().toLocaleString();
          this.profileApi.generateNotification(this.authRequest[0], this.authRequest[1], "mizzy", 'ℹ️ Alert Edited', "Alert ID: "+this.alertRequest.alertID+" was edited by "+this.authRequest[1]+" on "+date, "/admin-menu").subscribe();
        }
        else{
          this.toastService.error(res.message);
        }
      });
    }else{
      this.toastService.error('No alert message entered.');
    }
  }

  deleteAlert(alert_id: any){
    this.alertRequest = {
      alertID: alert_id
    };
    if(this.alertRequest.alertID != ''){
      this.authAlertRequest = [this.authRequest, this.alertRequest];
      this.adminApi.adminRemoveAlert(this.authAlertRequest).subscribe(res => {
        if(res.code == 1){
          this.toastService.success(res.message);
          this.getActiveAlerts();
          if(this.fetchedActiveAlerts[0]){
            this.fetchedActiveAlerts = [];
          }
          var date = new Date().toLocaleString();
          this.profileApi.generateNotification(this.authRequest[0], this.authRequest[1], "mizzy", '❌ Alert Deleted', "Alert ID: "+this.alertRequest.alertID+" was deleted by "+this.authRequest[1]+" on "+date, "/admin-menu").subscribe();
        }
        else{
          this.toastService.error(res.message);
        }
      });
    }else{
      this.toastService.error('No alert message entered.');
    }
  }

  createNotiSubmit(){
    this.notificationRequest = {
      target: this.createNotiForm.controls.notiTarget.value,
      title: this.createNotiForm.controls.notiTitle.value,
      message: this.createNotiForm.controls.notiBody.value,
      slug: this.createNotiForm.controls.notiSlug.value
    };
    if(this.notificationRequest.message != ''){
      this.authNotificationRequest = [this.authRequest, this.notificationRequest];
      this.profileApi.createNoti(this.authNotificationRequest).subscribe(res => {
        if(res.code == 1){
          this.toastService.success(res.message);
          this.prepareNotiForm();
        }
        else{
          this.toastService.error(res.message);
        }
      });
    }else{
      this.toastService.error('No alert message entered.');
    }
  }

}
