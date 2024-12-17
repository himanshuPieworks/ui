import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentNpsReportComponent } from './talent-nps-report.component';

describe('TalentNpsReportComponent', () => {
  let component: TalentNpsReportComponent;
  let fixture: ComponentFixture<TalentNpsReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TalentNpsReportComponent]
    });
    fixture = TestBed.createComponent(TalentNpsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
