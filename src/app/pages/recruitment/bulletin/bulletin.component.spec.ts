import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinComponent } from './bulletin.component';

describe('BulletinComponent', () => {
  let component: BulletinComponent;
  let fixture: ComponentFixture<BulletinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulletinComponent]
    });
    fixture = TestBed.createComponent(BulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
