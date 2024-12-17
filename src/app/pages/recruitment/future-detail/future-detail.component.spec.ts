import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureDetailComponent } from './future-detail.component';

describe('FutureDetailComponent', () => {
  let component: FutureDetailComponent;
  let fixture: ComponentFixture<FutureDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FutureDetailComponent]
    });
    fixture = TestBed.createComponent(FutureDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
