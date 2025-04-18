import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSlideComponent } from './info-slide.component';

describe('InfoSlideComponent', () => {
  let component: InfoSlideComponent;
  let fixture: ComponentFixture<InfoSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoSlideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
