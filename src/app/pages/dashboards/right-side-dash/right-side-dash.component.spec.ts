import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSideDashComponent } from './right-side-dash.component';

describe('RightSideDashComponent', () => {
  let component: RightSideDashComponent;
  let fixture: ComponentFixture<RightSideDashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RightSideDashComponent]
    });
    fixture = TestBed.createComponent(RightSideDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
