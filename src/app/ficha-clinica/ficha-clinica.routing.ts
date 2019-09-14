import { Routes } from '@angular/router';

import { FichaClinicaComponent } from './ficha-clinica.component';
// import { AgregarReservaComponent } from './agregar-reserva.component';

export const FichaClinicaRoutes: Routes = [
  {

    path: '',
    children: [{
      path: '',
      component: FichaClinicaComponent
    }]
  }/*, {

    path: '',
    children: [{
      path: 'agregar-reserva',
      component: AgregarReservaComponent
    }]
  }*/
];
