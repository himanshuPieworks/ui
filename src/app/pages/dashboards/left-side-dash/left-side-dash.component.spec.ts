import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSideDashComponent } from './left-side-dash.component';

describe('LeftSideDashComponent', () => {
  let component: LeftSideDashComponent;
  let fixture: ComponentFixture<LeftSideDashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeftSideDashComponent]
    });
    fixture = TestBed.createComponent(LeftSideDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
