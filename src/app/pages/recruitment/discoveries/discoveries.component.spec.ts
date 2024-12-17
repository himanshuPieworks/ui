import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveriesComponent } from './discoveries.component';

describe('DiscoveriesComponent', () => {
  let component: DiscoveriesComponent;
  let fixture: ComponentFixture<DiscoveriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveriesComponent]
    });
    fixture = TestBed.createComponent(DiscoveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
