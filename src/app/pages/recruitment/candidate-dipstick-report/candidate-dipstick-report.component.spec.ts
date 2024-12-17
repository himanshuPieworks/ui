import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDipstickReportComponent } from './candidate-dipstick-report.component';

describe('CandidateDipstickReportComponent', () => {
  let component: CandidateDipstickReportComponent;
  let fixture: ComponentFixture<CandidateDipstickReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateDipstickReportComponent]
    });
    fixture = TestBed.createComponent(CandidateDipstickReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
