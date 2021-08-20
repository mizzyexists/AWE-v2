import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  fetchedActiveAlerts: any = [];
  constructor(
    private toastService: HotToastService,
    private adminApi: AdminService
  ) { }

  ngOnInit(): void {
    this.adminApi.adminGetActiveAlerts().subscribe(res => {
      this.fetchedActiveAlerts = res;
      this.getActiveAlerts(this.fetchedActiveAlerts);
    });
 }

 getActiveAlerts(alerts: any){
   var i = 1;
   if(alerts){
   for(let alert of alerts){
     alert.persist = Boolean(JSON.parse(alert.persist));
     alert.autoclose = Boolean(JSON.parse(alert.autoclose));
     if(alert.persist_id == '' || !alert.persist_id){
       alert.persist_id = 'no-id-' + i;
     }
       if(alert.type == 'show'){
         this.toastService.show(alert.message, {
          style: {
            width: '100%',
            textAlign: 'center',
          },
          theme: alert.theme,
          position: 'top-center',
          autoClose: alert.autoclose,
          id: alert.persist_id,
          persist: { enabled: alert.persist, count: alert.persist_count },
          });
        }
        else if(alert.type == 'info'){
          this.toastService.info(alert.message, {
           style: {
             width: '100%',
             textAlign: 'center',
           },
           theme: alert.theme,
           position: 'top-center',
           autoClose: alert.autoclose,
           id: alert.persist_id,
           persist: { enabled: alert.persist, count: alert.persist_count },
         });
       }
       else if(alert.type == 'success'){
         this.toastService.success(alert.message, {
          style: {
            width: '100%',
            textAlign: 'center',
          },
          theme: alert.theme,
          position: 'top-center',
          autoClose: alert.autoclose,
          id: alert.persist_id,
          persist: { enabled: alert.persist, count: alert.persist_count },
          });
        }
        else if(alert.type == 'warning'){
          this.toastService.warning(alert.message, {
           style: {
             width: '100%',
             textAlign: 'center',
           },
           theme: alert.theme,
           position: 'top-center',
           autoClose: alert.autoclose,
           id: alert.persist_id,
           persist: { enabled: alert.persist, count: alert.persist_count },
         });
       }
       else if(alert.type == 'error'){
         this.toastService.error(alert.message, {
          style: {
            width: '100%',
            textAlign: 'center',
          },
          theme: alert.theme,
          position: 'top-center',
          autoClose: alert.autoclose,
          id: alert.persist_id,
          persist: { enabled: alert.persist, count: alert.persist_count },
        });
      }
      else{
        this.toastService.show(alert.message, {
         style: {
           width: '100%',
           textAlign: 'center',
         },
         theme: alert.theme,
         position: 'top-center',
         autoClose: alert.autoclose,
         id: alert.persist_id,
         persist: { enabled: alert.persist, count: alert.persist_count },
       });
     }
     i = i + 1;
   }
  }
 }
}
