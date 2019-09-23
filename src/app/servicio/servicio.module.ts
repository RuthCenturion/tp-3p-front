import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { ServicioComponent } from './servicio.component';
import { ServicioRoutes } from './servicio.routing';
import { AgregarServicioComponent } from './agregar-servicio.component';
import { ModificarServicioComponent } from './modificar-servicio.component';

@NgModule({
    imports: [
        RouterModule.forChild(ServicioRoutes),
        CommonModule,
        FormsModule,
        MaterialModule
    ],
    declarations: [
        ServicioComponent,
        AgregarServicioComponent,
        ModificarServicioComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class ServicioModule {}
