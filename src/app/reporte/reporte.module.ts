import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';
import { UsoPuntoReporteComponent } from './uso-punto-reporte/uso-punto-reporte.component';
import { ReporteRoutes } from './reporte.routing';
import { BolsaPuntoReporteComponent } from './bolsa-punto-reporte/bolsa-punto-reporte.component';
import { VencimientoReporteComponent } from './vencimiento-reporte/vencimiento-reporte.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReporteRoutes),
    FormsModule,
    MaterialModule
  ],
  declarations: [
      UsoPuntoReporteComponent,
      BolsaPuntoReporteComponent,
      VencimientoReporteComponent
  ],
  entryComponents: [],
})

export class ReporteModule {}
