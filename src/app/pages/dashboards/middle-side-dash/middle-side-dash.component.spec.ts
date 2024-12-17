import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiddleSideDashComponent } from './middle-side-dash.component';

describe('MiddleSideDashComponent', () => {
  let component: MiddleSideDashComponent;
  let fixture: ComponentFixture<MiddleSideDashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiddleSideDashComponent]
    });
    fixture = TestBed.createComponent(MiddleSideDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
