import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeArticleComponent } from './home-article.component';

describe('HomeArticleComponent', () => {
  let component: HomeArticleComponent;
  let fixture: ComponentFixture<HomeArticleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeArticleComponent]
    });
    fixture = TestBed.createComponent(HomeArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
