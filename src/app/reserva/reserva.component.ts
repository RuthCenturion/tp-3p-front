import { Component, OnInit, ViewChild } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { NOTIFY } from '../commons/app-utils';
import { ReservaService } from '../services/reserva.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';


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
export interface PeriodicElement {
  name: string;
  idCliente: number;
  email: string;
  position: number;
}

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {

 ELEMENT_DATA: PeriodicElement[] = [/*
    {position:1, idCliente: 1, name: 'Hydrogen', email: 'H'},
    {position:2, idCliente: 2, name: 'Helium',  email: 'He'},
    {position:3, idCliente: 3, name: 'Lithium', email: 'Li'},
    {position:4, idCliente: 4, name: 'Beryllium',  email: 'Be'},
    {position:5, idCliente: 5, name: 'Boron', email: 'B'},
    {position:6, idCliente: 6, name: 'Carbon', email: 'C'},
    {position:7, idCliente: 7, name: 'Nitrogen', email: 'N'},
    {position:8, idCliente: 8, name: 'Oxygen', email: 'O'},
    {position:9, idCliente: 9, name: 'Fluorine', email: 'F'},
    {position:10, idCliente: 10, name: 'Neon', email: 'Ne'},*/
  ];

  public tableData1: TableData;
  public tableBuscarEmpleado: TableData;
  public tableBuscarCliente: TableData;

  // filtro de la grilla
  fechaDesde: any;
  fechaHasta: any;
  empleadoId: any;
  empleadoNombre: any;
  clienteId: any;
  clienteNombre: any;
  // buscador empleado
  fila: any;
  buscarEmpleadoNombre: any;
  empleadoSeleccionadoId: any;
  empleadoSeleccionadoNombre: any;
  panelOpenState = false;
  // buscador cliente
  filaCliente: any;
  buscarClienteNombre: any;
  listaClienteSeleccionado: Array<any>;
  clienteSeleccionadoId: any;
  clienteSeleccionadoNombre: any;
  mostrarAceptar: any;
  // panelOpenState = false;
  listaAtributos: Array<any>;
  listaBuscarEmpleados: Array<any>;
  listaBuscarClientes: Array<any>;
  listaReservas: Array<any>;
  listaHorarios: Array<any>;


  displayedColumns: string[] = ['select', 'position', 'idCliente', 'name', 'email'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service: ReservaService, ) {
    this.tableData1 = {
      headerRow: ['Id', 'Fecha', 'Inicio', 'Fin', 'Id Emp.', 'Empleado', 'Id Cliente', 'Cliente', 'Acciones'],
      dataRows: this.listaReservas
    };
    this.tableBuscarEmpleado = {
      headerRow: ['', 'Id', 'Nombre', 'Email', 'Local'],
      dataRows: this.listaBuscarEmpleados
    };
    this.tableBuscarCliente = {
      headerRow: ['', 'Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarClientes
    };
  }
  /*-------------------------------------------------------------------------*/
  listarReservas() {
    this.service.getReservas().subscribe(
      response => {
        this.listaReservas = new Array<any>();
        console.log('getReservas():', response);
        if (response.totalDatos > 0 ) {
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
    let url = '?ejemplo=%7B%22nombre%22%3A%22' + buscadorNombre + '%22%7D';
    this.listaBuscarEmpleados = new Array<any>();
    this.service.getEmpleadosBuscador(url).subscribe(
      response => {
        console.log('buscadorEmpleados: ', response);
        if (response.totalDatos > 0 ) {
          response.lista.forEach(
            empleado => {
              let lista = new Array<any>();lista.push(false);
              lista.push(empleado.idPersona); // 0
              lista.push(empleado.nombreCompleto); // 1
              lista.push(empleado.email); // 2
              // local por defecto
              lista.push(empleado.idLocalDefecto.nombre); // 3
              this.listaBuscarEmpleados.push(lista);

              this.tableBuscarEmpleado = {
                headerRow: ['', 'Id', 'Nombre', 'Email', 'Local'],
                dataRows: this.listaBuscarEmpleados
              };

            });

        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  empleadoSeleccionado(id, nombre, c, d ) {
    if (!this.fila) {
      console.log('empleado seleccionado del buscador: ', id, ' ', nombre,  '', c, '', d);
      this.empleadoSeleccionadoId = id;
      this.empleadoSeleccionadoNombre = nombre;
    } else {
      console.log('no se seleccionó fila');
    }
  }
  /*-------------------------------------------------------------------------*/
  aceptarEmpleado() {
    this.empleadoId = this.empleadoSeleccionadoId;
    this.empleadoNombre = this.empleadoSeleccionadoNombre;
    console.log('aceptar');
  }
  /*-------------------------------------------------------------------------*/
  cancelarBuscarEmpleado() {
    this.buscarEmpleadoNombre = null;
    this.fila = null;
    this.listaBuscarEmpleados = [];
    this.tableBuscarEmpleado = {
      headerRow: ['', 'Id', 'Nombre', 'Email', 'Local'],
      dataRows: this.listaBuscarEmpleados
    };
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
        if (response.totalDatos > 0 ) {
          response.lista.forEach(
            cliente => {
              let lista = new Array<any>();
              if (cliente.idLocalDefecto === null ) {
                i = i + 1;
                lista.push(false);
                lista.push(cliente.idPersona); // 0
                lista.push(cliente.nombreCompleto); // 1
                lista.push(cliente.email); // 2
                this.listaBuscarClientes.push(lista);
               /* let nuevo : PeriodicElement;
                nuevo.position = i;
                nuevo.idCliente = cliente.idPersona;
                nuevo.name = cliente.nombreCompleto;
                nuevo.email = cliente.email;*/
                this.ELEMENT_DATA.push({
                  position : i,
                idCliente : cliente.idPersona,
                name : cliente.nombreCompleto,
                email : cliente.email
                });
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
                this.dataSource.paginator = this.paginator;
                this.tableBuscarCliente = {
                  headerRow: ['', 'Id', 'Nombre', 'Email'],
                  dataRows: this.listaBuscarClientes
                };
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

  }
  /*-------------------------------------------------------------------------*/
  cancelarBuscarCliente() {
    this.buscarClienteNombre = null;
    this.listaBuscarClientes = [];
    this.tableBuscarCliente = {
      headerRow: ['', 'Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarClientes
    };
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  }
  /*-------------------------------------------------------------------------*/
  buscar() {
    let path = '';
    let fechaHastaCadena = '';
    if (typeof this.fechaDesde !== 'undefined' && this.fechaDesde !== null) {
      let fechaDesdeString = this.fechaCadena(this.fechaDesde);
      path = '{"fechaDesdeCadena":"' + fechaDesdeString + '"';
      console.log('path: ', path);
    }
    if (typeof this.fechaHasta !== 'undefined' && this.fechaHasta !== null) {
      fechaHastaCadena = this.fechaCadena(this.fechaHasta);
      if (typeof this.fechaDesde !== 'undefined' && this.fechaDesde !== null) {
        path = path + ', "fechaHastaCadena":"' + fechaHastaCadena + '"';
        console.log('path: ', path);
      } else {
        path = '{"fechaHastaCadena":"' + fechaHastaCadena + '"';
      }
    }
    if (typeof this.empleadoId !== 'undefined' && this.empleadoId !== null) {
      if ( (typeof this.fechaDesde !== 'undefined' && this.fechaDesde !== null)
        || (typeof this.fechaHasta !== 'undefined' && this.fechaHasta !== null)) {
        path = path + ',"idEmpleado":{"idPersona":' + this.empleadoId + '}';
      } else {
        path = '{"idEmpleado":{"idPersona":' + this.empleadoId + '}';
      }
    }
    if (typeof this.clienteId !== 'undefined' && this.clienteId !== null) {
      if ((typeof this.fechaDesde !== 'undefined' && this.fechaDesde !== null)
          || (typeof this.fechaHasta !== 'undefined' && this.fechaHasta !== null)
            || (typeof this.empleadoId !== 'undefined' && this.empleadoId !== null) ) {
        path = path + ',"idCliente": {"idPersona":' + this.clienteId + '}';
      } else {
        path = '{"idCliente": {"idPersona":' + this.clienteId + '}';
      }
    }
    path = path + '}';
    console.log('path', path);
    path = encodeURIComponent(path);
    path = '?ejemplo=' + path;
    this.service.buscarReservas(path).subscribe(
      response => {
        this.listaReservas = new Array<any>();
        console.log('getReservas():', response);
        if (response.totalDatos > 0 ) {
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
        } else {
          this.listaReservas = [];
          this.tableData1 = {
            headerRow: ['Id', 'Fecha', 'Inicio', 'Fin', 'Id Emp.', 'Empleado', 'Id Cliente', 'Cliente', 'Acciones'],
            dataRows: this.listaReservas
          };
        }

      }
    );
  }
  /*-------------------------------------------------------------------------*/
  fechaCadena(fecha): any {
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
  limpiar() {
    this.empleadoId = null;
    this.empleadoNombre = null;
    this.fechaHasta = null;
    this.fechaDesde = null;
    this.clienteId = null;
    this.clienteNombre = null;
    // los list de los buscadores
    this.listaBuscarEmpleados = [];
    this.ELEMENT_DATA = [];
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  }
  /*-------------------------------------------------------------------------*/
  /*-------------------------------------------------------------------------*/
  /*-------------------------------------------------------------------------*/
  /*clienteSeleccionado(id, nombre, evento ) {
    // se debe habilitar el botón aceptar solo si está seleccionado un elemento
    if (!this.filaCliente) {
      console.log('cliente seleccionado del buscador: ', id, ' ', nombre, ' ', evento);
      this.clienteSeleccionadoId = id;
      this.clienteSeleccionadoNombre = nombre;
      this.listaClienteSeleccionado.push(
        {
          clienteId: id,
          clienteNombre: nombre
        }
      );
    } else {
      console.log('no se seleccionó fila');
    }
  }*/
  /*-------------------------------------------------------------------------*/  
 
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    if (numSelected === 1 ) {
      this.mostrarAceptar = true;
    } else {
      this.mostrarAceptar = false;
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /*-------------------------------------------------------------------------*/

  ngOnInit() {
    this.listarReservas();
    this.listaClienteSeleccionado = new Array<any> ();
    this.dataSource.paginator = this.paginator;
    console.log('paginator: ', this.paginator);
    this.mostrarAceptar = false;
    // this.listarEmpleadosBuscador();
  }

}
