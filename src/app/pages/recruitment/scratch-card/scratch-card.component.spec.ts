import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScratchCardComponent } from './scratch-card.component';

describe('ScratchCardComponent', () => {
  let component: ScratchCardComponent;
  let fixture: ComponentFixture<ScratchCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScratchCardComponent]
    });
    fixture = TestBed.createComponent(ScratchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
