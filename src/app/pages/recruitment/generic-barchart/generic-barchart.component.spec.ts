import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericBarchartComponent } from './generic-barchart.component';

describe('GenericBarchartComponent', () => {
  let component: GenericBarchartComponent;
  let fixture: ComponentFixture<GenericBarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericBarchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
