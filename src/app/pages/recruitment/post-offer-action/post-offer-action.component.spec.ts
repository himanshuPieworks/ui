import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOfferActionComponent } from './post-offer-action.component';

describe('PostOfferActionComponent', () => {
  let component: PostOfferActionComponent;
  let fixture: ComponentFixture<PostOfferActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostOfferActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostOfferActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
