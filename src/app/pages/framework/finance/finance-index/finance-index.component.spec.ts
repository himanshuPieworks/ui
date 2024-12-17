import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceIndexComponent } from './finance-index.component';

describe('FinanceIndexComponent', () => {
  let component: FinanceIndexComponent;
  let fixture: ComponentFixture<FinanceIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceIndexComponent]
    });
    fixture = TestBed.createComponent(FinanceIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
