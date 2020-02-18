import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUpdateCampaignComponent } from './new-update-campaign.component';

describe('NewUpdateCampaignComponent', () => {
  let component: NewUpdateCampaignComponent;
  let fixture: ComponentFixture<NewUpdateCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUpdateCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUpdateCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
