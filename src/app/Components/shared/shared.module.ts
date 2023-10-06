import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent, DynamicInputDialogComponent } from './confirm/confirm.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';



@NgModule({
  declarations: [
    ConfirmComponent,
    DynamicInputDialogComponent
  ],
  imports: [
    CommonModule,
    NgOtpInputModule,
    ConfirmDialogModule,
    ToastModule
  ],
  exports:[ConfirmComponent,DynamicInputDialogComponent]
  ,
  providers:[
    ConfirmComponent
  ]
})
export class SharedModule { }
