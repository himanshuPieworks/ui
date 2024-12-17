import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryDashboardReportComponent } from './discovery-dashboard-report.component';

describe('DiscoveryDashboardReportComponent', () => {
  let component: DiscoveryDashboardReportComponent;
  let fixture: ComponentFixture<DiscoveryDashboardReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscoveryDashboardReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoveryDashboardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
