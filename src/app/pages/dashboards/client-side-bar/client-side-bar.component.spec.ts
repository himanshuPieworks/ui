import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSideBarComponent } from './client-side-bar.component';

describe('ClientSideBarComponent', () => {
  let component: ClientSideBarComponent;
  let fixture: ComponentFixture<ClientSideBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientSideBarComponent]
    });
    fixture = TestBed.createComponent(ClientSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
