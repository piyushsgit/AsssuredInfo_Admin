import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpasswordpageComponent } from './forgotpasswordpage.component';

describe('ForgotpasswordpageComponent', () => {
  let component: ForgotpasswordpageComponent;
  let fixture: ComponentFixture<ForgotpasswordpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotpasswordpageComponent]
    });
    fixture = TestBed.createComponent(ForgotpasswordpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
