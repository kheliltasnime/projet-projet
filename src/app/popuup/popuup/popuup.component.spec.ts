import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopuupComponent } from './popuup.component';

describe('PopuupComponent', () => {
  let component: PopuupComponent;
  let fixture: ComponentFixture<PopuupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopuupComponent]
    });
    fixture = TestBed.createComponent(PopuupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
