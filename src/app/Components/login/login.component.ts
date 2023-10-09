import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'; 
import { ConfirmService } from '../shared/confirm.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  myForm: FormGroup;
  hide = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private messageService: MessageService,private con: ConfirmService) {
    this.myForm = new FormGroup({})
  }
  ngOnInit() {
    this.myForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  login() {
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      const val = this.myForm.value;

      this.authService.login(val.email, val.password).subscribe(
        (response) => {
          if (response.message === "login Failed") {
            this.router.navigateByUrl(''); 
            this.show();
          } else {
            console.log(response);
            
            this.router.navigateByUrl('homepage'); 
            if(response.data.emailVerified==false)
              this.con.confirm('home') 
          }
        }
      );
    }
  }
  forgotPassword(){
    this.con.confirm('forgot')
  }
  show() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Credentials' });
  }
}
