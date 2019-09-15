import { Routes } from '@angular/router';

import { ServicioComponent } from './servicio.component';
 /*import { AgregarFichaComponent } from './agregar-ficha.component';
 import { ModificarFichaComponent } from './modificar-ficha.component';*/

export const ServicioRoutes: Routes = [
  {

    path: '',
    children: [{
      path: '',
      component: ServicioComponent
    }]
  }/*, {
    path: '',
    children: [{
      path: 'agregar-ficha',
      component: AgregarFichaComponent
    }]
  }, {
    path: '',
    children: [{
      path: 'modificar-ficha',
      component: ModificarFichaComponent
    }]
  }*/
];
