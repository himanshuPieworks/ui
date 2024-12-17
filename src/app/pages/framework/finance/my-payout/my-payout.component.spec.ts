import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPayoutComponent } from './my-payout.component';

describe('MyPayoutComponent', () => {
  let component: MyPayoutComponent;
  let fixture: ComponentFixture<MyPayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyPayoutComponent]
    });
    fixture = TestBed.createComponent(MyPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
