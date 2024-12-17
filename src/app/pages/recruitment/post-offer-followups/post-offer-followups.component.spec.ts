import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOfferFollowupsComponent } from './post-offer-followups.component';

describe('PostOfferFollowupsComponent', () => {
  let component: PostOfferFollowupsComponent;
  let fixture: ComponentFixture<PostOfferFollowupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostOfferFollowupsComponent]
    });
    fixture = TestBed.createComponent(PostOfferFollowupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
