import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApicallService } from 'src/app/home/service/apicall.service';
import { ApiCallService } from '../Services/api-call.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmService } from '../shared/confirm.service';

@Component({
  selector: 'app-forgotpasswordpage',
  templateUrl: './forgotpasswordpage.component.html',
  styleUrls: ['./forgotpasswordpage.component.css']
})
export class ForgotpasswordpageComponent {
  confirmpassword:any
  password:any 
  
  id:any
  constructor(private messageService: MessageService,private api:ApiCallService,private router:Router,private confirmservice:ConfirmService){}
  
  ngOnInit(){
    this.confirmservice.sharemail$.subscribe(email => {
      if(email==''){
        this.router.navigate([''])
      }else{
        this.id=email;
      }
    })
  }

  onSubmit(){ 
   if(this.confirmpassword!==this.password){
    this.messageService.add({ severity: 'error', summary: '', detail: 'Confirm Password not match' });
   }
   else{
    const  formdata = { 
      email:this.id,
      password: this.password,
    };
  this.api.UpdateUserInfo(formdata).subscribe(
    (response) => {
      this.router.navigate([''])
      alert('Password Changed')
    },
    (error) => {
      console.error('Error posting form data:', error);
    }
  );
}

}
}

