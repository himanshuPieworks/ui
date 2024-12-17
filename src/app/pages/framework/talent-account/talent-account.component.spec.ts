import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentAccountComponent } from './talent-account.component';

describe('TalentAccountComponent', () => {
  let component: TalentAccountComponent;
  let fixture: ComponentFixture<TalentAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TalentAccountComponent]
    });
    fixture = TestBed.createComponent(TalentAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
