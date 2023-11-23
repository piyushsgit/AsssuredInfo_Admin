import { Component } from '@angular/core'; 
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { User } from 'src/app/Models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { ApiCallService } from '../Services/api-call.service';
import { Router } from '@angular/router'; 
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

 
export class RegisterComponent {
  hideComponent: boolean = false;
  postalcode: string=''; 
  myForm: FormGroup;
  video: HTMLVideoElement | null = null;
  videoSource: string = '../../../assets/mixkit-two-friends-looking-at-the-cell-phone-in-a-coffee-43266.mp4';
  loaderActive = false;
  select: { option: string } = { option: 'Postal Address' };
  responseStatus: 'loading' | 'success' | 'error' | 'initial' = 'initial';
  PostOffice: any[]=[];
  selectedOption: User | null = null; 
  selectedAvatarId: number | null = 1;
  wikiUrl: string = 'https://en.wikipedia.org';
  params: string = 'action=query&list=search&format=json&origin=*';
  searchResults: any[] = [];
  text: string = ''; 
  selectedValue: string = ''; // Variable to store the selected value
  isEditable = true; // Set to true to allow input
  message:any;
  address = 'ddd';
  passwordsMatching = false;
  isConfirmPasswordDirty = false;
  confirmPasswordClass = 'form-control';
  newPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);
  confirmPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);

  resetPasswordForm = this.fb.group(
    {
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    },
    {
      validator: this.ConfirmedValidator('newPassword', 'confirmPassword'),
    }
  );
  
  options: any[] = [ 'Harsiddhi Pg','shaligram','Igor'];
  avatar: any[]=[
    {id:1,avt:'https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833572.jpg?w=826&t=st=1699354026~exp=1699354626~hmac=f62789e90b2ff6ce42853990afdcdf917636b699d3879bdc1bff84c559819f12'},
    {id:2,avt:'https://img.freepik.com/free-psd/3d-rendering-boy-avatar-emoji_23-2150603406.jpg?w=826&t=st=1699354058~exp=1699354658~hmac=2209a3a5f05cef32feb66dc2c592fef8e887f63e762327dd2edc0e28c898cec8' },
    {id:3,avt:'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436178.jpg?w=826&t=st=1699354095~exp=1699354695~hmac=ce52075d6aa9f55a81528f994e6446ab057517a903ec2857460a9fc99de5c298' },
    {id:4,avt:'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611740.jpg?w=826&t=st=1699354110~exp=1699354710~hmac=bdb6069b492314df0bd2fe7b6062f05b8e4acc72370bd930c68434cc011c58d5'},
    {id:5,avt:'https://img.freepik.com/premium-psd/3d-cartoon-character-avatar-isolated-3d-rendering_235528-575.jpg?w=826'},
    {id:6,avt:'https://img.freepik.com/premium-photo/cartoon-character-with-blue-shirt-glasses_561641-2084.jpg?w=826' },
    {id:7,avt:'https://img.freepik.com/premium-photo/digital-art-selected_771703-4038.jpg?w=740'},
    {id:8,avt:'https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833536.jpg?w=826&t=st=1699354251~exp=1699354851~hmac=b99d56a133aa4413bb5f9187a211b369e94d7be69899d5fb8611f7a121af7f52'},]
    myControl = new FormControl<string | User>('');
    filteredOptions: Observable<User[]>;

  constructor( private http: HttpClient,private fb: FormBuilder,private api:ApiCallService,private rout :Router,private messageService: MessageService,private confirmationService: ConfirmationService) {  
    this.filteredOptions = new Observable<User[]>();
    this.myForm=new FormGroup({})
   
  }
    confirm1() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        },
        reject: (type: any) => {
            switch (type) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                    break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
                    break;
            }
        }
    });
}
  ngOnInit() { 
    this.myForm = this.fb.group({ 
      avtar_url:['https://www.lightningdesignsystem.com/assets/images/avatar2.jpg'] ,
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      dateOfBirth: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, confirmPasswordValidator]],
      pincode: ['', [Validators.required],Validators.minLength(6)],
      postalAddress:['',[Validators.required]],
      state:'',
      district:'',
      fullAddress:['',[Validators.required]]
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
    if (this.rout.url === '/some-route') {
      this.hideComponent = true;
    }
  }






  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  startLoader() {
    this.loaderActive = true;
  } 
 
  stopLoader() {
    this.loaderActive = false;
  }
  selectAvatar(event:Event): void { 
    this.selectedAvatarId = parseInt((event.target as HTMLInputElement).id); 
    this.myForm.patchValue({ avtar_url:(event.target as HTMLInputElement).src}); 
  }
  displayFn(user: User): string {
    return user ? user.toString() : '';
  }
  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase(); 
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  onInput(event: any) {
    this.address = event.target.innerHTML;
  }
  search(input: string): void {
    const url = `${this.wikiUrl}/w/api.php?${this.params}&srsearch=${encodeURI(input)}`; 
    if (input.length < 3) {
      this.searchResults = [];
      return;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.searchResults = data.query.search;
      });
  } 
  onSelect(selectedTitle: string): void {
    if (selectedTitle) { 
      this.selectedValue = selectedTitle;   
    }
  }
  fetchPostalCodeData(postalCode: string) {
    if (postalCode.length === 6) {
      this.startLoader();
      this.responseStatus = 'loading';
      this.http.get('https://api.postalpincode.in/pincode/' + postalCode).subscribe(
        (response: any) => {
          if (response && response[0] && response[0].PostOffice) {
            this.PostOffice = response[0].PostOffice.map((element: any) => {
              return {
                name: element.Name, 
                District: element.District,
                State:element.State
              }; 

            });
            const District = response[0].PostOffice[0].District;
            const State = response[0].PostOffice[0].State;
           this.myForm.patchValue({ state : State ,district:District});
            this.responseStatus = 'success';
          } else {
            this.PostOffice = ['No data available'];
            this.responseStatus = 'error';
          }
          this.stopLoader();
        },
        (error) => {
          console.error('Error fetching data:', error);
          this.PostOffice = ['Error fetching data'];
          this.responseStatus = 'error';
          this.stopLoader();
        }
      );
    } else {
      this.PostOffice = [];
      this.responseStatus = 'initial';
    }
  }
   
  updateOptions(input: string): void { 
    this.search(input);
  } 
  onSubmit() {
    if (this.myForm.valid) {
      console.log('Form submitted:', this.myForm.value);
    
    } else {
 
    }
  }
click() {
  this.myForm.markAllAsTouched(); 
  
  this.api.Registraion(this.myForm.value).subscribe(
    (response: any) => {
      console.log(response);
      if(response.message==' Registered  Successfully'){
        this.rout.navigate(['']);
      }
      if(response.data== -2){
      this.message='Email Already Exist';
      this.showError();
      }
      if(response.data== -3)
      {
        this.message='Username Already Exist';
        this.showError();
      }
    },
    (error) => {
      console.error('Error fetching data:', error);
    }
  );
}
showError() {
  this.messageService.add({ severity: 'error', summary: 'Error', detail: this.message });
}
} 

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { PasswordNoMatch: true };
};