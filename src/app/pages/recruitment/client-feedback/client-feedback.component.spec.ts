import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFeedbackComponent } from './client-feedback.component';

describe('ClientFeedbackComponent', () => {
  let component: ClientFeedbackComponent;
  let fixture: ComponentFixture<ClientFeedbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientFeedbackComponent]
    });
    fixture = TestBed.createComponent(ClientFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
