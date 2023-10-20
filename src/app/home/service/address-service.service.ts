import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeArticleComponent } from '../home-article/home-article.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AddressServiceService {
constructor(private router:Router){}
  private selectedAddressIdSource = new BehaviorSubject<number>(0);
  selectedAddressId$ = this.selectedAddressIdSource.asObservable();


  updateSelectedAddressId(addressId: number) {
    this.selectedAddressIdSource.next(addressId);
  }
  private articleIdSubject = new BehaviorSubject<number>(0);
  articleId$ = this.articleIdSubject.asObservable();

  setArticleId(articleId: number): void {
    this.articleIdSubject.next(articleId);
  }


 
  
}
