import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule,HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ToastComponent } from './toast/toast.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { MyService } from './my.service';
import { AuthGuard } from './auth.guard';
import { AuthInterceptor } from './auth.interceptor';
import { DownloadComponent } from './download/download.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ToastComponent,
    DownloadComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    FormsModule,
    FilterPipeModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [MyService,AuthGuard,
  
    {
     provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
