import { Routes } from '@angular/router';

import { FichaClinicaComponent } from './ficha-clinica.component';
 import { AgregarFichaComponent } from './agregar-ficha.component';

export const FichaClinicaRoutes: Routes = [
  {

    path: '',
    children: [{
      path: '',
      component: FichaClinicaComponent
    }]
  }, {

    path: '',
    children: [{
      path: 'agregar-ficha',
      component: AgregarFichaComponent
    }]
  }
];
