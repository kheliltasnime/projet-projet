import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopiComponent } from './popi.component';

describe('PopiComponent', () => {
  let component: PopiComponent;
  let fixture: ComponentFixture<PopiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopiComponent]
    });
    fixture = TestBed.createComponent(PopiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
