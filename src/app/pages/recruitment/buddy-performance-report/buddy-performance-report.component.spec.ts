import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuddyPerformanceReportComponent } from './buddy-performance-report.component';

describe('BuddyPerformanceReportComponent', () => {
  let component: BuddyPerformanceReportComponent;
  let fixture: ComponentFixture<BuddyPerformanceReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuddyPerformanceReportComponent]
    });
    fixture = TestBed.createComponent(BuddyPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
