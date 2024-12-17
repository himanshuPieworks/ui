import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityAnalyticsComponent } from './community-analytics.component';

describe('CommunityAnalyticsComponent', () => {
  let component: CommunityAnalyticsComponent;
  let fixture: ComponentFixture<CommunityAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityAnalyticsComponent]
    });
    fixture = TestBed.createComponent(CommunityAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
