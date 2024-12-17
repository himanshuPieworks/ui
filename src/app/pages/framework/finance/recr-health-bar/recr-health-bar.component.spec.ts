import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecrHealthBarComponent } from './recr-health-bar.component';

describe('RecrHealthBarComponent', () => {
  let component: RecrHealthBarComponent;
  let fixture: ComponentFixture<RecrHealthBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecrHealthBarComponent]
    });
    fixture = TestBed.createComponent(RecrHealthBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
