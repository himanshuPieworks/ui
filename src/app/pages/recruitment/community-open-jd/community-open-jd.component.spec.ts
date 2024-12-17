import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityOpenJDComponent } from './community-open-jd.component';

describe('CommunityOpenJDComponent', () => {
  let component: CommunityOpenJDComponent;
  let fixture: ComponentFixture<CommunityOpenJDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityOpenJDComponent]
    });
    fixture = TestBed.createComponent(CommunityOpenJDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
