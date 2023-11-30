import { Injectable } from '@angular/core';
import { ConfirmComponent } from './confirm/confirm.component';
import { BehaviorSubject } from 'rxjs';
 

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private confirmComponent: ConfirmComponent | undefined; 
  setConfirmComponent(confirmComponent: ConfirmComponent) {
    this.confirmComponent = confirmComponent;
  }
  
  confirm(page:string,req:number) {
    if (this.confirmComponent) {
     this.confirmComponent.confirm(page,req);
    } 
  }

  private sharedata = new BehaviorSubject<string>('');
  sharedata$ = this.sharedata.asObservable(); 
  setdata(data: string): void {
    this.sharedata.next(data);
  }
 
  private getData = new BehaviorSubject<string>('');
  getndata$ = this.getData.asObservable(); 
  getdata(data: string): void { 
    this.getData.next(data);
  }


}
