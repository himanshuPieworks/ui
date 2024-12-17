import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerFeedbackResultComponent } from './peer-feedback-result.component';

describe('PeerFeedbackResultComponent', () => {
  let component: PeerFeedbackResultComponent;
  let fixture: ComponentFixture<PeerFeedbackResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeerFeedbackResultComponent]
    });
    fixture = TestBed.createComponent(PeerFeedbackResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
