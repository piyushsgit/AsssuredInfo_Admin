import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AuthService } from './Components/Services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from './Components/Services/loading.service';
import { AddressServiceService } from './home/service/address-service.service';
import { HomepageComponent } from './home/homepage/homepage.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  isLoading = this.loadingService.loading$;
  searchTerm:any
  id:any=1
  constructor(private router: Router, public auth: AuthService,private loadingService:
     LoadingService,private dataServices:AddressServiceService) {}   
  shouldShowNavbar(): boolean { 
    const currentRoute = this.router.url;
    return currentRoute !== '/' && currentRoute !== '/Register' ;
    // && currentRoute !=='/searchresult'
  }
  SearchAddress(){
    this.router.navigate(['/homepage'], {
      queryParams: {
        searchText: this.searchTerm
      }
    });
  }
  
}