import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FOTAComponent } from './fota.component';

describe('FOTAComponent', () => {
  let component: FOTAComponent;
  let fixture: ComponentFixture<FOTAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FOTAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FOTAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
