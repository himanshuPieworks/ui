import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureFormComponent } from './future-form.component';

describe('FutureFormComponent', () => {
  let component: FutureFormComponent;
  let fixture: ComponentFixture<FutureFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FutureFormComponent]
    });
    fixture = TestBed.createComponent(FutureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
