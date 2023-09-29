import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepollComponent } from './homepoll.component';

describe('HomepollComponent', () => {
  let component: HomepollComponent;
  let fixture: ComponentFixture<HomepollComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomepollComponent]
    });
    fixture = TestBed.createComponent(HomepollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
