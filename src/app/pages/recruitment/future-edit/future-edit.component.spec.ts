import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureEditComponent } from './future-edit.component';

describe('FutureEditComponent', () => {
  let component: FutureEditComponent;
  let fixture: ComponentFixture<FutureEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FutureEditComponent]
    });
    fixture = TestBed.createComponent(FutureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
