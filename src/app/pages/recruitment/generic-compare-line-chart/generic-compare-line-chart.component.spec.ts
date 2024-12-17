import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericCompareLineChartComponent } from './generic-compare-line-chart.component';

describe('GenericCompareLineChartComponent', () => {
  let component: GenericCompareLineChartComponent;
  let fixture: ComponentFixture<GenericCompareLineChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericCompareLineChartComponent]
    });
    fixture = TestBed.createComponent(GenericCompareLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
