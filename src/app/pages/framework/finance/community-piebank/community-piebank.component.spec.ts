import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityPiebankComponent } from './community-piebank.component';

describe('CommunityPiebankComponent', () => {
  let component: CommunityPiebankComponent;
  let fixture: ComponentFixture<CommunityPiebankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityPiebankComponent]
    });
    fixture = TestBed.createComponent(CommunityPiebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
