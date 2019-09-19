import { Routes } from '@angular/router';

import { ServicioComponent } from './servicio.component';
import { AgregarServicioComponent } from './agregar-servicio.component';
import { ModificarServicioComponent } from './modificar-servicio.component';

export const ServicioRoutes: Routes = [
  {

    path: '',
    children: [{
      path: '',
      component: ServicioComponent
    }]
  }, {
    path: '',
    children: [{
      path: 'agregar-servicio',
      component: AgregarServicioComponent
    }]
  },{
    path: '',
    children: [{
      path: 'modificar-servicio',
      component: ModificarServicioComponent
    }]
  }
];
