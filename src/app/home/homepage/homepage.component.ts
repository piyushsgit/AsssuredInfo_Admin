import { Component, ViewChild } from '@angular/core';
import { ConfirmService } from 'src/app/Components/shared/confirm.service';
import { ConfirmComponent } from 'src/app/Components/shared/confirm/confirm.component';
 

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
 

  constructor(private con: ConfirmService) { }

  ngOnInit() {
    if (this.con) {
     
      this.con.confirm();
    }
  }
}
