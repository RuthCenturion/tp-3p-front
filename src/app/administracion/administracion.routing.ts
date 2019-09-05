import { Routes } from '@angular/router';

import { CategoriaComponent } from './categoria/categoria.component';
import { SubCategoriaComponent } from './subcategoria/subcategoria.component';
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
    }/*,
    {
      path: '',
      children: [ {
        path: 'icons',
        component: IconsComponent
        }]
    },
    {
        path: '',
        children: [ {
            path: 'notifications',
            component: NotificationsComponent
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
