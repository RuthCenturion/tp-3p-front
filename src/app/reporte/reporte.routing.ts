import { Routes } from '@angular/router';
import { UsoPuntoReporteComponent } from './uso-punto-reporte/uso-punto-reporte.component';
import { BolsaPuntoReporteComponent } from './bolsa-punto-reporte/bolsa-punto-reporte.component';
import { VencimientoReporteComponent } from './vencimiento-reporte/vencimiento-reporte.component';


export const ReporteRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'uso-punto-reporte',
            component: UsoPuntoReporteComponent
        }]
    }, {
        path: '',
        children: [{
            path: 'bolsa-punto-reporte',
            component: BolsaPuntoReporteComponent
        }]
    }, {
        path: '',
        children: [{
            path: 'vencimiento-reporte',
            component: VencimientoReporteComponent
        }]
    }
];
