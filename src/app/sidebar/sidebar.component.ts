import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';

declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [{
    path: '/dashboard',
    title: 'Dashboard',
    type: 'link',
    icontype: 'dashboard'
}, {
    path: '/administracion',
    title: 'Administración',
    type: 'sub',
    icontype: 'apps',
    collapse: 'administracion',
    children: [
        { path: 'cliente', title: 'Cliente', ab: 'C' },
        { path: 'concepto', title: 'Concepto de Uso de Puntos', ab: 'CUP' },
        { path: 'regla-asignacion', title: 'Reglas de Asignación', ab: 'RA' },
        { path: 'vencimiento-puntos', title: 'Vencimiento de Puntos', ab: 'VP' },


    ]
},/* {
        path: '/horario',
        title: 'Horarios',
        type: 'sub',
        icontype: 'schedule',
        collapse: 'horario',
        children: [
            {path: 'horario-atencion', title: 'Horario Atención', ab: 'HA'},
            {path: 'grid', title: 'Horario Excepción', ab: 'HE'}
        ]
    }, {
    path: '/ficha-clinica',
    title: 'Ficha Clínica',
    type: 'link',
    icontype: 'description'

},/* {
    path: '/reserva',
    title: 'Reserva',
    type: 'link',
    icontype: 'date_range'
}, {
    path: '/servicio',
    title: 'Facturación de servicios',
    type: 'link',
    icontype: 'monetization_on'

    }*/, {
        path: '/puntos',
        title: 'Uso de puntos',
        type: 'sub',
        icontype: 'schedule',
        collapse: 'components',
        children: [
            {path: 'carga-puntos', title: 'Carga de puntos', ab: 'CP'},
            {path: 'uso-puntos', title: 'Utilización de puntos', ab: 'UP'},
            {path: 'equivalencia', title: 'Equivalencia de puntos', ab:'EP'},
           /* {path: 'buttons', title: 'Buttons', ab:'B'},
            {path: 'grid', title: 'Grid System', ab:'GS'},
            {path: 'panels', title: 'Panels', ab:'P'},
            {path: 'sweet-alert', title: 'Sweet Alert', ab:'SA'},
            {path: 'notifications', title: 'Notifications', ab:'N'},
            {path: 'icons', title: 'Icons', ab:'I'},
            {path: 'typography', title: 'Typography', ab:'T'}*/
        ]
}, {
    path: '/reporte',
    title: 'Reportes',
    type: 'sub',
    icontype: 'content_paste',
    collapse: 'reporte',
    children: [
        { path: 'uso-punto-reporte', title: 'Rep. Uso de Puntos', ab: 'RUP' },
        { path: 'bolsa-punto-reporte', title: 'Rep. Bolsa de Puntos', ab: 'RBP' },
        { path: 'vencimiento-reporte', title: 'Rep. Vencimiento de Puntos', ab: 'RVP' }
    ]
}/*, {
    path: '/charts',
    title: 'Charts',
    type: 'link',
    icontype: 'timeline'

    }
        ]
            {path: 'user', title: 'User Page', ab:'UP'}
            {path: 'login', title: 'Login Page', ab:'LP'},
            {path: 'register', title: 'Register Page', ab:'RP'},
            {path: 'lock', title: 'Lock Screen Page', ab:'LSP'},
            {path: 'timeline', title: 'Timeline Page', ab:'TP'},
        children: [
            {path: 'pricing', title: 'Pricing', ab:'P'},
        collapse: 'pages',
        icontype: 'image',
        type: 'sub',
        title: 'Pages',
        path: '/pages',
    },{
        icontype: 'date_range'
        type: 'link',
        title: 'Calendar',
        path: '/calendar',
    },{*/
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ps: any;
    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            this.ps = new PerfectScrollbar(elemSidebar);
        }
    }
    updatePS(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this.ps.update();
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }
}
