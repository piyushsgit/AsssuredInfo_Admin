import { Component } from '@angular/core';
import { AuthService } from './Components/Services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from './Components/Services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  isLoading = this.loadingService.loading$;
  constructor(private router: Router, public auth: AuthService,private loadingService: LoadingService) {}   
  shouldShowNavbar(): boolean { 
    const currentRoute = this.router.url;
    return currentRoute !== '/' && currentRoute !== '/Register';
  }
}