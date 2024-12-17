import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuddyViewComponent } from './buddy-view.component';

describe('BuddyViewComponent', () => {
  let component: BuddyViewComponent;
  let fixture: ComponentFixture<BuddyViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuddyViewComponent]
    });
    fixture = TestBed.createComponent(BuddyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
