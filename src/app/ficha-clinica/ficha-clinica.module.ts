import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { FichaClinicaComponent } from './ficha-clinica.component';
// import { AgregarReservaComponent } from './agregar-reserva.component';
import { FichaClinicaRoutes } from './ficha-clinica.routing';
import { AgregarFichaComponent } from './agregar-ficha.component';

@NgModule({
    imports: [
        RouterModule.forChild(FichaClinicaRoutes),
        CommonModule,
        FormsModule,
        MaterialModule
    ],
    declarations: [
        FichaClinicaComponent,
        AgregarFichaComponent,
       // AgregarReservaComponent
    ]
})

export class FichaClinicaModule {}
