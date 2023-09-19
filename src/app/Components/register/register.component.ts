import { Component } from '@angular/core'; 
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { User } from 'src/app/Models/user';
import { HttpClient } from '@angular/common/http'
  
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
 
export class RegisterComponent {
  postalcode: string=''; 
  video: HTMLVideoElement | null = null;
  videoSource: string = '../../../assets/video (2160p).mp4';
  loaderActive = false;
  select: { option: string } = { option: 'Select one' };
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
  address = 'ddd';
  options: User[] = [{name: 'Mary'}, {name: 'Shelley'}, {name: 'Igor'}];
  avatar: any[]=[
    {id:1,avt:'https://www.lightningdesignsystem.com/assets/images/avatar2.jpg'},{id:2,avt:'https://www.nicepng.com/png/detail/186-1866063_dicks-out-for-harambe-sample-avatar.png' },{id:3,avt:'https://png.pngtree.com/element_our/png/20181206/female-avatar-vector-icon-png_262142.jpg' },
    {id:4,avt:'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-avatar-icon-png-image_695765.jpg'},
    {id:5,avt:'https://toppng.com/uploads/preview/avatar-png-11554021661asazhxmdnu.png'},{id:6,avt:'https://png.pngtree.com/element_our/png/20181206/female-avatar-vector-icon-png_262142.jpg' },
    {id:7,avt:'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-avatar-icon-png-image_695765.jpg'},
    {id:8,avt:'https://toppng.com/uploads/preview/avatar-png-11554021661asazhxmdnu.png'},]
  myControl = new FormControl<string | User>('');
  filteredOptions: Observable<User[]>;

  constructor( private http: HttpClient) {  
    this.filteredOptions = new Observable<User[]>();
  }
  
  ngOnInit() {
    this.video = document.querySelector('.video-background') as HTMLVideoElement; 
    const hasVideoBeenPlayed = localStorage.getItem('videoPlayed'); 
    if (hasVideoBeenPlayed) { 
      this.playVideo();
    } else { 
      localStorage.setItem('videoPlayed', 'true');
      this.playVideo();
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }
  playVideo() {
    if (this.video) {
      this.video.src = this.videoSource; // Set the video source
      this.video.play(); // Start video playback
    }
  }
  startLoader() {
    this.loaderActive = true;
  } 
 
  stopLoader() {
    this.loaderActive = false;
  }
  selectAvatar(id: number  ): void {
    this.selectedAvatarId = id;
  }
  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
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
            this.PostOffice = response[0].PostOffice.map((element: any) => element.Name);
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
}
