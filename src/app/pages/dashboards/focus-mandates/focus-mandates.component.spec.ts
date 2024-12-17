import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusMandatesComponent } from './focus-mandates.component';

describe('FocusMandatesComponent', () => {
  let component: FocusMandatesComponent;
  let fixture: ComponentFixture<FocusMandatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FocusMandatesComponent]
    });
    fixture = TestBed.createComponent(FocusMandatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
