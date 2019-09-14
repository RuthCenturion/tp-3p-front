import { Component, OnInit, ViewChild } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { NOTIFY } from '../commons/app-utils';
import { ReservaService } from '../services/reserva.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

declare const $: any;

declare interface TableWithCheckboxes {
  ischecked?: boolean;
  id: number;
  nombre: string;
  email: string;
  local: string;
}
export interface TableData2 {
  headerRow: string[];
  dataRows: TableWithCheckboxes[];
}
export interface Cliente {
  name: string;
  idCliente: number;
  email: string;
  position: number;
}
export interface Empleado {
  name: string;
  idEmpleado: number;
  email: string;
  position: number;
  local: string;
}
export interface Agenda {
  position: number;
  horaInicio: string;
  horaFin: string;
  cliente: string;
}

@Component({
  selector: 'app-agregar-reserva',
  templateUrl: './agregar-reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class AgregarReservaComponent implements OnInit {

  listaBuscarClientes: Cliente[] = [];

  public tableData1: TableData;
  public tableBuscarEmpleado: TableData;
  public tableBuscarCliente: TableData;

  fechaAgenda: any;
  fechaDesde: any;
  fechaHasta: any;
  empleadoId: any;
  empleadoNombre: any;
  clienteId: any;
  clienteNombre: any;
  // buscador empleado
  fila: any;
  buscarEmpleadoNombre: any;
  panelOpenState = false;
  // buscador cliente
  filaCliente: any;
  buscarClienteNombre: any;
  mostrarAceptar: any;
  mostrarAceptarEmpleado: any;
  // panelOpenState = false;
  listaAtributos: Array<any>;
  listaBuscarEmpleados: Empleado[] = [];
  // listaBuscarClientes: Array<any>;
  listaReservas: Array<any>;
  listaAgenda: Agenda[] = [];

  mostrarYaReservados
  observacion: any;
  mostrarAgregarReserva: any;


  displayedColumnsEmpleado: string[] = ['select', 'position', 'idEmpleado', 'name', 'email', 'local'];
  dataSourceEmpleado = new MatTableDataSource<Empleado>(this.listaBuscarEmpleados);
  selectionEmpleado = new SelectionModel<Empleado>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginatorEmpleado: MatPaginator;

  displayedColumns: string[] = ['select', 'position', 'idCliente', 'name', 'email'];
  dataSourceCliente = new MatTableDataSource<Cliente>(this.listaBuscarClientes);
  selection = new SelectionModel<Cliente>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumnsAgenda: string[] = ['select', 'position', 'horaInicio', 'horaFin', 'cliente'];
  dataSourceAgenda = new MatTableDataSource<Agenda>(this.listaAgenda);
  selectionAgenda = new SelectionModel<Agenda>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginatorAgenda: MatPaginator;

  constructor(private service: ReservaService, ) {
    this.tableData1 = {
      headerRow: ['Id', 'Fecha', 'Inicio', 'Fin', 'Id Emp.', 'Empleado', 'Id Cliente', 'Cliente', 'Acciones'],
      dataRows: this.listaReservas
    };
    /*this.tableBuscarEmpleado = {
      headerRow: ['', 'Id', 'Nombre', 'Email', 'Local'],
      dataRows: this.listaBuscarEmpleados
    };*/
    /*this.tableBuscarCliente = {
      headerRow: ['', 'Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarClientes
    };*/
  }
  /*-------------------------------------------------------------------------*/
  listarReservas() {
    this.service.getReservas().subscribe(
      response => {
        this.listaReservas = new Array<any>();
        console.log('getReservas():', response);
        if (response.totalDatos > 0) {
          response.lista.forEach(reserva => {
            this.listaAtributos = new Array<any>();
            // fechas
            this.listaAtributos.push(reserva.idReserva); // 0
            this.listaAtributos.push(reserva.fecha); // 1
            this.listaAtributos.push(reserva.horaInicio); // 2
            this.listaAtributos.push(reserva.horaFin); // 3
            // profesional
            this.listaAtributos.push(reserva.idEmpleado.idPersona); // 4
            this.listaAtributos.push(reserva.idEmpleado.nombreCompleto); // 5
            // cliente
            this.listaAtributos.push(reserva.idCliente.idPersona); // 6
            this.listaAtributos.push(reserva.idCliente.nombreCompleto); // 7

            this.listaReservas.push(this.listaAtributos);

            this.tableData1 = {
              headerRow: ['Id', 'Fecha', 'Inicio', 'Fin', 'Id Emp.', 'Empleado', 'Id Cliente', 'Cliente', 'Acciones'],
              dataRows: this.listaReservas
            };
          });
        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  listarEmpleadosBuscador(buscadorNombre) {
    // let buscadorNombre = 'Gustavo'
    // let url = '?ejemplo=%7B%22nombre%22%3A%22' + buscadorNombre + '%22%7D';
    let url = '';
    if (buscadorNombre) {
      url = '?ejemplo=%7B%22nombre%22%3A%22' + buscadorNombre + '%22%7D';
    } else {
      url = '';
    }

    this.listaBuscarEmpleados = new Array<any>();
    this.service.getEmpleadosBuscador(url).subscribe(
      response => {
        let i: number = 0;
        console.log('buscadorEmpleados: ', response);
        if (response.totalDatos > 0) {
          response.lista.forEach(
            empleado => {
              /*let lista = new Array<any>();
              lista.push(false);
              lista.push(empleado.idPersona); // 0
              lista.push(empleado.nombreCompleto); // 1
              lista.push(empleado.email); // 2
              // local por defecto
              lista.push(empleado.idLocalDefecto.nombre); // 3
              this.listaBuscarEmpleados.push(lista);

              this.tableBuscarEmpleado = {
                headerRow: ['', 'Id', 'Nombre', 'Email', 'Local'],
                dataRows: this.listaBuscarEmpleados
              };*/
              if (empleado.idLocalDefecto) {
                i = i + 1;
                this.listaBuscarEmpleados.push({
                  position: i,
                  idEmpleado: empleado.idPersona,
                  name: empleado.nombreCompleto,
                  email: empleado.email,
                  local: empleado.idLocalDefecto.nombre
                });
                this.dataSourceEmpleado = new MatTableDataSource<Empleado>(this.listaBuscarEmpleados);
                // this.dataSourceEmpleado.paginator = this.paginatorEmpleado;
  
              }
              
            });

        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  aceptarEmpleado() {
    console.log('empleado seleccionado: ', this.selectionEmpleado.selected[0]);
    this.empleadoId = this.selectionEmpleado.selected[0].idEmpleado;
    this.empleadoNombre = this.selectionEmpleado.selected[0].name;
    this.cancelarBuscarEmpleado();
  }
  /*-------------------------------------------------------------------------*/
  cancelarBuscarEmpleado() {
    this.buscarEmpleadoNombre = null;
    this.fila = null;
    // this.listaBuscarEmpleados = [];
    /*this.tableBuscarEmpleado = {
      headerRow: ['', 'Id', 'Nombre', 'Email', 'Local'],
      dataRows: this.listaBuscarEmpleados
    };*/


    this.listaBuscarEmpleados = [];
    this.paginatorEmpleado.pageIndex = 0;
    this.dataSourceEmpleado = new MatTableDataSource<Empleado>(this.listaBuscarEmpleados);
    this.dataSourceEmpleado.paginator = this.paginatorEmpleado;
  }
  /*-------------------------------------------------------------------------*/
  listarClientesBuscador(buscadorNombre) {
    let url = '';
    if (buscadorNombre) {
      url = '?ejemplo=%7B%22nombre%22%3A%22' + buscadorNombre + '%22%7D';
    } else {
      url = '';
    }
    this.listaBuscarClientes = new Array<any>();
    this.service.getEmpleadosBuscador(url).subscribe(
      response => {
        console.log('buscadorClientes: ', response);
        let i: number = 0;
        if (response.totalDatos > 0) {
          response.lista.forEach(
            cliente => {
              let lista = new Array<any>();
              if (cliente.idLocalDefecto === null) {
                i = i + 1;
                /* lista.push(false);
                 lista.push(cliente.idPersona); // 0
                 lista.push(cliente.nombreCompleto); // 1
                 lista.push(cliente.email); // 2
                 this.listaBuscarClientes.push(lista);*/
                /* let nuevo : Cliente;
                 nuevo.position = i;
                 nuevo.idCliente = cliente.idPersona;
                 nuevo.name = cliente.nombreCompleto;
                 nuevo.email = cliente.email;*/
                this.listaBuscarClientes.push({
                  position: i,
                  idCliente: cliente.idPersona,
                  name: cliente.nombreCompleto,
                  email: cliente.email
                });
                this.dataSourceCliente = new MatTableDataSource<Cliente>(this.listaBuscarClientes);
                this.dataSourceCliente.paginator = this.paginator;
                /*this.tableBuscarCliente = {
                  headerRow: ['', 'Id', 'Nombre', 'Email'],
                  dataRows: this.listaBuscarClientes
                };*/
              }
            });
        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  aceptarCliente() {
    console.log('cliente seleccionado: ', this.selection.selected[0]);
    this.clienteId = this.selection.selected[0].idCliente;
    this.clienteNombre = this.selection.selected[0].name;
    this.cancelarBuscarCliente();
  }
  /*-------------------------------------------------------------------------*/
  cancelarBuscarCliente() {
    this.buscarClienteNombre = null;
    /*this.tableBuscarCliente = {
      headerRow: ['', 'Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarClientes
    };*/
    this.listaBuscarClientes = [];
    this.paginator.pageIndex = 0;
    this.dataSourceCliente = new MatTableDataSource<Cliente>(this.listaBuscarClientes);
    this.dataSourceCliente.paginator = this.paginator;
  }
  /*-------------------------------------------------------------------------*/
  formatoFechaCadena(fecha): any {
    let d = new Date(fecha);
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
    return (year.toString() + mesCadena + diaCadena);
  }
  /*-------------------------------------------------------------------------*/
  buscarAgenda() {
    let fechaCadena = this.formatoFechaCadena(this.fechaAgenda);
    let path = '/' + this.empleadoId + '/agenda?fecha=' + fechaCadena;
    if (!this.mostrarYaReservados) {
      path = path + '&disponible=S';
    }
    this.listaAgenda = [];
    this.dataSourceAgenda = new MatTableDataSource<Agenda>(this.listaAgenda);
    this.service.buscarAgenda(path).subscribe(
      response => {
        let i: number = 0;
        response.forEach(
          agenda => {
            i = i + 1;
            this.listaAgenda.push({
              position: i,
              horaInicio: agenda.horaInicioCadena.substring(0, 2) + ':' + agenda.horaInicioCadena.substring(2),
              horaFin: agenda.horaFinCadena.substring(0, 2) + ':' + agenda.horaFinCadena.substring(2),
              cliente: agenda.idCliente ? agenda.idCliente.nombreCompleto : '',
            });
            this.dataSourceAgenda = new MatTableDataSource<Agenda>(this.listaAgenda);
//            this.dataSourceAgenda.paginator = this.paginator;
          });
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  agregarReserva() {
    console.log('horario seleccionado: ', this.selectionAgenda.selected[0] );
    if ( this.selectionAgenda.selected[0].cliente) {
      this.showNotification('No se puede reservar en horario ya reservado', NOTIFY.WARNING);
    } else {
      let fechaReserva = this.formatoFechaCadena(this.fechaAgenda);
      let dato = {
        fechaCadena: fechaReserva,
        horaInicioCadena: this.selectionAgenda.selected [0].horaInicio.split(':').join('') ,
        horaFinCadena: this.selectionAgenda.selected [0].horaFin.split(':').join('') ,
        idEmpleado: {
          idPersona: this.empleadoId
        },
        idCliente: {
          idPersona: this.clienteId
        },
        observacion: this.observacion
      };
      console.log('datos para reserva: ', dato);
      this.service.agregarReserva(dato).subscribe(
        response => {
          console.log('reserva exitosa: ', response);
          this.showNotification('Reserva agendada conrrectamente.', NOTIFY.SUCCESS);
          this.clienteNombre = null;
          this.clienteId = null;
          this.observacion = null;
          this.buscarAgenda();
        },
        error => {
          this.showNotification('Error al realizar la reserva. Consulte con soporte.', NOTIFY.DANGER);
        }
      );
    }

  }
  /*-------------------------------------------------------------------------*/
  limpiar() {
    this.empleadoId = null;
    this.empleadoNombre = null;
    this.clienteId = null;
    this.clienteNombre = null;
    this.mostrarYaReservados = false;
    this.listaAgenda = [];
    this.fechaAgenda = null;
    this.dataSourceAgenda = new MatTableDataSource<Agenda>(this.listaAgenda);
  }
  /*-------------------------------------------------------------------------*/
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceCliente.data.length;
    if (numSelected === 1) {
      this.mostrarAceptar = true;
    } else {
      this.mostrarAceptar = false;
    }
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSourceCliente.data.forEach(row => this.selection.select(row));
  }
  checkboxLabel(row?: Cliente): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  /*-------------------------------------------------------------------------*/
  isAllSelectedEmpleado() {
    const numSelected = this.selectionEmpleado.selected.length;
    const numRows = this.dataSourceEmpleado.data.length;
    if (numSelected === 1) {
      this.mostrarAceptarEmpleado = true;
    } else {
      this.mostrarAceptarEmpleado = false;
    }
    return numSelected === numRows;
  }
  masterToggleEmpleado() {
    this.isAllSelectedEmpleado() ?
      this.selectionEmpleado.clear() :
      this.dataSourceEmpleado.data.forEach(row => this.selectionEmpleado.select(row));
  }
  checkboxLabelEmpleado(row?: Empleado): string {
    if (!row) {
      return `${this.isAllSelectedEmpleado() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionEmpleado.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  /*-------------------------------------------------------------------------*/
  isAllSelectedAgenda() {
    const numSelected = this.selectionAgenda.selected.length;
    const numRows = this.dataSourceAgenda.data.length;
   /* if (numSelected === 1) {
      if ( this.selectionAgenda.selected[0].cliente) {
        this.mostrarAgregarReserva = false;
      } else {
        this.mostrarAgregarReserva = true;
      }
    } else {
      this.mostrarAgregarReserva = false;
    }*/
    return numSelected === numRows;
  }
  masterToggleAgenda() {
    this.isAllSelectedAgenda() ?
      this.selectionAgenda.clear() :
      this.dataSourceAgenda.data.forEach(row => this.selectionAgenda.select(row));
  }
  checkboxLabelAgenda(row?: Agenda): string {
    if (!row) {
      return `${this.isAllSelectedAgenda() ? 'select' : 'deselect'} all`;
    }
    console.log('*****************************');
    console.log(row);
    console.log('*****************************');
    return `${this.selectionAgenda.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
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
    this.mostrarYaReservados = false;
    this.mostrarAceptar = false;
    this.mostrarAceptarEmpleado = false;
    this.dataSourceCliente.paginator = this.paginator;
  }

}
