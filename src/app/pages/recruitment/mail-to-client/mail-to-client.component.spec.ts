import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailToClientComponent } from './mail-to-client.component';

describe('MailToClientComponent', () => {
  let component: MailToClientComponent;
  let fixture: ComponentFixture<MailToClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MailToClientComponent]
    });
    fixture = TestBed.createComponent(MailToClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
