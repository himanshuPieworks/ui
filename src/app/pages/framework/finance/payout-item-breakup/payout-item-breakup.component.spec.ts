import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutItemBreakupComponent } from './payout-item-breakup.component';

describe('PayoutItemBreakupComponent', () => {
  let component: PayoutItemBreakupComponent;
  let fixture: ComponentFixture<PayoutItemBreakupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayoutItemBreakupComponent]
    });
    fixture = TestBed.createComponent(PayoutItemBreakupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
