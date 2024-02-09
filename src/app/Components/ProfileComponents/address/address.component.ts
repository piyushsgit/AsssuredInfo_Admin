import { Component,EventEmitter, Input, Output} from '@angular/core';
import { FormControl} from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { User } from 'src/app/Models/user';
import { ApiCallService } from '../../Services/api-call.service'; 
 
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
})
export class AddressComponent {
  fullAddress:any='';
  @Input() childValue= {
    pinccode: '',
    district:'',
    fullAddress:'',
    isPrimary: false,
    state: '',
    postalcode:''
  };
  postalcode:any
  loaderActive = false;
  pincode: any;
  isChecked = false;
  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  temp: any;
  temp2: any;
  PincodeData: any;
  isformopen = true;
  select: { option: string } = { option: 'Postal Address' };
  options: User[] = [{ name: 'Mary' }, { name: 'Shelley' }, { name: 'Igor' }];
  PostOffice: any[] = [];
  selectedOption: User | null = null;
  responseStatus: 'loading' | 'success' | 'error' | 'initial' = 'initial';
  myControl = new FormControl<string | User>('');
  filteredOptions: Observable<User[]>;
  constructor(private ApiService: ApiCallService) {
    this.filteredOptions = new Observable<User[]>();
  }

  ngOnInit(){ 
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );
  }
  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  startLoader() {
    this.loaderActive = true;
  }

  stopLoader() {
    this.loaderActive = false;
  }
  fetchPostalCodeData(postalCode: string) {
    if (postalCode.length === 6) {
      this.startLoader();
      this.responseStatus = 'loading';
      this.ApiService.GetDetailByPincode(postalCode).subscribe(
        (response: any) => {
          this.PincodeData = response;
          if (response && response[0] && response[0].PostOffice) {
            this.PostOffice = response[0].PostOffice.map(
              (element: any) => element.Name
            );
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
  onSuggestionClick(option: any) {
    this.temp = option;
  }

  SelectedPostalCodeData: any;

  onSubmit() {
    this.SelectedPostalCodeData = this.PincodeData[0].PostOffice.find(
      (x: any) => x.Name === this.childValue.district
    );
    if (this.temp != undefined) {
      this.fullAddress = this.temp;
      this.temp = '';
    }

   const  obj={
    user_Id:this.id,
    pincode: this.SelectedPostalCodeData.Pincode,
    postalCode:this.SelectedPostalCodeData.Name,
    fullAddress:  this.childValue.district,
    isPrimary:this.isChecked,
    state: this.SelectedPostalCodeData.Circle,
    district: this.SelectedPostalCodeData.Block
    }
    this.ApiService.AddnewAddress(obj).subscribe({
      next: (dataobj) => {
        this.temp2 = dataobj;
        if (this.temp2.success) {
          this.newItemEvent.emit(false);
          this.ngOnInit();
        }
      },
      error: (e) => {
        console.log(e);
      },
    });
    
  }
  @Output() newItemEvent = new EventEmitter<any>();
  emitEvent() {
    this.newItemEvent.emit(false); // Emit the event with the desired data
  } 
temprorydata:any 
UpdateAddreess(){
this.ApiService.GetDetailByPincode(this.childValue.pinccode).subscribe(
        (response: any) => {
          if (response && response[0] && response[0].PostOffice) {
            this.temprorydata = response[0].PostOffice.filter(
              (element: any) => element.Name==this.childValue.postalcode);
            this.valueUpdate()
            }

        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
     
}
valueUpdate()
{
  const obj={
    user_Id:this.id,
    pincode: this.childValue.pinccode,
    postalCode:this.childValue.postalcode,
    fullAddress:  this.childValue.fullAddress,
    isPrimary:this.isChecked,
    state: this.temprorydata[0].State,
    district: this.temprorydata[0].Region
  }
 console.log(obj);
 
}

}
