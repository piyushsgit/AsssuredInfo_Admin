import { Injectable } from '@angular/core';
import { ConfirmComponent } from './confirm/confirm.component';
 

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private confirmComponent: ConfirmComponent | undefined;

  setConfirmComponent(confirmComponent: ConfirmComponent) {
    this.confirmComponent = confirmComponent;
  }

 
  confirm(page:string) {
    if (this.confirmComponent) {
      this.confirmComponent.confirm(page);
    }
  }
}
