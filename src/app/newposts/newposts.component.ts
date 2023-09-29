import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { ApiCallService } from '../Components/Services/api-call.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-newposts',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,EditorModule],
  templateUrl: './newposts.component.html',
  styleUrls: ['./newposts.component.css']
})
export class NewpostsComponent {
  formGroup: any ;
  id:any=27
  temp:any
  UserAddresses:any
  selectedAddressId: number | undefined;
  constructor(private ApiService: ApiCallService,private router:Router){}
  ngOnInit() {
      this.formGroup = new FormGroup({
          text: new FormControl('',Validators.required),
          tittle:new FormControl('',Validators.required)
      });
      
      this.GetUserAddrssById()
   
  }
  PostButton(){
    if (this.formGroup.invalid) {
      for (const controlName in this.formGroup.controls) {
        if (this.formGroup.controls.hasOwnProperty(controlName)) {
          this.formGroup.get(controlName).markAsTouched();
        }
      }
    } else {
      const obj={
        mainContent: this.formGroup.value.text,
        tittle:this.formGroup.value.tittle,
        UserId:27,
        AddresssId:this.selectedAddressId
      }
      this.ApiService.AddnewArticle(obj).subscribe({
        next: (dataobj) => {
          this.temp = dataobj;
          if(this.temp.success){
            alert("Post Succcesfullyy")
            this.router.navigate(['profile'])
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
          this.selectedAddressId=primaryAddress.id
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
