import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  myForm: FormGroup;
  
  constructor(private fb: FormBuilder,private authService :AuthService,private router:Router) {
    this.myForm=new FormGroup({})
  }
  ngOnInit() {
    this.myForm = this.fb.group({ 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(form: FormGroup) {
    console.log('Valid?', form.valid); 
    console.log('Email', form.value.email);
    console.log('Password', form.value.password);
  }
  login() {
    const val = this.myForm.value;

    if (val.email && val.password) {
        this.authService.login(val.email, val.password)
            .subscribe(
                () => {
                    console.log("User is logged in");
                    this.router.navigateByUrl('home');
                }
            );
    }
}
  
}
