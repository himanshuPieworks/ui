import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetainerInvoicesComponent } from './retainer-invoices.component';

describe('RetainerInvoicesComponent', () => {
  let component: RetainerInvoicesComponent;
  let fixture: ComponentFixture<RetainerInvoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RetainerInvoicesComponent]
    });
    fixture = TestBed.createComponent(RetainerInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
