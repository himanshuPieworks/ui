import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentOverviewComponent } from './talent-overview.component';

describe('TalentOverviewComponent', () => {
  let component: TalentOverviewComponent;
  let fixture: ComponentFixture<TalentOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TalentOverviewComponent]
    });
    fixture = TestBed.createComponent(TalentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
