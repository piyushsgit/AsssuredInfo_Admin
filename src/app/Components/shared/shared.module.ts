import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 
import { NgOtpInputModule } from 'ng-otp-input';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmComponent, DynamicInputDialogComponent } from './confirm/confirm.component';



@NgModule({
  declarations: [
    ConfirmComponent,
    DynamicInputDialogComponent
  ],
  imports: [
    CommonModule,
    NgOtpInputModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[ConfirmComponent,DynamicInputDialogComponent]
  ,
  providers:[
    ConfirmComponent
  ]
})
export class SharedModule { }
