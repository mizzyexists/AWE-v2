import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { IsLoggedGuard } from './guards/is-logged.guard';

const routes: Routes = [
  { path: '', component: DashboardComponent, data: {title: 'Dashboard'}},
  { path: 'clients', component: ClientsComponent, data: {title: 'Clients'}, canActivate: [IsLoggedGuard]},
  { path: 'projects', component: ProjectsComponent, data: {title: 'Projects'}, canActivate: [IsLoggedGuard]},
  { path: 'tasks', component: TasksComponent, data: {title: 'Tasks'}, canActivate: [IsLoggedGuard]},
  { path: 'profile', component: ProfileComponent, data: {title: 'Profile'}, canActivate: [IsLoggedGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
