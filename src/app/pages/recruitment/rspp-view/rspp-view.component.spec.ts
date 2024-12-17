import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsppViewComponent } from './rspp-view.component';

describe('RsppViewComponent', () => {
  let component: RsppViewComponent;
  let fixture: ComponentFixture<RsppViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsppViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsppViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
