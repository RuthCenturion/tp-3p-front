import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { ReservaComponent } from './reserva.component';
import { ReservaRoutes } from './reserva.routing';

@NgModule({
    imports: [
        RouterModule.forChild(ReservaRoutes),
        CommonModule,
        FormsModule,
        MaterialModule
    ],
    declarations: [ReservaComponent]
})

export class ReservaModule {}
