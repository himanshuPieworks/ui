import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentConnectsComponent } from './talent-connects.component';

describe('TalentConnectsComponent', () => {
  let component: TalentConnectsComponent;
  let fixture: ComponentFixture<TalentConnectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TalentConnectsComponent]
    });
    fixture = TestBed.createComponent(TalentConnectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
