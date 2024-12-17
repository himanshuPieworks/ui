import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateAnalyticsComponent } from './candidate-analytics.component';

describe('CandidateAnalyticsComponent', () => {
  let component: CandidateAnalyticsComponent;
  let fixture: ComponentFixture<CandidateAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateAnalyticsComponent]
    });
    fixture = TestBed.createComponent(CandidateAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
