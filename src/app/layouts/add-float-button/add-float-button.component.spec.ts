import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFloatButtonComponent } from './add-float-button.component';

describe('AddFloatButtonComponent', () => {
  let component: AddFloatButtonComponent;
  let fixture: ComponentFixture<AddFloatButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFloatButtonComponent]
    });
    fixture = TestBed.createComponent(AddFloatButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
