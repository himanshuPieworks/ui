import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceReportsComponent } from './finance-reports.component';

describe('FinanceReportsComponent', () => {
  let component: FinanceReportsComponent;
  let fixture: ComponentFixture<FinanceReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceReportsComponent]
    });
    fixture = TestBed.createComponent(FinanceReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
