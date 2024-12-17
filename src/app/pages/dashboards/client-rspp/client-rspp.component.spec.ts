import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRsppComponent } from './client-rspp.component';

describe('ClientRsppComponent', () => {
  let component: ClientRsppComponent;
  let fixture: ComponentFixture<ClientRsppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientRsppComponent]
    });
    fixture = TestBed.createComponent(ClientRsppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
