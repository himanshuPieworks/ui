import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersUploadsComponent } from './members-uploads.component';

describe('MembersUploadsComponent', () => {
  let component: MembersUploadsComponent;
  let fixture: ComponentFixture<MembersUploadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembersUploadsComponent],
    });
    fixture = TestBed.createComponent(MembersUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
