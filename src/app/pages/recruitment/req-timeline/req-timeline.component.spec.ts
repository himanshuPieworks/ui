import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqTimelineComponent } from './req-timeline.component';

describe('ReqTimelineComponent', () => {
  let component: ReqTimelineComponent;
  let fixture: ComponentFixture<ReqTimelineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReqTimelineComponent]
    });
    fixture = TestBed.createComponent(ReqTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
