import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiCallService } from '../Components/Services/api-call.service';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-newpoll',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './newpoll.component.html',
  styleUrls: ['./newpoll.component.css']
})
export class NewpollComponent {
  formGroup: any ;
  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  temp:any
  opt:number=1
  myForm:any
  enable=true
  UserAddresses:any
  selectedAddressId: number | undefined;
  constructor(private ApiService: ApiCallService,private router:Router,private fb:FormBuilder){}
  ngOnInit() {
    this.myForm = this.fb.group({
      question: ['', [Validators.required, Validators.maxLength(299)]],
      opt1: ['', [Validators.required, Validators.maxLength(49)]],
      opt2: ['', [Validators.required, Validators.maxLength(49)]],
      options: this.fb.array([])
    });
    this.GetUserAddrssById()
  }

  get optionsFormArray() {
    return this.myForm.get('options') as FormArray;
  }

  addOption() {
    if(this.opt<3){
      this.optionsFormArray.push(new FormControl('',[Validators.required, Validators.maxLength(49)]));
      this.opt=this.opt+1
    }
    if(this.opt==3){
      this.enable=false
    }
  }
  removeoption(){
    if(this.opt>1){
      this.optionsFormArray.removeAt(0)
      this.opt=this.opt-1
    }
    if(this.opt<3){
      this.enable=true
    }
  }
  PostButton() {
    if(this.myForm.valid){
      const obj={
        UserId :this.id,
        AddressId :this.selectedAddressId,
        Question:this.myForm.value.question,
        Opt1:this.myForm.value.opt1,
        Opt2:this.myForm.value.opt2,
        Opt3:this.myForm.value?.options[0],
        Opt4:this.myForm.value?.options[1]
        }
        if(obj.Opt3==undefined && obj.Opt4==undefined){
         obj.Opt3=null
         obj.Opt4=null
        }else if(obj.Opt4==undefined){
          obj.Opt4=null
        }
      this.ApiService.AddNewPolls(obj).subscribe({
       next: (dataobj) => {
       this.temp = dataobj;
       if(this.temp.success){
         alert("Poll successfully")
         this.router.navigate(['homepage'])
       }
       else{
         alert("something went wrrong")
       }
     },
     error: (e:any) => {
       console.log(e);
     },
   });
    }
    else{
      this.markFormGroupAsTouched(this.myForm);
    }
   }

   markFormGroupAsTouched(formGroup: FormGroup | FormArray) {
    debugger
    Object.values(formGroup.controls).forEach(control => {
        if (control instanceof FormControl) {
            control.markAsTouched();
        } else if (control instanceof FormGroup || control instanceof FormArray) {
            this.markFormGroupAsTouched(control);
        }
    });
}
  GetUserAddrssById() {
    this.ApiService.GetUsersAddressById(this.id).subscribe({
      next: (dataobj) => {
        this.temp = dataobj;
        this.UserAddresses = this.temp.data;
        const primaryAddressIndex = this.UserAddresses.findIndex(
          (address:any) => address.isPrimary === true
        );
        if (primaryAddressIndex !== -1) {
          const primaryAddress = this.UserAddresses.splice(primaryAddressIndex, 1)[0];
          this.UserAddresses.unshift(primaryAddress);
          this.selectedAddressId=primaryAddress.id;
        }        
      },
      error: (e:any) => {
        console.log(e);
      },
    });
  }
  

  onRadioChange(addressId: number) {
    this.selectedAddressId = addressId;
  }
}
