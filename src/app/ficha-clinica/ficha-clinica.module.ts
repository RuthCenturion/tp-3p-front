import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { FichaClinicaComponent } from './ficha-clinica.component';
// import { AgregarReservaComponent } from './agregar-reserva.component';
import { FichaClinicaRoutes } from './ficha-clinica.routing';

@NgModule({
    imports: [
        RouterModule.forChild(FichaClinicaRoutes),
        CommonModule,
        FormsModule,
        MaterialModule
    ],
    declarations: [
        FichaClinicaComponent,
       // AgregarReservaComponent
    ]
})

export class FichaClinicaModule {}
