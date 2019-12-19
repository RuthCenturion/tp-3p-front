import { Component } from '@angular/core';

import { NOTIFY } from '../../commons/app-utils';
import { HorarioService } from '../../services/horario.service';

declare var $: any;

@Component({
    selector: 'app-regularforms-cmp',
    templateUrl: 'regularforms.component.html'
})

export class RegularFormsComponent {
    montoEquivalencia: any;
    equivalente: any;


    constructor(private service: HorarioService,){

    }

    consultar(){
        this.equivalente = '';
        console.log('montoEquivalencia: ', this.montoEquivalencia);
        this.service.consultarEquivalencia(this.montoEquivalencia).subscribe(
            response =>{
                if(response.status === 0){
                    this.equivalente = response.data.punto;
                } else {
                    this.equivalente = response.message;
                }
            }
        );
    }

     /*-------------------------------------------------------------------------*/
     limpiar(){
         this.montoEquivalencia = null;
         this.equivalente = '';
     }
}
