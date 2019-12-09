import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { TableData } from '../../md/md-table/md-table.component';
import { CategoriaService } from '../../services/categoria.service';
import { NOTIFY } from '../../commons/app-utils';


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
  // filtro de búsqueda
  clienteNombre: any;
  clienteApellido: any;

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
  mostrarFiltro: any;

  constructor(private service: CategoriaService) {
    this.tableData1 = {
      headerRow: ['Id', 'Nombre', 'Apellido', 'Nº Documento', 'Teléfono', 'Email', 'Fecha Nac.', 'Acciones'],
      dataRows: this.listaPacientes
    };
  }

  listarClientes() {
    this.service.listarClientes().subscribe(
      response => {
        this.listaPacientes = new Array<any>();
        if (response.data.clientes.length > 0) {
          response.data.clientes.forEach(paciente => {
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(paciente.id); // 0
            this.listaAtributos.push(paciente.nombre); // 1
            this.listaAtributos.push(paciente.apellido); // 2
            this.listaAtributos.push(paciente.nroDocumento); // 3
            this.listaAtributos.push(paciente.ruc); // 4
            this.listaAtributos.push(paciente.telefono); // 5
            this.listaAtributos.push(paciente.email); // 6
            this.listaAtributos.push(paciente.fechaNacimiento); // 7
            this.listaPacientes.push(this.listaAtributos);
            this.tableData1 = {
              headerRow: ['Id', 'Nombre', 'Apellido', 'Nº Documento', 'Teléfono', 'Email', 'Fecha Nac.', 'Acciones'],
              dataRows: this.listaPacientes
            };
          });
        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  listarClientesPaginado() {
    /*  POST /rest/clientes/getByPage?parametro=ban
    {
    "startIndexPage":3,
    "pageSize":2
    }*/
    console.log('para filtrar: ', this.clienteNombre, '--', this.clienteApellido);
    let param = {
      "startIndexPage": 0,
      "pageSize": 10
    };
    let filtro = '?';
   /* if (typeof this.clienteApellido !== 'undefined' || typeof this.clienteNombre === 'undefined') {
      filtro = filtro + 'parametro=' + this.clienteApellido;
    }*/
    if (typeof this.clienteNombre !== 'undefined' /*|| typeof this.clienteApellido === 'undefined'*/) {
      filtro = filtro + 'parametro=' + this.clienteNombre;
    }
    if (typeof this.clienteNombre === 'undefined'/* && typeof this.clienteApellido === 'undefined'*/) {
      filtro = '?';
    }
    console.log('filtro: ', filtro);
    this.service.buscarClientes(param, filtro).subscribe(
      response => {
        this.listaPacientes = new Array<any>();
        if (response.data.clientes !== null) {
          if (response.data.clientes.length > 0) {
            response.data.clientes.forEach(paciente => {
              this.listaAtributos = new Array<any>();
              this.listaAtributos.push(paciente.id); // 0
              this.listaAtributos.push(paciente.nombre); // 1
              this.listaAtributos.push(paciente.apellido); // 2
              this.listaAtributos.push(paciente.nroDocumento); // 3
              this.listaAtributos.push(paciente.ruc); // 4
              this.listaAtributos.push(paciente.telefono); // 5
              this.listaAtributos.push(paciente.email); // 6
              this.listaAtributos.push(paciente.fechaNacimiento); // 7
              this.listaPacientes.push(this.listaAtributos);
              this.tableData1 = {
                headerRow: ['Id', 'Nombre', 'Apellido', 'Nº Documento', 'Teléfono', 'Email', 'Fecha Nac.', 'Acciones'],
                dataRows: this.listaPacientes
              };
            });
          } else {
            this.listaPacientes=[];
            this.tableData1 = {
              headerRow: ['Id', 'Nombre', 'Apellido', 'Nº Documento', 'Teléfono', 'Email', 'Fecha Nac.', 'Acciones'],
              dataRows: this.listaPacientes
            };
            this.showNotification(response.message, NOTIFY.WARNING);
          }
        } else {
          this.listaPacientes=[];
          this.tableData1 = {
            headerRow: ['Id', 'Nombre', 'Apellido', 'Nº Documento', 'Teléfono', 'Email', 'Fecha Nac.', 'Acciones'],
            dataRows: this.listaPacientes
          };
          this.showNotification(response.message, NOTIFY.WARNING);
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
    let fechaString = year + '-' + mes + '-' + dia;// + ' 00:00:00';
    let dato = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      telefono: this.telefono,
      //  ruc: this.ruc,
      nroDocumento: this.cedula,
      //    tipoPersona: 'FISICA',
      fechaNacimiento: fechaString
    };
    this.service.agregarCliente(dato).subscribe(
      response => {
        this.showNotification('Cliente creado con éxito!', NOTIFY.SUCCESS);
        this.listarClientes();
        this.limpiarAgregar();
      },
      error => {
        this.showNotification('Error al agregar cliente', NOTIFY.DANGER);
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
        this.showNotification('Paciente creada con éxito!', NOTIFY.SUCCESS);
        this.listarClientes();
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
        this.showNotification('Cliente eliminado con éxito!', NOTIFY.SUCCESS);
        this.listarClientes();
      },
      error => {
        this.showNotification('Error al eliminar cliente', NOTIFY.DANGER);
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
  limpiar (){
    this.clienteNombre = null;
    this.listaPacientes = [];
    this.tableData1 = {
      headerRow: ['Id', 'Nombre', 'Apellido', 'Nº Documento', 'Teléfono', 'Email', 'Fecha Nac.', 'Acciones'],
      dataRows: this.listaPacientes
    };
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
  toggleFiltro() {
    if (this.mostrarFiltro) {
      this.mostrarFiltro = false;
    } else {
      this.mostrarFiltro = true;
    }
  }

  /*-------------------------------------------------------------------------*/
  ngOnInit() {
    //this.listarPacientes();
    this.mostrarFiltro = false;
    this.listarClientes();
  }

}
