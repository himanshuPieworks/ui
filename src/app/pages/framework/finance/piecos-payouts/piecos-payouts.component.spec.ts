import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiecosPayoutsComponent } from './piecos-payouts.component';

describe('PiecosPayoutsComponent', () => {
  let component: PiecosPayoutsComponent;
  let fixture: ComponentFixture<PiecosPayoutsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiecosPayoutsComponent]
    });
    fixture = TestBed.createComponent(PiecosPayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
