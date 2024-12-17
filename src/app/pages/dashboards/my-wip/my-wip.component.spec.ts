import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWipComponent } from './my-wip.component';

describe('MyWipComponent', () => {
  let component: MyWipComponent;
  let fixture: ComponentFixture<MyWipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyWipComponent]
    });
    fixture = TestBed.createComponent(MyWipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
