import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmService } from '../confirm.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {
  @Input() inputData: any;

  ref: DynamicDialogRef | undefined;
  otpValue: string = '';
  userInput: string = '';

  constructor(public dialogService: DialogService, public messageService: MessageService, private confirmService: ConfirmService) {
    this.confirmService.setConfirmComponent(this);
  }

  confirm() {
    this.ref = this.dialogService.open(DynamicInputDialogComponent, {
      header: 'Verify your email ',
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
  <div *ngIf="showComponent">
    <div class="container  d-flex flex-column justify-content-center align-items-center">
      <div class="d-flex flex-column justify-content-center"> 
          <h4 style=" font-weight: bold; margin: 2px; ">Please enter the one-time password <br> to verify your account</h4> 
             <span class="my-2">A code has been sent to {{email}} <p *ngIf="remainingTime === 0" class="text-danger my-auto">Otp Expired</p></span>  
            
            <div>
            <ng-otp-input  (onInputChange)="onOtpChange($event)" [config]="{ length: 6 }"></ng-otp-input>
            </div>
          <div class="my-2 d-flex justify-content-between"> 
        <button   class="btn btn-danger validate" (click)="onValidate()">Validate</button> 
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
  <button pButton type="button" class="btn btn-primary"  (click)="toggleComponentVisibility()">Send Otp ?</button>
</div>
    `
})
export class DynamicInputDialogComponent {
  userInput: string = '';
  showResendButton: boolean = true;
  email: string = 'srbhgjbh@gmail.com'
  showComponent: boolean = false;
  enteredOTP: any;
  remainingTime: number = 10;
  countdownInterval: any;
  constructor(public ref: DynamicDialogRef) { }

  onConfirm() {
    this.ref.close(this.userInput);
  }
  onOtpChange(otpValue: any) {
    this.enteredOTP = otpValue;
  }
  resendOTP() {

    this.remainingTime = 120;
    this.startCountdown();
    this.showResendButton = false;

  }
  onValidate() {
    const expectedOTP = '123456';
    if (this.enteredOTP === expectedOTP) {

      this.ref.close('Validation Successful');
    } else {

      this.ref.close('Validation Failed');
    }
  }
  toggleComponentVisibility() {
    this.showComponent = !this.showComponent;
    if (this.showComponent) {
      this.startCountdown();
    } else {
      this.stopCountdown();
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