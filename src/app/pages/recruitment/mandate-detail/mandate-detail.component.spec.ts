import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateDetailComponent } from './mandate-detail.component';

describe('MandateDetailComponent', () => {
  let component: MandateDetailComponent;
  let fixture: ComponentFixture<MandateDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MandateDetailComponent]
    });
    fixture = TestBed.createComponent(MandateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
