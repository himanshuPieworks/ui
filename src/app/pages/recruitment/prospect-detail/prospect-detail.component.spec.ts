import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectDetailComponent } from './prospect-detail.component';

describe('ProspectDetailComponent', () => {
  let component: ProspectDetailComponent;
  let fixture: ComponentFixture<ProspectDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProspectDetailComponent]
    });
    fixture = TestBed.createComponent(ProspectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
