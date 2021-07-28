import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TopbarComponent,
    ProjectsComponent,
    ClientsComponent,
    TasksComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
    HotToastModule.forRoot(
         {
           position: 'top-right',
           dismissible: true,
           duration: 5000
         }
       )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
