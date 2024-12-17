import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesTrackerComponent } from './candidates-tracker.component';

describe('CandidatesTrackerComponent', () => {
  let component: CandidatesTrackerComponent;
  let fixture: ComponentFixture<CandidatesTrackerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidatesTrackerComponent]
    });
    fixture = TestBed.createComponent(CandidatesTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
