import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarFichaComponent } from './agregar-ficha.component';

describe('AgregarFichaComponent', () => {
  let component: AgregarFichaComponent;
  let fixture: ComponentFixture<AgregarFichaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarFichaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
