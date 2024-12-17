import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDipstickComponent } from './candidate-dipstick.component';

describe('CandidateDipstickComponent', () => {
  let component: CandidateDipstickComponent;
  let fixture: ComponentFixture<CandidateDipstickComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateDipstickComponent]
    });
    fixture = TestBed.createComponent(CandidateDipstickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
