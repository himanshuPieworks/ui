import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginStepperComponent } from './login-stepper.component';

describe('LoginStepperComponent', () => {
  let component: LoginStepperComponent;
  let fixture: ComponentFixture<LoginStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginStepperComponent]
    });
    fixture = TestBed.createComponent(LoginStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
