import { Routes } from '@angular/router';

import { ReservaComponent } from './reserva.component';

export const ReservaRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ReservaComponent
    }]
}
];
