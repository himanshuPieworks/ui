import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStepperPropsComponent } from './my-stepper-props.component';

describe('MyStepperPropsComponent', () => {
  let component: MyStepperPropsComponent;
  let fixture: ComponentFixture<MyStepperPropsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyStepperPropsComponent]
    });
    fixture = TestBed.createComponent(MyStepperPropsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
