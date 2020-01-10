import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormSlotComponent} from './form-slot.component';

describe('FormSlotComponent', () => {
  let component: FormSlotComponent;
  let fixture: ComponentFixture<FormSlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
