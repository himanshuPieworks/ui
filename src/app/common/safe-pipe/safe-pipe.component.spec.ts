import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafePipeComponent } from './safe-pipe.component';

describe('SafePipeComponent', () => {
  let component: SafePipeComponent;
  let fixture: ComponentFixture<SafePipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafePipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafePipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
