import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringOverviewComponent } from './hiring-overview.component';

describe('HiringOverviewComponent', () => {
  let component: HiringOverviewComponent;
  let fixture: ComponentFixture<HiringOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HiringOverviewComponent]
    });
    fixture = TestBed.createComponent(HiringOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
