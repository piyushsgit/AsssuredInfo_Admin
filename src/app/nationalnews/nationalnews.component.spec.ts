import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalnewsComponent } from './nationalnews.component';

describe('NationalnewsComponent', () => {
  let component: NationalnewsComponent;
  let fixture: ComponentFixture<NationalnewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NationalnewsComponent]
    });
    fixture = TestBed.createComponent(NationalnewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
