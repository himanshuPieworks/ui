import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHiringOverviewComponent } from './client-hiring-overview.component';

describe('ClientHiringOverviewComponent', () => {
  let component: ClientHiringOverviewComponent;
  let fixture: ComponentFixture<ClientHiringOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientHiringOverviewComponent]
    });
    fixture = TestBed.createComponent(ClientHiringOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
