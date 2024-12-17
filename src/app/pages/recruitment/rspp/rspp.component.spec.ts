import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsppComponent } from './rspp.component';

describe('RsppComponent', () => {
  let component: RsppComponent;
  let fixture: ComponentFixture<RsppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RsppComponent]
    });
    fixture = TestBed.createComponent(RsppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
