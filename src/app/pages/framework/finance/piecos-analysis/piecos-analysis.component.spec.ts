import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiecosAnalysisComponent } from './piecos-analysis.component';

describe('PiecosAnalysisComponent', () => {
  let component: PiecosAnalysisComponent;
  let fixture: ComponentFixture<PiecosAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiecosAnalysisComponent]
    });
    fixture = TestBed.createComponent(PiecosAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
