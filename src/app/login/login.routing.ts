import { Routes } from '@angular/router';

import { InicioComponent } from './inicio/inicio.component';
/*import { PricingComponent } from './pricing/pricing.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';*/

export const LoginRoutes: Routes = [

    {
        path: '',
        children: [ {
            path: 'inicio',
            component: InicioComponent
        }, /* {
            path: 'lock',
            component: LockComponent
        }, {
            path: 'register',
            component: RegisterComponent
        }, {
            path: 'pricing',
            component: PricingComponent
        }*/]
    }
];
