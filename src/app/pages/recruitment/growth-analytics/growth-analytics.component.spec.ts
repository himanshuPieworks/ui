import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthAnalyticsComponent } from './growth-analytics.component';

describe('GrowthAnalyticsComponent', () => {
  let component: GrowthAnalyticsComponent;
  let fixture: ComponentFixture<GrowthAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrowthAnalyticsComponent]
    });
    fixture = TestBed.createComponent(GrowthAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
