import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentReviewComponent } from './talent-review.component';

describe('TalentReviewComponent', () => {
  let component: TalentReviewComponent;
  let fixture: ComponentFixture<TalentReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TalentReviewComponent]
    });
    fixture = TestBed.createComponent(TalentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
