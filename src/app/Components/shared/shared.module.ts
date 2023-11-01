import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 
import { NgOtpInputModule } from 'ng-otp-input';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmComponent, DynamicInputDialogComponent } from './confirm/confirm.component';
import { HomeArticleComponent } from 'src/app/home/home-article/home-article.component';
import { CommentComponent } from 'src/app/home/comment/comment.component';
import { SidebarModule } from 'primeng/sidebar';



@NgModule({
  declarations: [
    ConfirmComponent,
    DynamicInputDialogComponent,
    HomeArticleComponent,
    CommentComponent,
  ],
  imports: [
    CommonModule,
    NgOtpInputModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule
    
  ],
  exports:[ConfirmComponent,DynamicInputDialogComponent,HomeArticleComponent,CommentComponent]
  ,
  providers:[
    ConfirmComponent
  ]
})
export class SharedModule { }
