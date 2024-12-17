import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerFeedbackFormComponent } from './peer-feedback-form.component';

describe('PeerFeedbackFormComponent', () => {
  let component: PeerFeedbackFormComponent;
  let fixture: ComponentFixture<PeerFeedbackFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeerFeedbackFormComponent]
    });
    fixture = TestBed.createComponent(PeerFeedbackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
