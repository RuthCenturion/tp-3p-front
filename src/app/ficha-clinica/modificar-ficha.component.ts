import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FichaClinicaService } from '../services/ficha-clinica.service';
import { NOTIFY } from '../commons/app-utils';
import { TableData } from '../md/md-table/md-table.component';

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
  public tableData3: TableData;

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
  listaServicios: Array<any>;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: FichaClinicaService ) {
      this.listaServicios = [];
      this.tableData3 = {
        headerRow: [ 'ID', 'Fecha',  'Presupuesto', 'Observacion', 'Acciones' ],
        dataRows: this.listaServicios
      };
     }
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
  verServicio(a, b, c, d) {
    console.log('lo seleccionado para verServicio: ', a, b, c, d);
  }
   /*-------------------------------------------------------------------------*/
  editarServicio(servicioSeleccionado) {
    console.log('lo seleccionado para editarServicio: ', servicioSeleccionado);
    let modificar = new Array<any>();
    modificar.push(servicioSeleccionado[0]); // idServicio
    modificar.push(servicioSeleccionado[1]); // fechaServicio
    modificar.push(this.idFicha); // 2
    modificar.push(this.fechaFicha); // 3
    modificar.push(this.idEmpleado); // 4
    modificar.push(this.nombreEmpleado); // 5
    modificar.push(this.idCliente); // 6
    modificar.push(this.nombreCliente); // 7
    modificar.push(this.idCategoria); // 8
    modificar.push(this.descripcionCategoria); // 9
    modificar.push(this.idSubCategoria); // 10
    modificar.push(this.descripcionSubCategoria); // 11
    modificar.push(servicioSeleccionado[3]); // 12 observacion del servicio
    modificar.push(this.motivo); // 13
    modificar.push(this.diagnostico); // 14
    modificar.push(this.observacion); // 15 observacion de la ficha
    modificar.push('F'); // 16 indicador para retornar a modificarFicha()
    this.router.navigate(['servicio/modificar-servicio', modificar]);

  }
   /*-------------------------------------------------------------------------*/
   pruebaUnaSolaSeleccion(row) { // se envia toda la fila como array
    console.log('fila seleccionada: ', row);
   }
  /*-------------------------------------------------------------------------*/
  listarServiciosAsociados() {
    let url = '{"idFichaClinica":{"idFichaClinica":' + this.idFicha + '}}';
    let path = encodeURIComponent(url);
    path = '?ejemplo=' + path;
      this.service.getServiciosAsociados(path).subscribe(
        response => {
          console.log('listaTotal de servicios', response.lista);
          if(response.totalDatos > 0) {
            this.listaServicios = new Array<any>();
            console.log('listaTotal de servicios', response.lista);
            response.lista.forEach(servicio => {
              let lista = new Array<any>();
              lista.push(servicio.idServicio);
              lista.push(servicio.fechaHora);
              lista.push(servicio.presupuesto);
              lista.push(servicio.observacion);
              this.listaServicios.push(lista);

              this.tableData3 = {
                headerRow: [ 'ID', 'Fecha',  'Presupuesto', 'Observacion', 'Acciones' ],
                dataRows: this.listaServicios
              };
            });
          }
        }
      );
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
      
    });
    
    this.listarServiciosAsociados();

    }

}
