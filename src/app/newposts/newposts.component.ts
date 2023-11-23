import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { ApiCallService } from '../Components/Services/api-call.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
 

@Component({
  selector: 'app-newposts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorModule,ToastModule],
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

  constructor(private ApiService: ApiCallService, private router: Router,private message:MessageService) {}
  ngOnInit() {
    this.formGroup = new FormGroup({
      text: new FormControl('', [Validators.required,Validators.minLength(300)]),
      tittle: new FormControl('', [Validators.required,Validators.minLength(10)]),
   
    });

    this.GetUserAddrssById();
  }
  onFileSelected(event: any) {
    const files = event.target.files;
    if(files.length>7){
      this.handleErrors('Not select More than 7 images are allowed')
      return;
    }
    if (files) {
      this.selectedFiles = [];
  
      for (let i = 0; i < files.length; i++) {
 
        const file = files[i];
        const url = URL.createObjectURL(file);
        this.selectedFiles.push({ file, url });
      }
    }
    
  }
 
 
  PostButton() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.handleErrors('Fill Required Value')
      return;
    }    
    else if (this.selectedFiles.length == 0) {
      this.handleErrors('Please Select an Image')
      return;
    }
    else {
      const formData =this.getFormData()
      this.ApiService.AddnewArticle(formData).subscribe({
        next: (dataobj) => {
          this.temp = dataobj;
          if (this.temp.success) {
            this.router.navigate(['/profile'])
            this.message.add({severity:'success', summary: 'Post', detail:'Your Article Post Successfully'});
            this.formGroup.reset();
            this.selectedFiles = [];
          } else {
            this.handleErrors('Something went wrong')
          }
        },
        error: (e: any) => {
          this.handleErrors(e)
        },
      });
    }
  }
  private getFormData(): FormData {
    const formData = new FormData();
    formData.append('mainContent', this.formGroup.value.text);
    formData.append('tittle', this.formGroup.value.tittle);
    formData.append('UserId', this.id.toString());
  
    if (this.selectedAddressId !== null && this.selectedAddressId !== undefined) {
      formData.append('AddresssId', this.selectedAddressId.toString());
    }
  
    for (const { file } of this.selectedFiles) {
      formData.append('IData', file);
    }
  
    return formData;
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
        this.handleErrors(e)
      },
    });
  }

  onRadioChange(addressId: number) {
    this.selectedAddressId = addressId;
  }

  private handleErrors(e: any) {
    console.error(e);
    this.message.add({severity:'error', summary: e, detail:'An error occurred while posting the article'});
  }
}
