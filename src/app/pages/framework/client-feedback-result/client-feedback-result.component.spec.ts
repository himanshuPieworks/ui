import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFeedbackResultComponent } from './client-feedback-result.component';

describe('ClientFeedbackResultComponent', () => {
  let component: ClientFeedbackResultComponent;
  let fixture: ComponentFixture<ClientFeedbackResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientFeedbackResultComponent]
    });
    fixture = TestBed.createComponent(ClientFeedbackResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
