import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DipstickClientWiseReportComponent } from './dipstick-client-wise-report.component';

describe('DipstickClientWiseReportComponent', () => {
  let component: DipstickClientWiseReportComponent;
  let fixture: ComponentFixture<DipstickClientWiseReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DipstickClientWiseReportComponent]
    });
    fixture = TestBed.createComponent(DipstickClientWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
