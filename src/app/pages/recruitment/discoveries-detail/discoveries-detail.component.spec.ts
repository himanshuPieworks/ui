import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveriesDetailComponent } from './discoveries-detail.component';

describe('DiscoveriesDetailComponent', () => {
  let component: DiscoveriesDetailComponent;
  let fixture: ComponentFixture<DiscoveriesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveriesDetailComponent]
    });
    fixture = TestBed.createComponent(DiscoveriesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
