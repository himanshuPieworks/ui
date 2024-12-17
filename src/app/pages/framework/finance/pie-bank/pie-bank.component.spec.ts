import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieBankComponent } from './pie-bank.component';

describe('PieBankComponent', () => {
  let component: PieBankComponent;
  let fixture: ComponentFixture<PieBankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PieBankComponent]
    });
    fixture = TestBed.createComponent(PieBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
