import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpollComponent } from './newpoll.component';

describe('NewpollComponent', () => {
  let component: NewpollComponent;
  let fixture: ComponentFixture<NewpollComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewpollComponent]
    });
    fixture = TestBed.createComponent(NewpollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
