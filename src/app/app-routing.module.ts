import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DownloadComponent } from './download/download.component';
import { AuthGuard } from './auth.guard';
const routes: Routes = [
{ path: '', component: HomeComponent },
{ path: 'login', component: HomeComponent },
{ path: 'download', component: DownloadComponent },
{ path: 'manager', component: HomeComponent,canActivate:[AuthGuard] },
{ path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
