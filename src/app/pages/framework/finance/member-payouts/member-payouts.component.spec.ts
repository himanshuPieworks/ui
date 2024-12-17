import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPayoutsComponent } from './member-payouts.component';

describe('MemberPayoutsComponent', () => {
  let component: MemberPayoutsComponent;
  let fixture: ComponentFixture<MemberPayoutsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberPayoutsComponent]
    });
    fixture = TestBed.createComponent(MemberPayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
