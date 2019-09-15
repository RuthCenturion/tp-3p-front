import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FichaClinicaService } from '../services/ficha-clinica.service';
import { NOTIFY } from '../commons/app-utils';

declare const $: any;


declare interface DatoModificar {
  idFicha: string;
  fechaFicha: string;
  idEmpleado: string;
  nombreEmpleado: string;
  idCliente: string;
  nombreCliente: string;
  idCategoria: string;
  descripcionCategoria: string;
  idSubCategoria: string;
  descripcionSubCategoria: string;
  motivo: string;
  diagnostico: string;
  observacion: string;
}

@Component({
  selector: 'app-modificar-ficha',
  templateUrl: './modificar-ficha.component.html',
  styleUrls: ['./ficha-clinica.component.css']
})

export class ModificarFichaComponent implements OnInit {

  idFicha: string;
  fechaFicha: string;
  idEmpleado: string;
  nombreEmpleado: string;
  idCliente: string;
  nombreCliente: string;
  idCategoria: string;
  descripcionCategoria: string;
  idSubCategoria: string;
  descripcionSubCategoria: string;
  motivo: any;
  diagnostico: any;
  observacion: any;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: FichaClinicaService ) { }
   /*-------------------------------------------------------------------------*/
   modificarFicha() {
      let dato: any = {
        idFichaClinica: this.idFicha,
        observacion: this.observacion
      };
      this.service.modificarFicha(dato).subscribe(
        response => {
          console.log('modificarFicha(): ', response);
          this.showNotification('Modificación de la ficha con éxito!', NOTIFY.SUCCESS);
          this.cancelarModificar();
        },
        error => {
          this.showNotification('Error al modificar la ficha. Consulte con soporte', NOTIFY.WARNING);
        }
      );
   }
  /*-------------------------------------------------------------------------*/
  cancelarModificar() {
    this.router.navigate(['ficha-clinica']);
  }
  /*-------------------------------------------------------------------------*/
  showNotification(mensaje: any, color: any) {
    const type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    $.notify({
      icon: 'notifications',
      message: mensaje
    }, {
      type: type[color],
      timer: 3000,
      placement: {
        from: 'top',
        align: 'right'
      },
      template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
        // tslint:disable-next-line: max-line-length
        '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
        '<i class="material-icons" data-notify="icon">notifications</i> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
        // tslint:disable-next-line: max-line-length
        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
  }
  /*-------------------------------------------------------------------------*/
  /*-------------------------------------------------------------------------*/
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idFicha = params.idFicha;
      this.fechaFicha = params.fechaFicha;
      this.idEmpleado = params.idEmpleado;
      this.nombreEmpleado = params.nombreEmpleado;
      this.idCliente = params.idCliente;
      this.nombreCliente = params.nombreCliente;
      this.idCategoria = params.idCategoria;
      this.descripcionCategoria = params.descripcionCategoria;
      this.idSubCategoria = params.idSubCategoria;
      this.descripcionSubCategoria = params.descripcionSubCategoria;
      this.motivo = params.motivo;
      this.diagnostico = params.diagnostico;
      this.observacion = params.observacion;
    }
    );
  }

}
