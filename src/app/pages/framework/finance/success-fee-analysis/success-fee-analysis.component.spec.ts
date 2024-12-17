import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessFeeAnalysisComponent } from './success-fee-analysis.component';

describe('SuccessFeeAnalysisComponent', () => {
  let component: SuccessFeeAnalysisComponent;
  let fixture: ComponentFixture<SuccessFeeAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessFeeAnalysisComponent]
    });
    fixture = TestBed.createComponent(SuccessFeeAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
