import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrototipoComponent } from './prototipo.component';

describe('PrototipoComponent', () => {
  let component: PrototipoComponent;
  let fixture: ComponentFixture<PrototipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrototipoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrototipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
