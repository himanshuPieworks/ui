import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverTalentComponent } from './discover-talent.component';

describe('DiscoverTalentComponent', () => {
  let component: DiscoverTalentComponent;
  let fixture: ComponentFixture<DiscoverTalentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoverTalentComponent]
    });
    fixture = TestBed.createComponent(DiscoverTalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
