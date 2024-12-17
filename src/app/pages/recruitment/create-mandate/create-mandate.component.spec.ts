import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMandateComponent } from './create-mandate.component';

describe('CreateMandateComponent', () => {
  let component: CreateMandateComponent;
  let fixture: ComponentFixture<CreateMandateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMandateComponent]
    });
    fixture = TestBed.createComponent(CreateMandateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
