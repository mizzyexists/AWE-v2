import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { AdminService } from 'src/app/services/admin.service';


@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {
  createAlertForm!: FormGroup;
  alertRequest: any;
  authRequest: any = [];
  authAlertRequest: any;

  constructor(
    private modalService: NgbModal,
    private toastService: HotToastService,
    private formBuilder:FormBuilder,
    private adminApi: AdminService
  ) {
    this.prepareAlertForm();
  }

  ngOnInit(): void {
    // Get Auth Data
    this.authRequest[0] = window.localStorage.getItem('jwt');
    this.authRequest[1] = window.localStorage.getItem('loggedUsername');
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
