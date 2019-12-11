import { Component, OnInit } from '@angular/core';
import { TableData } from '../../md/md-table/md-table.component';
import { NOTIFY } from '../../commons/app-utils';
import { HorarioService } from '../../services/horario.service';

declare const $: any;

@Component({
  selector: 'app-horario-atencion',
  templateUrl: './horario-atencion.component.html',
  styleUrls: ['./horario-atencion.component.css']
})
export class HorarioAtencionComponent implements OnInit {

  public tableData1: TableData;
  public tableBuscarCliente: TableData;

  idEmpleado: any;
  dia: any;
  horaApertura: any;
  horaCierre: any;
  intervalo: any;
  buscarClienteNombre: any;

  modificariIdPersonaHorarioAgenda: any;
  modificarIdEmpleado: any;
  modificarNombreEmpleado: any;
  modificarDia: any;
  modificarHoraApertura: any;
  modificarHoraCierre: any;
  modificarIntervalo: any;

  eliminarId: any;

  listaAtributos: Array<any>;
  listaEmpleados: Array<any>;
  listaHorarios: Array<any>;
  listaBuscarClientes: Array<any>;

  listaDias = [
    { value: '0', viewValue: 'Domingo' },
    { value: '1', viewValue: 'Lunes' },
    { value: '2', viewValue: 'Martes' },
    { value: '3', viewValue: 'Miércoles' },
    { value: '4', viewValue: 'Jueves' },
    { value: '5', viewValue: 'Viernes' },
    { value: '6', viewValue: 'Sábado' },
  ];

  constructor(private service: HorarioService, ) {
    this.tableData1 = {
      headerRow: ['Id', 'Id Esp.', 'Especialista', 'Día', 'Apertura', 'Cierre', 'Intervalo', 'Acciones'],
      dataRows: this.listaHorarios
    };
    this.tableBuscarCliente = {
      headerRow: ['Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarClientes
    };
  }
  /*-------------------------------------------------------------------------*/
  listarEmpleados() {
    this.service.listarEmpleados().subscribe(
      response => {
        this.listaEmpleados = new Array<any>();
        if (response.totalDatos > 0) {
          response.lista.forEach(persona => {
            if (/*persona.flagVendedor !== 'N' &&*/ persona.idLocalDefecto !== null) {
              this.listaEmpleados.push(
                {
                  idPersona: persona.idPersona,
                  nombreEmpleado: persona.nombreCompleto
                }
              );
            }
          });
        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  listarHorarioAtencion() {
    this.service.getHorarioAtencion().subscribe(
      response => {
        this.listaHorarios = new Array<any>();
        console.log('lista de horarios de atencion: ', response);
        if (response.totalDatos > 0) {
          response.lista.forEach(horario => {
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(horario.idPersonaHorarioAgenda); // 0
            // especialista
            this.listaAtributos.push(horario.idEmpleado.idPersona); // 1
            this.listaAtributos.push(horario.idEmpleado.nombreCompleto); // 2
            // dia
            this.listaAtributos.push(horario.diaCadena); // 3
            this.listaAtributos.push(horario.horaApertura); // 4
            this.listaAtributos.push(horario.horaCierre); // 5
            this.listaAtributos.push(horario.intervaloMinutos); // 6
            this.listaHorarios.push(this.listaAtributos);

            this.tableData1 = {
              headerRow: ['Id', 'Id Esp.', 'Especialista', 'Día', 'Apertura', 'Cierre', 'Intervalo', 'Acciones'],
              dataRows: this.listaHorarios
            };
          });
        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  agregar() {
    console.log('horario a agregar: ', this.idEmpleado, '', this.dia, '', this.horaApertura, '', this.horaCierre, '', this.intervalo);
    let aperturaString = this.horaApertura.toString();
    let aperturaCadena = aperturaString.split(':').join('');
    let cierreString = this.horaCierre.toString();
    let cierreCadena = cierreString.split(':').join('');
    console.log('horaAperturaCadena: ', aperturaCadena);
    console.log('horaCierreCadena: ', cierreCadena);
    let datos = {
      dia: this.dia,
      horaAperturaCadena: aperturaCadena,
      horaCierreCadena: cierreCadena,
      intervaloMinutos: this.intervalo,
      idEmpleado: {
        idPersona: this.idEmpleado
      }
    };
    this.service.agregarHorarioAtencion(datos).subscribe(
      response => {
        this.showNotification('Horario de atención creado con éxito!', NOTIFY.SUCCESS);
        this.listarHorarioAtencion();
        this.limpiarAgregar();
      },
      error => {
        this.showNotification('Error al crear horario de atención!', NOTIFY.DANGER);
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  cancelarAgregar() {
    this.idEmpleado = null;
    this.dia = null;
    this.horaApertura = null;
    this.horaCierre = null;
  }
  /*-------------------------------------------------------------------------*/
  abrirModalModificar(idHorario, idEmpleado, nombre, dia, apertura, cierre, minutos) {
    console.log('fila seleccionada: ', idHorario, '', idEmpleado, nombre, ' ', dia, ' ', apertura, ' ', cierre, '', minutos);
    this.modificariIdPersonaHorarioAgenda = idHorario;
    this.modificarIdEmpleado = idEmpleado;
    this.modificarNombreEmpleado = nombre;
    this.modificarDia = dia;
    this.modificarHoraApertura = apertura;
    this.modificarHoraCierre = cierre;
    this.modificarIntervalo = minutos;
    $('#exampleModal2').modal('show');
  }
  /*-------------------------------------------------------------------------*/
  modificar() {
    let aperturaString = this.modificarHoraApertura.toString();
    let aperturaCadena = aperturaString.split(':').join('');
    let cierreString = this.modificarHoraCierre.toString();
    let cierreCadena = cierreString.split(':').join('');
    console.log('horaAperturaCadena: ', aperturaCadena);
    console.log('horaCierreCadena: ', cierreCadena);
    let dato = {
      idPersonaHorarioAgenda: this.modificariIdPersonaHorarioAgenda,
      dia: this.modificarDia,
      horaAperturaCadena: aperturaCadena,
      horaCierreCadena: cierreCadena,
      intervaloMinutos: this.modificarIntervalo,
      idEmpleado: {
        idPersona: this.modificarIdEmpleado
      }
    };
    console.log('dato a modificar: ', dato);
    this.service.modificarHorarioAtencion(dato).subscribe(
      response => {
        console.log('lo creado: ', response);
        this.showNotification('Horario modificado con éxito!', NOTIFY.SUCCESS);
        this.listarHorarioAtencion();
        this.limpiarModificar();
      },
      error => {
        this.showNotification('Error al modificar horario', NOTIFY.DANGER);
        this.limpiarModificar();
      }
    );
  }

  /*-------------------------------------------------------------------------*/
  confirmarEliminar(id, desc) {
    $('#exampleModal3').modal('show');
    this.eliminarId = id;
  }
  /*-------------------------------------------------------------------------*/
  eliminar() {
    this.service.eliminarHorarioAtencion(this.eliminarId).subscribe(
      response => {
        this.showNotification('Horario de atención eliminado con éxito!', NOTIFY.SUCCESS);
        this.listarHorarioAtencion();
      },
      error => {
        this.showNotification('Error al eliminar horario', NOTIFY.DANGER);
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  listarClientePaginado(evento, buscarClienteNombre) {
    // getClienteBuscador  --- de servicio
    // getClienteBuscadorPaginado --- de servicio
    let filtros = '';
    if (buscarClienteNombre !== undefined && buscarClienteNombre !== null) {
      filtros = '?parametro=' + buscarClienteNombre;
    }
    this.service.getClienteBuscador(filtros).subscribe(
      response => {
        console.log('listarCliente en buscador(): ', response);
        this.listaHorarios = new Array<any>();
        console.log('lista de horarios de atencion: ', response);
        if (response.data.clientes.length > 0) {
          response.data.clientes.forEach(cliente => {
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(cliente.id); // 0
            // especialista
            this.listaAtributos.push(cliente.nombre +' '+cliente.apellido); // 1
            this.listaAtributos.push(cliente.nroDocumento); // 2
            this.listaAtributos.push(cliente.email); // 3
            // dia
         /*   
            this.listaAtributos.push(horario.horaApertura); // 4
            this.listaAtributos.push(horario.horaCierre); // 5
            this.listaAtributos.push(horario.intervaloMinutos); // 6*/
            this.listaHorarios.push(this.listaAtributos);

            this.tableBuscarCliente = {
              headerRow: ['Id', 'Nombre', 'Email'],
              dataRows: this.listaHorarios
            };
          });
        }

      });

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
  limpiarAgregar() {
    this.idEmpleado = null;
    this.dia = null;
    this.horaApertura = null;
    this.horaCierre = null;
    this.intervalo = null;
  }
  /*-------------------------------------------------------------------------*/
  limpiarModificar() {
    this.modificariIdPersonaHorarioAgenda = null;
    this.modificarIdEmpleado = null;
    this.modificarNombreEmpleado = null;
    this.modificarDia = null;
    this.modificarHoraApertura = null;
    this.modificarHoraCierre = null;
    this.modificarIntervalo = null;
  }
  /*-------------------------------------------------------------------------*/
  ngOnInit() {
    this.listaBuscarClientes = new Array<any>();
    this.listarEmpleados();
    this.listarHorarioAtencion();
  }

}
