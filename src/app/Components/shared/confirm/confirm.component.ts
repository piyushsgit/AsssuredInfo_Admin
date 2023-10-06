import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmService } from '../confirm.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCallService } from '../../Services/api-call.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {
  @Input() inputData: any; 
  ref: DynamicDialogRef | undefined;
  headerText: string = '';
  showlogin:boolean=true;

  otpValue: string = '';
  userInput: string = '';
  constructor(public dialogService: DialogService, public messageService: MessageService, private confirmService: ConfirmService, private router: ActivatedRoute) {
    this.confirmService.setConfirmComponent(this);
  } 
  confirm(page:string) {
    if (page=='login') {
      this.headerText = 'Verify your email';
      this.showlogin =false

    } else {
      this.headerText = 'Please enter your email';
    }
    this.ref = this.dialogService.open(DynamicInputDialogComponent, {
      header: this.headerText,
      width: '30%',
      baseZIndex: 10000,
      contentStyle: { overflow: 'auto' }
    });

    this.ref.onClose.subscribe((result: string) => {
      if (result) {
        this.messageService.add({ severity: 'info', summary: 'Input Received', detail: result });
      }
    });
  }
}
@Component({
  selector: 'app-dynamic-input-dialog',
  template: `
      <div>
      <form [formGroup]="form" class="my-3" *ngIf="!showComponent" >
  <input type="email" formControlName="email" class="form-control" />
  <div *ngIf="form.get('email')?.invalid && (form.get('email')?.dirty || form.get('email')?.touched)">
  <p class="text-danger"> 
    Please enter a valid email address.
  </p> 
  </div>
</form>
  <div *ngIf="showComponent">
    <div class="container  d-flex flex-column justify-content-center align-items-center">
      <div class="d-flex flex-column justify-content-center"> 
          <h4 style=" font-weight: bold; margin: 2px; ">Please enter the one-time password <br> to verify your account</h4>  
             <span class="my-2">A code has been sent to {{form.value.email}} <p *ngIf="remainingTime === 0" class="text-danger my-auto">Otp Expired</p></span>   
            <div>
            <ng-otp-input  (onInputChange)="onOtpChange($event)" [config]="{ length: 6 }"></ng-otp-input>
            <div *ngIf="showerror"><p class="text-danger">The Entered Otp is not valid</p></div>
            </div>
          <div class="my-2 d-flex justify-content-between"> 
        <button  *ngIf="remainingTime !== 0"  class="btn btn-danger validate" (click)="onValidate()">Validate</button> 
        <div *ngIf="showComponent && remainingTime === 0" class="d-flex gap-2">
          
                <button pButton type="button" class="btn btn-primary" (click)="resendOTP()">Resend Otp ?</button>
              </div>
          <div class="countdown-timer" *ngIf="remainingTime !== 0">
      OTP expires in: {{ remainingTime }} Seconds
    </div>
  </div>
    </div> 
</div>
</div>
</div> 
<div *ngIf="!showComponent">
  <button pButton type="button" class="btn btn-primary"  (click)="toggleComponentVisibility(1)">Send Otp ?</button>
</div>
    `
})
export class DynamicInputDialogComponent {
  userInput: string = '';
  form: FormGroup;
  otp:any;
  showerror:boolean= false;
  showResendButton: boolean = true; 
  showComponent: boolean = false;
  enteredOTP: any;
 
  remainingTime: number = 5;
  countdownInterval: any;
  constructor(public ref: DynamicDialogRef,private fb: FormBuilder,private apiservice :ApiCallService) {
     this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onConfirm() {
    this.ref.close(this.userInput);
  }
  onOtpChange(otpValue: any) {
    this.enteredOTP = otpValue;
  }
  resendOTP() { 
    this.remainingTime = 15;
    this.startCountdown();
    this.toggleComponentVisibility(0);
    this.showResendButton = false; 
  }
  onValidate() {
    const obj={
      email:this.form.value.email,
      otp: this.enteredOTP,
      type:false
    }
    console.log(obj);
    
    this.apiservice.OtpVerification(obj).subscribe({
      next:(response:any)=>{  
        if(response.success){
          this.ref.close('Validation Successful'); }
        else
         {
          this.showerror=true;
         } 
      }
    }) 
  }
  toggleComponentVisibility(resent:number) {
    this.form.markAllAsTouched();
    if(this.form.valid){
      const obj={
        email:this.form.value.email,
        type:false
      } 
      this.apiservice.EmailVerification(obj).subscribe({
        next:(response)=>{ 
          console.log(response);
          this.otp = response;
        }
      })
   if(resent==1){
    this.showComponent=!this.showComponent;
   }
    if (this.showComponent) {
      this.startCountdown();
    } else {
      this.stopCountdown();
    }
  }
  }
  startCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.remainingTime > 0) { 
        this.remainingTime--;
      } else {
        this.stopCountdown();
      }
    }, 1000);
  }

  stopCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}