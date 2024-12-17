import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentFeedbackComponent } from './talent-feedback.component';

describe('TalentFeedbackComponent', () => {
  let component: TalentFeedbackComponent;
  let fixture: ComponentFixture<TalentFeedbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TalentFeedbackComponent]
    });
    fixture = TestBed.createComponent(TalentFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
