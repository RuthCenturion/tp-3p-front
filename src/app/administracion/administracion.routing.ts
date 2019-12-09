import { Routes } from '@angular/router';

import { CategoriaComponent } from './categoria/categoria.component';
import { SubCategoriaComponent } from './subcategoria/subcategoria.component';
import { ServicioComponent } from './servicio/servicio.component';
import { PacienteComponent } from './paciente/paciente.component';
/*import { GridSystemComponent } from './grid/grid.component';
import { IconsComponent } from './icons/icons.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PanelsComponent } from './panels/panels.component';
import { SweetAlertComponent } from './sweetalert/sweetalert.component';
import { TypographyComponent } from './typography/typography.component';*/


export const AdministracionRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'categoria',
        component: CategoriaComponent
    }]},
    {
    path: '',
    children: [ {
      path: 'subcategoria',
      component: SubCategoriaComponent
    }]
    },
    {
      path: '',
      children: [ {
        path: 'concepto',
        component: ServicioComponent
        }]
    },
    {
        path: '',
        children: [ {
            path: 'cliente',
            component: PacienteComponent
        }]
    }, /*{
        path: '',
        children: [ {
            path: 'panels',
            component: PanelsComponent
        }]
    }, {
        path: '',
        children: [ {
            path: 'sweet-alert',
            component: SweetAlertComponent
        }]
    }, {
        path: '',
        children: [ {
            path: 'typography',
            component: TypographyComponent
        }]
    }*/
];
