import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { ApiCallService } from '../Components/Services/api-call.service';
import { Router } from '@angular/router';
 

@Component({
  selector: 'app-newposts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorModule],
  templateUrl: './newposts.component.html',
  styleUrls: ['./newposts.component.css']
})
export class NewpostsComponent {
  formGroup: any;
  selectedFiles: { file: any, url: string }[] = [];
  selectedFile: any;
  selectedFileName: string = 'Choose file';
  selectedImage: any;
  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  temp: any;
  UserAddresses: any;
  selectedAddressId:  any;

  constructor(private ApiService: ApiCallService, private router: Router) {}
 
  
  ngOnInit() {
    this.formGroup = new FormGroup({
      text: new FormControl('', Validators.required),
      tittle: new FormControl('', Validators.required),
   
    });

    this.GetUserAddrssById();
  }
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
 
      this.selectedFiles = [];
  
      for (let i = 0; i < files.length; i++) {
 
        const file = files[i];
        const url = URL.createObjectURL(file);
        this.selectedFiles.push({ file, url });
      }
    }
    console.log(this.selectedFiles);
    
  }
 
  PostButton() {
    if (this.formGroup.invalid) {
      for (const controlName in this.formGroup.controls) {
        if (this.formGroup.controls.hasOwnProperty(controlName)) {
          this.formGroup.get(controlName).markAsTouched();
        }
      }
    } else {
      const formData = new FormData();
      formData.append('mainContent', this.formGroup.value.text);
      formData.append('tittle', this.formGroup.value.tittle);
      formData.append('UserId', this.id.toString());
  
      if (this.selectedAddressId !== null && this.selectedAddressId !== undefined) {
        formData.append('AddresssId', this.selectedAddressId.toString());
      }
  
      // Append all selected files
      for (const { file } of this.selectedFiles) {
        formData.append('IData', file);
      }
  
      this.ApiService.AddnewArticle(formData).subscribe({
        next: (dataobj) => {
          this.temp = dataobj;
          if (this.temp.success) {
            alert("Post Successfully");
            // Reset form and selected files
            this.formGroup.reset();
            this.selectedFiles = [];
          } else {
            alert("Something went wrong");
          }
        },
        error: (e: any) => {
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
          (address: any) => address.isPrimary === true
        );
        if (primaryAddressIndex !== -1) {
          const primaryAddress = this.UserAddresses.splice(primaryAddressIndex, 1)[0];
          this.UserAddresses.unshift(primaryAddress);
          this.selectedAddressId = primaryAddress.id;
        }
      },
      error: (e: any) => {
        console.log(e);
      },
    });
  }

  onRadioChange(addressId: number) {
    this.selectedAddressId = addressId;
  }
}
