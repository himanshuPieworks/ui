import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiecosStatementComponent } from './piecos-statement.component';

describe('PiecosStatementComponent', () => {
  let component: PiecosStatementComponent;
  let fixture: ComponentFixture<PiecosStatementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiecosStatementComponent]
    });
    fixture = TestBed.createComponent(PiecosStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
