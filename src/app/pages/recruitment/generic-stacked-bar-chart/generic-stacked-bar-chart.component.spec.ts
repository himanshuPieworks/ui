import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericStackedBarChartComponent } from './generic-stacked-bar-chart.component';

describe('GenericStackedBarChartComponent', () => {
  let component: GenericStackedBarChartComponent;
  let fixture: ComponentFixture<GenericStackedBarChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericStackedBarChartComponent]
    });
    fixture = TestBed.createComponent(GenericStackedBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
