import {
  Component,  
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ApiCallService } from '../../Services/api-call.service';
import { AddressComponent } from '../address/address.component';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AboutComponent {
  tempid = localStorage.getItem('userId');
  editAddressData: any;
 
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  temp: any;
  UserData: any;
  UserAddresses: any;
  primaryAddress: any;
  isNewAddress = false;
  temporayAddress:any
  constructor(private ApiService: ApiCallService,private fb: FormBuilder) {
    this.myForm = this.fb.group({ 
      fullName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      bio: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  ngOnInit() {
    this.GetUserById();
    this.GetUserAddrssById();
  } 
  GetUserById() {
    this.ApiService.GetUsersById(this.id).subscribe({
      next: (dataobj) => {
        this.temp = dataobj;
        this.UserData = this.temp.data[0];
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
  GetUserAddrssById() {
    this.ApiService.GetUsersAddressById(this.id).subscribe({
      next: (dataobj) => {
        this.temp = dataobj;
        this.UserAddresses = this.temp.data;
        this.primaryAddress = this.UserAddresses.find(
          (address: any) => address.isPrimary === true
        );
        this.temporayAddress = this.UserAddresses.filter((address: any) => address !== this.primaryAddress);
        console.log(dataobj);
        
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
  newAddress() {
    this.isNewAddress = true;
  }
  NewAdressForm(eventData: boolean){
    this.isNewAddress=eventData;
    this.ngOnInit()
  }

  @ViewChild(AddressComponent, { static: false })
  childComponent!: AddressComponent;

  EditAddress(address_id: any) {
    this.isNewAddress = true;
    this.editAddressData = this.UserAddresses.find(
      (x: any) => x.id == address_id
    ); 
 
 
  } 
  DeleteAddressById(id: any) {
    if (confirm('Sure want to delete')) {
      this.ApiService.DeleteAddressById(id).subscribe({
        next: (dataobj) => {
          this.temp=dataobj
          if(this.temp.success){
          this.ngOnInit()
          }
          else{
            alert("Something Went Wrong")
          }
        },
        error: (e) => {
          console.log(e);
        },
      });
    }
  }
  myForm:any
  EditUserInfo(){
    const originalDate = new Date(this.UserData.dateOfBirth);
    const year = originalDate.getFullYear();
    const month = originalDate.getMonth() + 1; 
    const day = originalDate.getDate();
    this.UserData.dateOfBirth = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    this.myForm.patchValue(this.UserData);
  }
  onEditSubmit(){
    const obj={
      id: this.id,
      fullName: this.myForm.value.fullName,
      bio: this.myForm.value.bio,
      dateOfBirth:this.myForm.value.dateOfBirth,
    }
    console.log(obj)
    this.ApiService.UpdateUserInfo(obj).subscribe({
      next: (dataobj) => {
        this.temp=dataobj
        debugger
        if(this.temp.success){
          alert("Updated Successfully")
        this.ngOnInit()
        }
        else{
          alert("Something Went Wrong")
        }
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}
