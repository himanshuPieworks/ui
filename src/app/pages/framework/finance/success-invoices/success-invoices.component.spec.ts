import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessInvoicesComponent } from './success-invoices.component';

describe('SuccessInvoicesComponent', () => {
  let component: SuccessInvoicesComponent;
  let fixture: ComponentFixture<SuccessInvoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessInvoicesComponent]
    });
    fixture = TestBed.createComponent(SuccessInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
