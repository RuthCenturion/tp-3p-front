import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { CategoriaComponent } from './categoria/categoria.component';
import { AdministracionRoutes } from './administracion.routing';
import { ModalComponent } from './modal/modal.component';
/*import { GridSystemComponent } from './grid/grid.component';
import { IconsComponent } from './icons/icons.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PanelsComponent } from './panels/panels.component';
import { SweetAlertComponent } from './sweetalert/sweetalert.component';
import { TypographyComponent } from './typography/typography.component';*/

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdministracionRoutes),
    FormsModule,
    MaterialModule
  ],
  declarations: [
      CategoriaComponent,
      ModalComponent,
      /*GridSystemComponent,
      IconsComponent,
      NotificationsComponent,
      PanelsComponent,
      SweetAlertComponent,
      TypographyComponent*/
  ],
  entryComponents: [ModalComponent],
})

export class AdministracionModule {}
