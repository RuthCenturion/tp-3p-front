import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { TableData } from '../../md/md-table/md-table.component';
import { CategoriaService } from '../../services/categoria.service';
import { NOTIFY } from '../../commons/app-utils';
import { PageEvent } from '@angular/material';


declare const $: any;

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
  nombre: any;
  apellido: any;
  email: any;
  telefono: any;
  ruc: any;
  cedula: any;
  tipoPersona: any;
  fechaNacimiento: any;

  modificarId: any;
  modificarNombre: any;
  modificarApellido: any;
  modificarEmail: any;
  modificarTelefono: any;
  modificarRuc: any;
  modificarCedula: any;
  modificarTipoPersona: any;
  modificarFechaNacimiento: any;

  eliminarId: any;
  public tableData1: TableData;
  listaAtributos: Array<any>;
  listaPacientes: Array<any>;

  descripcion: any;
  // MatPaginator Inputs
  length: number;
  pageSize = 5;

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private service: CategoriaService) {
    this.tableData1 = {
      headerRow: ['Id', 'Nombre', 'Apellido', 'Nº Documento', 'RUC', 'Teléfono', 'Email', 'Fecha Nac.', 'Acciones'],
      dataRows: this.listaPacientes
    };
  }

  listarPacientes() {
    this.service.listarPacientes().subscribe(
      response => {
        console.log('lista de pacientes: ', response);
        this.listaPacientes = new Array<any>();
        if (response.totalDatos > 0) {
          response.lista.forEach(paciente => {
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(paciente.idPersona); // 0
            this.listaAtributos.push(paciente.nombre); // 1
            this.listaAtributos.push(paciente.apellido); // 2
            this.listaAtributos.push(paciente.cedula); // 3
            this.listaAtributos.push(paciente.ruc); // 4
            this.listaAtributos.push(paciente.telefono); // 5
            this.listaAtributos.push(paciente.email); // 6
            this.listaAtributos.push(paciente.fechaNacimiento); // 7
            this.listaPacientes.push(this.listaAtributos);
            this.tableData1 = {
              headerRow: ['Id', 'Nombre', 'Apellido', 'Nº Documento', 'RUC', 'Teléfono', 'Email', 'Fecha Nac.', 'Acciones'],
              dataRows: this.listaPacientes
            };
          });
        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  agregar() {
    let d = new Date(this.fechaNacimiento);
    d = new Date(d.getTime() - 3000000);
    let year = d.getFullYear();
    let mes = d.getMonth() + 1;
    let dia = d.getDate() + 1;
    let fechaString = year + '-' + mes + '-' + dia + ' 00:00:00';
    let dato = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      telefono: this.telefono,
      ruc: this.ruc,
      cedula: this.cedula,
      tipoPersona: 'FISICA',
      fechaNacimiento: fechaString
    };
    this.service.agregarPaciente(dato).subscribe(
      response => {
        console.log('lo creado: ', response);
        this.showNotification('Paciente creado con éxito!', NOTIFY.SUCCESS);
        this.listarPacientesPag(undefined);
        this.limpiarAgregar();
      },
      error => {
        this.showNotification('Error al agregar paciente', NOTIFY.DANGER);
        this.limpiarAgregar();
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  abrirModalModificar(id, nombre, apellido, documento, ruc, telefono, mail, fechaNac) {
    // console.log('fila seleccionada: ', id, ' ', nombre, ' ', apellido, ' ', documento, '', ruc, ' ', telefono, '', mail, '', fechaNac);
    this.modificarId = id;
    this.modificarNombre = nombre;
    this.modificarApellido = apellido;
    this.modificarCedula = documento;
    this.modificarRuc = ruc;
    this.modificarTelefono = telefono;
    this.modificarEmail = mail;
    let fecha = new Date(fechaNac);
    let dia = fecha.getDate() + 1;
    let yy = fecha.getFullYear();
    let mm = fecha.getMonth() + 1;
    let fechaFinal = yy + '-' + mm + '-' + dia;
    this.modificarFechaNacimiento = new Date(fechaFinal);
    $('#exampleModal2').modal('show');
  }
  /*-------------------------------------------------------------------------*/
  modificar() {
    //  console.log('fila datos a modificar: ', this.modificarId, ' ', this.modificarDescripcion, ' ', this.modificarCategoria );
    let d = new Date(this.modificarFechaNacimiento);
    d = new Date(d.getTime() - 3000000);
    let year = d.getFullYear();
    let mes = d.getMonth() + 1;
    let dia = d.getDate() + 1;
    let fechaString = year + '-' + mes + '-' + dia + ' 00:00:00';
    let dato = {
      idPersona: this.modificarId,
      nombre: this.modificarNombre,
      apellido: this.modificarApellido,
      email: this.modificarEmail,
      telefono: this.modificarTelefono,
      ruc: this.modificarRuc,
      cedula: this.modificarCedula,
      tipoPersona: 'FISICA',
      fechaNacimiento: fechaString
    };

    this.service.modificarPaciente(dato).subscribe(
      response => {
        console.log('lo creado: ', response);
        this.showNotification('Paciente creada con éxito!', NOTIFY.SUCCESS);
        this.listarPacientesPag(undefined);
        this.limpiarModificar();
      },
      error => {
        this.showNotification('Error al agregar paciente', NOTIFY.DANGER);
        this.limpiarModificar();
      }
    );
    // this.showNotification('Los datos se han modificado con éxito. ', NOTIFY.SUCCESS);
  }
  /*-------------------------------------------------------------------------*/
  confirmarEliminar(id) {
    $('#exampleModal3').modal('show');
    this.eliminarId = id;
  }
  /*-------------------------------------------------------------------------*/
  eliminar() {
    //  this.showNotification('FALTA IMPLEMENTAR LLAMADO AL BACK ', NOTIFY.WARNING);
    this.service.eliminarPaciente(this.eliminarId).subscribe(
      response => {
        this.showNotification('Paciente eliminado con éxito!', NOTIFY.SUCCESS);
        this.listarPacientesPag(undefined);
      },
      error => {
        this.showNotification('Error al eliminar paceinte', NOTIFY.DANGER);
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
  limpiarAgregar() {
    this.nombre = null;
    this.apellido = null;
    this.email = null;
    this.telefono = null;
    this.ruc = null;
    this.cedula = null;
    this.fechaNacimiento = null;
  }
  /*-------------------------------------------------------------------------*/
  limpiarModificar() {
    this.modificarId = null;
    this.modificarNombre = null;
    this.modificarApellido = null;
    this.modificarCedula = null;
    this.modificarRuc = null;
    this.modificarTelefono = null;
    this.modificarEmail = null;
    this.modificarFechaNacimiento = null;
  }
  /*-------------------------------------------------------------------------*/
  ngOnInit() {
    this.listarPacientesPag(undefined);
  }

  listarPacientesPag(evento: any) {
    let inicio: number;
    if(evento == undefined) {
      inicio = 0
    } else {
      inicio  = evento.pageIndex * this.pageSize;
    }
    this.service.listarPacientesPag(this.descripcion, inicio, this.pageSize).subscribe(
      response => {
        console.log('lista de pacientes: ', response);
        this.listaPacientes = new Array<any>();
        this.length = response.totalDatos;
        if (response.totalDatos > 0) {
          response.lista.forEach(paciente => {
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(paciente.idPersona); // 0
            this.listaAtributos.push(paciente.nombre); // 1
            this.listaAtributos.push(paciente.apellido); // 2
            this.listaAtributos.push(paciente.cedula); // 3
            this.listaAtributos.push(paciente.ruc); // 4
            this.listaAtributos.push(paciente.telefono); // 5
            this.listaAtributos.push(paciente.email); // 6
            this.listaAtributos.push(paciente.fechaNacimiento); // 7
            this.listaPacientes.push(this.listaAtributos);
            this.tableData1 = {
              headerRow: ['Id', 'Nombre', 'Apellido', 'Nº Documento', 'RUC', 'Teléfono', 'Email', 'Fecha Nac.', 'Acciones'],
              dataRows: this.listaPacientes
            };
          });
        }
      }
    );
  }

}
