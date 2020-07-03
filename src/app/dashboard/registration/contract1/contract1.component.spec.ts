import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Contract1Component } from './contract1.component';

describe('Contract1Component', () => {
  let component: Contract1Component;
  let fixture: ComponentFixture<Contract1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Contract1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Contract1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
