import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsIndexComponent } from './analytics-index.component';

describe('AnalyticsIndexComponent', () => {
  let component: AnalyticsIndexComponent;
  let fixture: ComponentFixture<AnalyticsIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsIndexComponent]
    });
    fixture = TestBed.createComponent(AnalyticsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
