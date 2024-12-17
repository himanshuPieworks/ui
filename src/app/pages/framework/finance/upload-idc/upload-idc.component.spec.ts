import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadIdcComponent } from './upload-idc.component';

describe('UploadIdcComponent', () => {
  let component: UploadIdcComponent;
  let fixture: ComponentFixture<UploadIdcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadIdcComponent]
    });
    fixture = TestBed.createComponent(UploadIdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
