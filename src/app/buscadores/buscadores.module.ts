import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { EmpleadoComponent } from './empleado/empleado.component';
import { BuscadoresRoutes } from './buscadores.routing';
/*import { ModalComponent } from './modal/modal.component';
import { SubCategoriaComponent } from './subcategoria/subcategoria.component';
import { ServicioComponent } from './servicio/servicio.component';
import { PacienteComponent } from './paciente/paciente.component';*/
/*import { GridSystemComponent } from './grid/grid.component';
import { IconsComponent } from './icons/icons.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PanelsComponent } from './panels/panels.component';
import { SweetAlertComponent } from './sweetalert/sweetalert.component';
import { TypographyComponent } from './typography/typography.component';*/

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(BuscadoresRoutes),
    FormsModule,
    MaterialModule
  ],
  declarations: [
      EmpleadoComponent,
      /*ModalComponent,
      SubCategoriaComponent,
      ServicioComponent,
      PacienteComponent,
      GridSystemComponent,
      IconsComponent,
      NotificationsComponent,
      PanelsComponent,
      SweetAlertComponent,
      TypographyComponent*/
  ],
  entryComponents: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class BuscadoresModule {}
