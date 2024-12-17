import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarnComponent } from './earn.component';

describe('EarnComponent', () => {
  let component: EarnComponent;
  let fixture: ComponentFixture<EarnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EarnComponent]
    });
    fixture = TestBed.createComponent(EarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
