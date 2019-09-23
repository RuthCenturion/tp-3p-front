import { Routes } from '@angular/router';

import { EmpleadoComponent } from './empleado/empleado.component';
/*import { SubCategoriaComponent } from './subcategoria/subcategoria.component';
import { ServicioComponent } from './servicio/servicio.component';
import { PacienteComponent } from './paciente/paciente.component';*/
/*import { GridSystemComponent } from './grid/grid.component';
import { IconsComponent } from './icons/icons.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PanelsComponent } from './panels/panels.component';
import { SweetAlertComponent } from './sweetalert/sweetalert.component';
import { TypographyComponent } from './typography/typography.component';*/


export const BuscadoresRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'empleado',
        component: EmpleadoComponent
    }]},/*
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
        path: 'servicio',
        component: ServicioComponent
        }]
    },
    {
        path: '',
        children: [ {
            path: 'paciente',
            component: PacienteComponent
        }]
    }, {
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
