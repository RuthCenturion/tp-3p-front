import { Component, OnInit } from '@angular/core';
import { TableData } from '../../md/md-table/md-table.component';
import { NOTIFY } from '../../commons/app-utils';
import { HorarioService } from '../../services/horario.service';

declare const $: any;

@Component({
  selector: 'app-horario-excepcion',
  templateUrl: './horario-excepcion.component.html',
  styleUrls: ['./horario-excepcion.component.css']
})
export class HorarioExcepcionComponent implements OnInit {

  public tableData1: TableData;

  idHorarioExcepcion: any;
  idEmpleado: any;
  nombreEmpleado: any;
  fecha: any;
  horaApertura: any;
  horaCierre: any;
  flagEsHabilitar: any;
  intervalo: any;

  mostrarHoras: any;

  aperturaSeleccionada: any;
  cierreSeleccionado: any;
  modificarIdHorarioExcepcion: any;
  modificarIdEmpleado: any;
  modificarNombreEmpleado: any;
  modificarFecha: any;
  modificarHoraApertura: any;
  modificarHoraCierre: any;
  modificarFlagEsHabilitar: any;
  modificarIntervalo: any;

  eliminarId: any;

  listaAtributos: Array<any>;
  listaEmpleados: Array<any>;
  listaHorarios: Array<any>;

  constructor(private service: HorarioService, ) {
    this.tableData1 = {
      headerRow: ['Id', 'Id Esp.', 'Especialista', 'Fecha', 'Apertura', 'Cierre', 'Habilitado', 'Intervalo', 'Acciones'],
      dataRows: this.listaHorarios
    };
  }
  opciones = [
    { value: 'S', viewValue: 'Habilitar atención' },
    { value: 'N', viewValue: 'No habilitar atención' },
  ];
  /*-------------------------------------------------------------------------*/
  listarEmpleados() {
    this.service.listarEmpleados().subscribe(
      response => {
        console.log('lista persona/empleado:', response);
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
  listarHorarioExcepcion() {
    this.service.getHorarioExcepcion().subscribe(
      response => {
        this.listaHorarios = new Array<any>();
        console.log('lista de horarios de Excepcion: ', response);
        if (response.totalDatos > 0) {
          response.lista.forEach(horario => {
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(horario.idHorarioExcepcion); // 0
            // especialista
            this.listaAtributos.push(horario.idEmpleado.idPersona); // 1
            this.listaAtributos.push(horario.idEmpleado.nombreCompleto); // 2
            // fecha
            this.listaAtributos.push(horario.fecha); // 3
            this.listaAtributos.push(horario.horaApertura); // 4
            this.listaAtributos.push(horario.horaCierre); // 5
            this.listaAtributos.push(horario.flagEsHabilitar); // 6
            this.listaAtributos.push(horario.intervaloMinutos); // 7

            this.listaHorarios.push(this.listaAtributos);

            this.tableData1 = {
              headerRow: ['Id', 'Id Esp.', 'Especialista', 'Fecha', 'Apertura', 'Cierre', 'Habilitado', 'Intervalo', 'Acciones'],
              dataRows: this.listaHorarios
            };
          });
        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  onChangeHabilitar() {
    if (this.flagEsHabilitar === 'S') {
      this.mostrarHoras = true;
      this.horaApertura = null;
      this.horaCierre = null;
      console.log('mostrarHoras: ', this.mostrarHoras);
    } else {
      this.mostrarHoras = false;
      this.horaApertura = '00:00';
      this.horaCierre = '23:59';
      console.log('mostrarHoras: ', this.mostrarHoras);
    }
  }
  /*-------------------------------------------------------------------------*/
  agregar() {
    let d = new Date(this.fecha);
    d = new Date(d.getTime());
    let year = d.getFullYear();
    let mes = d.getMonth() + 1;
    let dia = d.getDate();
    let mesCadena = '';
    let diaCadena = '';
    if (mes.toString().length == 1) {
      mesCadena = '0' + mes;
    } else {
      mesCadena = mes.toString();
    }
    if (dia.toString().length == 1) {
      diaCadena = '0' + dia;
    } else {
      diaCadena = dia.toString();
    }
    let fechaString = year.toString() + mesCadena + diaCadena;
    let aperturaString = this.horaApertura.toString();
    let aperturaCadena = aperturaString.split(':').join('');
    let cierreString = this.horaCierre.toString();
    let cierreCadena = cierreString.split(':').join('');
    console.log('horaAperturaCadena: ', aperturaCadena);
    console.log('horaCierreCadena: ', cierreCadena);
    let datos = {
      fechaCadena: fechaString,
      flagEsHabilitar: this.flagEsHabilitar,
      horaAperturaCadena: aperturaCadena,
      horaCierreCadena: cierreCadena,
      intervaloMinutos: this.intervalo,
      idEmpleado: {
        idPersona: this.idEmpleado
      }
    };
    this.service.agregarHorarioExcepcion(datos).subscribe(
      response => {
        this.showNotification('Horario de excepción creado con éxito!', NOTIFY.SUCCESS);
        this.listarHorarioExcepcion();
        this.limpiarAgregar();
      },
      error => {
        this.showNotification('Error al crear horario de excepcion!', NOTIFY.DANGER);
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  abrirModalModificar(idHorario, idEmpleado, nombre, fecha, apertura, cierre, flag, minutos) {
    let fechaHoy = new Date();
    let fechaSeleccionada = new Date(fecha);
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1); // se le debe sumar un dia a la fecha
    // si la fecha seleccionada es anterior o igual a la fecha del dia  no se puede modificar
    if (fechaHoy.getTime() >= fechaSeleccionada.getTime()) {
      console.log('fecha hoy > fechaSeleccionada');
      this.showNotification('No se puede modificar un registro con fecha anterior a la fecha actual', NOTIFY.WARNING);
    } else {
      console.log('fila seleccionada: ', idHorario, '', idEmpleado, nombre, ' ', fecha, ' ', apertura, ' ', cierre, '', minutos);
      this.modificarIdHorarioExcepcion = idHorario;
      this.modificarIdEmpleado = idEmpleado;
      this.modificarNombreEmpleado = nombre;
      this.modificarFecha = fecha /*fechaSeleccionada.getFullYear() + '-' + fechaSeleccionada.getMonth();*/;
      this.modificarHoraApertura = apertura;
      this.modificarHoraCierre = cierre;
      this.modificarFlagEsHabilitar = flag;
      this.modificarIntervalo = minutos;

      this.aperturaSeleccionada = apertura;
      this.cierreSeleccionado = cierre;
      this.onChangeHabilitarModificar();
      $('#exampleModal2').modal('show');
    }
  }
  /*-------------------------------------------------------------------------*/
  onChangeHabilitarModificar() {
    if (this.modificarFlagEsHabilitar === 'S') {
      this.mostrarHoras = true;
      this.modificarHoraApertura = this.aperturaSeleccionada;
      this.modificarHoraCierre = this.cierreSeleccionado;
      console.log('mostrarHoras: ', this.mostrarHoras);
    } else {
      this.mostrarHoras = false;
      this.modificarHoraApertura = '00:00';
      this.modificarHoraCierre = '23:59';
      console.log('mostrarHoras: ', this.mostrarHoras);
    }
  }
  /*-------------------------------------------------------------------------*/  
  modificar() {
    let d = new Date(this.modificarFecha);
    d = new Date(d.getTime());
    let year = d.getFullYear();
    let mes = d.getMonth() + 1;
    let dia = d.getDate();
    let mesCadena = '';
    let diaCadena = '';
    if (mes.toString().length == 1) {
      mesCadena = '0' + mes;
    } else {
      mesCadena = mes.toString();
    }
    if (dia.toString().length == 1) {
      diaCadena = '0' + dia;
    } else {
      diaCadena = dia.toString();
    }
    let fechaString = year.toString() + mesCadena + diaCadena;


    let aperturaString = this.modificarHoraApertura.toString();
    let aperturaCadena = aperturaString.split(':').join('');
    let cierreString = this.modificarHoraCierre.toString();
    let cierreCadena = cierreString.split(':').join('');
    console.log('horaAperturaCadena: ', aperturaCadena);
    console.log('horaCierreCadena: ', cierreCadena);
    let dato = {
      idHorarioExcepcion: this.modificarIdHorarioExcepcion,
      fechaCadena: fechaString,
      horaAperturaCadena: aperturaCadena,
      horaCierreCadena: cierreCadena,
      intervaloMinutos: this.modificarIntervalo,
      idEmpleado: {
        idPersona: this.modificarIdEmpleado
      }
    };
    console.log('dato a modificar: ', dato);
    this.service.modificarHorarioExcepcion(dato).subscribe(
      response => {
        console.log('lo creado: ', response);
        this.showNotification('Horario modificado con éxito!', NOTIFY.SUCCESS);
        this.listarHorarioExcepcion();
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
    this.service.eliminarHorarioExcepcion(this.eliminarId).subscribe(
      response => {
        this.showNotification('Horario de excepción eliminado con éxito!', NOTIFY.SUCCESS);
        this.listarHorarioExcepcion();
      },
      error => {
        this.showNotification('Error al eliminar horario', NOTIFY.DANGER);
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  limpiarAgregar() {
    this.idHorarioExcepcion = null;
    this.idEmpleado = null;
    this.nombreEmpleado = null;
    this.fecha = null;
    this.horaApertura = null;
    this.horaCierre = null;
    this.flagEsHabilitar = null;
    this.intervalo = null;
  }
  /*-------------------------------------------------------------------------*/
  limpiarModificar() {
    this.modificarIdHorarioExcepcion = null;
    this.modificarIdEmpleado = null;
    this.modificarNombreEmpleado = null;
    this.modificarFecha = null;
    this.modificarHoraApertura = null;
    this.modificarHoraCierre = null;
    this.modificarFlagEsHabilitar = null;
    this.modificarIntervalo = null;
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
  ngOnInit() {
    this.mostrarHoras = false;
    this.listarEmpleados();
    this.listarHorarioExcepcion();
    this.limpiarAgregar();
  }

}
