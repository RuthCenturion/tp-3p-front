import { Routes } from '@angular/router';

import { ReservaComponent } from './reserva.component';
import { AgregarReservaComponent } from './agregar-reserva.component';

export const ReservaRoutes: Routes = [
  {

    path: '',
    children: [{
      path: '',
      component: ReservaComponent
    }]
  }, {

    path: '',
    children: [{
      path: 'agregar-reserva',
      component: AgregarReservaComponent
    }]
  }
];
