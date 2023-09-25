import { Component, ViewEncapsulation } from '@angular/core';
import { ApiCallService } from '../../Services/api-call.service';
;
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent {
  id=16
  temp:any
  UserData:any
  UserAddresses:any
  primaryAddress:any
  isNewAddress=false
   constructor(private ApiService:ApiCallService){
   }
   
 ngOnInit(){
   this.GetUserById()
   this.GetUserAddrssById()
 }

 
 GetUserById(){
     this.ApiService.GetUsersById(this.id).subscribe({
       next: (dataobj) => {
         this.temp=dataobj
         this.UserData=this.temp.data[0]
         console.log(this.UserData);
         
       },
       error:(e)=>{
         console.log(e);
       }
       });
   }
   GetUserAddrssById(){
    this.ApiService.GetUsersAddressById(this.id).subscribe({
      next: (dataobj) => {
        this.temp=dataobj
        this.UserAddresses=this.temp.data;
         this.primaryAddress = this.UserAddresses.find((address:any) => address.isPrimary === true);
         console.log(this.primaryAddress)
         console.log(this.UserAddresses);
      },
      error:(e)=>{
        console.log(e);
      }
      });
  }
  newAddress(){
  this.isNewAddress=true
  }
}
