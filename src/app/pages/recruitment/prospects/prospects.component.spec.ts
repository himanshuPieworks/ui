import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectsComponent } from './prospects.component';

describe('ProspectsComponent', () => {
  let component: ProspectsComponent;
  let fixture: ComponentFixture<ProspectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProspectsComponent]
    });
    fixture = TestBed.createComponent(ProspectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
