import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpostsComponent } from './newposts.component';

describe('NewpostsComponent', () => {
  let component: NewpostsComponent;
  let fixture: ComponentFixture<NewpostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewpostsComponent]
    });
    fixture = TestBed.createComponent(NewpostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
