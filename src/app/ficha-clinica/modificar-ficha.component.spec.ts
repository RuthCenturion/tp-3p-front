import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarFichaComponent } from './modificar-ficha.component';

describe('ModificarFichaComponent', () => {
  let component: ModificarFichaComponent;
  let fixture: ComponentFixture<ModificarFichaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarFichaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
