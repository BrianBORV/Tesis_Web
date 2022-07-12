import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoCComponent } from './proyecto-c.component';

describe('ProyectoCComponent', () => {
  let component: ProyectoCComponent;
  let fixture: ComponentFixture<ProyectoCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectoCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectoCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
