import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataserviceComponent } from './dataservice.component';

describe('DataserviceComponent', () => {
  let component: DataserviceComponent;
  let fixture: ComponentFixture<DataserviceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataserviceComponent]
    });
    fixture = TestBed.createComponent(DataserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
