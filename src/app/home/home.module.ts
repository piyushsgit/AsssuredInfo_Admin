import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { HomeArticleComponent } from './home-article/home-article.component';
import { HomepollComponent } from './homepoll/homepoll.component';
import { AuthGuard } from '../Components/Guard/auth.guard';
 
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService } from 'primeng/dynamicdialog';
import { NgOtpInputModule } from 'ng-otp-input';
import { SharedModule } from '../Components/shared/shared.module';
 
 
@NgModule({
  declarations: [
    HomepageComponent,
    HomeArticleComponent,
    HomepollComponent,
    
  ],
  providers: [AuthGuard, MessageService, ConfirmationService,DialogService],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    NgOtpInputModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class HomeModule { }
