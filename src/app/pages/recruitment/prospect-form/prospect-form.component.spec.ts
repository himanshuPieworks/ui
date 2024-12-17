import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectFormComponent } from './prospect-form.component';

describe('ProspectFormComponent', () => {
  let component: ProspectFormComponent;
  let fixture: ComponentFixture<ProspectFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProspectFormComponent]
    });
    fixture = TestBed.createComponent(ProspectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
