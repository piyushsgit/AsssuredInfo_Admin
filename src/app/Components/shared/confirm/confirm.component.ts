import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmService } from '../confirm.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCallService } from '../../Services/api-call.service';


@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})


export class ConfirmComponent {
  
  EmailrequestType: any;
  ref: DynamicDialogRef | undefined;
  headerText: string = '';
  showlogin: boolean = true;
  otpValue: string = '';
  userInput: string = '';

  ishomepage = false;
  request: any;
  constructor(public dialogService: DialogService, public messageService: MessageService, private confirmService: ConfirmService) {

    this.confirmService.setConfirmComponent(this);
  }


  confirm(page: string, req: number) {
    this.request = req
    if (page == 'home') {
      this.headerText = 'Verify your email';
      this.showlogin = false;

    }

    else if (page == 'forgot') {
      this.headerText = 'Please enter your email';

    }
    else if (page == 'change') {
      this.headerText = 'An Email will be sent for otp varification';
      this.showlogin = false;

    }
    this.confirmService.setdata(this.request);

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
      else{
       
      }
    }); 
  } 
}
@Component({
  selector: 'app-dynamic-input-dialog',
  styleUrls: ['./confirm.component.css'],
  template: `
      <div>
      <form [formGroup]="form" class="my-3" *ngIf="!showComponent" >
      <input
  type="email"
  formControlName="email"
  class="form-control"
  [readonly]="localStorageEmailPresent()"
  [ngClass]="{ 'disabled-input': localStorageEmailPresent() }"
/>
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
            <div *ngIf="showError&& remainingTime !== 0"><p class="text-danger">The Entered Otp is not valid</p></div>
            </div>
          <div class="my-2 d-flex justify-content-between"> 
        <button  *ngIf="remainingTime !== 0"  class="btn btn-info validate" (click)="onValidate()">Validate</button> 
        <div *ngIf="showComponent && remainingTime === 0" class="d-flex gap-2">
                <button pButton type="button" class="btn btn-primary" (click)="resendOTP()">Resend Otp</button>
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
  <button pButton type="button" class="btn btn-primary"  (click)="toggleComponentVisibility(1)">Send Otp</button>
</div>
    `
})
export class DynamicInputDialogComponent {
  sharedData:any;
  userInput: string = '';
  form: FormGroup;
  otp: any;

  showError: boolean = false;
  showResendButton: boolean = true;
  showComponent: boolean = false;
  enteredOTP: any;

  countdownInterval: any = null;
  remainingTime: number = 120;
  constructor(public ref: DynamicDialogRef, private fb: FormBuilder, private apiservice: ApiCallService,
    private confirmService: ConfirmService) {
    this.form = this.fb.group({
      email: ['' || localStorage.getItem('email'), [Validators.required, Validators.email]],
    });
  }
  ngOnInit() {
    this.confirmService.sharedata$.subscribe(data => {
      this.sharedData = data;
    });
  }

  onConfirm() {
    this.ref.close(this.userInput);
  }
  onOtpChange(otpValue: any) {
    this.enteredOTP = otpValue;
  }

  resendOTP() {
    this.remainingTime = 120;
    this.toggleComponentVisibility(0);
    this.showResendButton = false;
    this.showError = false;
  }
  onValidate() {
    const obj = {
      email: this.form.value.email,
      otp: this.enteredOTP,
      type: this.sharedData
    };
    this.apiservice.OtpVerification(obj).subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log(response.data);
          this.ref.close('Validation Successful');
          this.confirmService.getdata(response.data);
        } else {
          this.showError = true;
        }
      }
    });
  }
  localStorageEmailPresent(): boolean {
    const emailFromLocalStorage = localStorage.getItem('email');
    return !!emailFromLocalStorage;
  }

  toggleComponentVisibility(resent: number) {

    this.form.markAllAsTouched();
    debugger
    if (this.form.valid) {
      const obj = {
        email: this.form.value.email,
        type: this.sharedData
      }
      this.apiservice.EmailVerification(obj).subscribe({
        next: (response) => {
          console.log(response);
          this.otp = response;
        }
      })
      if (resent == 1) {
        this.showComponent = !this.showComponent;
      }
      if (this.showComponent) {
        this.startCountdown();
      } else {
        this.stopCountdown();
      }
    }
  }
  startCountdown() {
    if (this.countdownInterval === null) {
      this.countdownInterval = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
        } else {
          this.stopCountdown();
        }
      }, 1000);
    }
  }
  stopCountdown() {
    if (this.countdownInterval !== null) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }
}


