import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { ClientsComponent } from './pages/clients/clients.component';

const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'clients', component: ClientsComponent},
  { path: 'projects', component: ProjectsComponent},
  { path: 'tasks', component: TasksComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
