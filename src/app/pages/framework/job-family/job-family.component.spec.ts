import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobFamilyComponent } from './job-family.component';

describe('JobFamilyComponent', () => {
  let component: JobFamilyComponent;
  let fixture: ComponentFixture<JobFamilyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobFamilyComponent]
    });
    fixture = TestBed.createComponent(JobFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
