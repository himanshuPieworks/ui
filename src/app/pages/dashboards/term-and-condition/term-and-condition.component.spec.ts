import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermAndConditionComponent } from './term-and-condition.component';

describe('TermAndConditionComponent', () => {
  let component: TermAndConditionComponent;
  let fixture: ComponentFixture<TermAndConditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermAndConditionComponent]
    });
    fixture = TestBed.createComponent(TermAndConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
