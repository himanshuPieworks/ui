import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDipstickComponent } from './client-dipstick.component';

describe('ClientDipstickComponent', () => {
  let component: ClientDipstickComponent;
  let fixture: ComponentFixture<ClientDipstickComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDipstickComponent]
    });
    fixture = TestBed.createComponent(ClientDipstickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
