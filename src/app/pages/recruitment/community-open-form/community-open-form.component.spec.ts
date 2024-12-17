import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityOpenFormComponent } from './community-open-form.component';

describe('CommunityOpenFormComponent', () => {
  let component: CommunityOpenFormComponent;
  let fixture: ComponentFixture<CommunityOpenFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityOpenFormComponent]
    });
    fixture = TestBed.createComponent(CommunityOpenFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
