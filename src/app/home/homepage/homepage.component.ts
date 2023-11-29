
import {  ViewChild } from '@angular/core';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiCallService } from 'src/app/Components/Services/api-call.service';
import { ConfirmService } from 'src/app/Components/shared/confirm.service';
import { ApicallService } from '../service/apicall.service';
import { AddressServiceService } from '../service/address-service.service';
import { ActivatedRoute } from '@angular/router';
import { HomeArticleComponent } from '../home-article/home-article.component';
 
 


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  @ViewChild(HomeArticleComponent) childComponent!: HomeArticleComponent; 
  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  temp:any
  obj:any
  data:number=3;
  UserAddresses:any
  primaryAddress:any
  temporayAddress:any
  AricleResult:any
  selectedAddressId:any
  searchtext:any
  SearchIcon=false
  constructor(private ApiService:ApiCallService,private homeapiserv:ApicallService,
    private addressService: AddressServiceService, private route:ActivatedRoute ){}
  ngOnInit(){
    this.GetUserAddrssById()
    this.route.queryParams.subscribe(params => {
      this.searchtext = params['searchText'];
      if(this.searchtext!==undefined || null){
        this.SearchIcon=true
      }
      else{
        this.SearchIcon=false
      }
    });
   }
  GetUserAddrssById() {
    this.ApiService.GetUsersAddressById(this.id).subscribe({
      next: (dataobj) => {
        this.temp = dataobj;
        this.UserAddresses = this.temp.data;
        this.primaryAddress = this.UserAddresses.find(
          (address: any) => address.isPrimary === true
        );
        this.temporayAddress = this.UserAddresses.filter((address: any) => address !== this.primaryAddress);
        this.selectedAddressId=this.primaryAddress.mainaddressid
        this.addressService.updateSelectedAddressId(this.selectedAddressId);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
  onAddressChange(): void {
    console.log(this.selectedAddressId);
    this.addressService.updateSelectedAddressId(this.selectedAddressId);
  }
  

  childMethod() {
    console.log('Child component method called');
  }
  onParentScroll() {
    this.childComponent.onScroll();
  }
}



 




