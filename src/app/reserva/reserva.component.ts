import { Component, OnInit, ViewChild } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { Router } from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { PageEvent } from '@angular/material';

import { NOTIFY } from '../commons/app-utils';
import { ReservaService } from '../services/reserva.service';
import { CategoriaService } from '../services/categoria.service';
import { FichaClinicaService } from '../services/ficha-clinica.service';

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

 ELEMENT_DATA: PeriodicElement[] = [];

  public tableData1: TableData;
  public tableBuscarEmpleado: TableData;
  public tableBuscarCliente: TableData;
  // MatPaginator Inputs
 length;
 pageSize = 5;
 lengthBuscadorCliente;
 // MatPaginator Output
 pageEvent: PageEvent;

  // filtro de la grilla
  fechaDesde: any;
  fechaHasta: any;
  empleadoId: any;
  empleadoNombre: any;
  clienteId: any;
  clienteNombre: any;
  mostrarFiltro: any;
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
  
  // datos modal modificar  
  modificarIdReserva: any;
  modificarFechaReserva: any;
  modificarInicio: any;
  modificarFin: any;
  modificarIdEmpleado: any;
  modificarNombreEmpleado: any;
  modificarIdCliente: any;
  modificarNombreCliente: any;
  modificarAsistio: any;
  modificarObservacion: any;
  asistencia: any;
  opciones: any = [
    {value: 'S', viewValue: 'SI'},
    {value: 'N', viewValue: 'NO'}
  ];
  // cancelarReserva
  cancelarId: any;
  // datos del modal de nuevaFicha
  fichaFecha: any;
  fichaIdEmpleado: any;
  fichaNombreEmpleado: any;
  fichaIdCliente; any;
  fichaNombreCliente: any;
  fichaIdCategoria: any;
  fichaDescripcionCategoria: any;
  fichaidProducto: any;
  fichaDescripcionSubCategoria: any;
  fichaMotivo: any;
  fichaDiagnostico: any;
  fichaObservacion: any;
  // panelOpenState = false;
  listaAtributos: Array<any>;
  listaBuscarEmpleados: Array<any>;
  listaBuscarClientes: Array<any>;
  listaCategoria: Array<any>;
  listaSubCategoria: Array<any>;
  listaReservas: Array<any>;
  listaHorarios: Array<any>;
  listaEmpleadoSeleccionados: Array<any>;
  listaNombreEmpleadoSeleccionados: Array<any>;


  displayedColumns: string[] = ['select', 'position', 'idCliente', 'name', 'email'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service: ReservaService,
    private categoriaService: CategoriaService,
    private fichaService: FichaClinicaService,
    private router: Router ) {
    this.tableData1 = {
      headerRow: ['Id', 'Fecha', 'Inicio', 'Fin', 'Id Emp.', 'Empleado', 'Id Cliente', 
        'Cliente', 'Asistió','Estado', 'Observación', 'Acciones'],
      dataRows: this.listaReservas
    };
    this.tableBuscarEmpleado = {
      headerRow: ['Id', 'Nombre', 'Email', 'Local'],
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
 //   let url = '?ejemplo=%7B%22nombre%22%3A%22' + buscadorNombre + '%22%7D';
    let url = '';
    if (buscadorNombre) {
      url = '?ejemplo=%7B%22nombre%22%3A%22' + buscadorNombre + '%22%7D&orderBy=idPersona&orderDir=asc';
    } else {
      url = '?orderBy=idPersona&orderDir=asc';
    }
    this.listaBuscarEmpleados = new Array<any>();
    this.service.getEmpleadosBuscador(url).subscribe(
      response => {
        console.log('buscadorEmpleados: ', response);
        if (response.totalDatos > 0 ) {
          response.lista.forEach(
            empleado => {
              if (empleado.idLocalDefecto != null) {
                let lista = new Array<any>();
                lista.push(empleado.idPersona); // 0
                lista.push(empleado.nombreCompleto); // 1
                lista.push(empleado.email); // 2
                // local por defecto
                lista.push(empleado.idLocalDefecto.nombre); // 3
                this.listaBuscarEmpleados.push(lista);

                this.tableBuscarEmpleado = {
                  headerRow: ['Id', 'Nombre', 'Email', 'Local'],
                  dataRows: this.listaBuscarEmpleados
                };
              }
            }
          );
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
  seleccionarVariosEmpleado(idSeleccionado, nombreEmpleado) {
    console.log('idSeleccionado: ', idSeleccionado);
    console.log('lista de id seleccionados: ', this.listaEmpleadoSeleccionados);

    // si no hay elementos en la lista --> agregar
    if (this.listaEmpleadoSeleccionados.length === 0) {
      this.listaEmpleadoSeleccionados.push(idSeleccionado);
      this.listaNombreEmpleadoSeleccionados.push(nombreEmpleado);
    } else {
      // si el id ya está en la lista, no agregar y sacar de la lista, porque des-seleccionó en el check
      if (this.listaEmpleadoSeleccionados.includes(idSeleccionado)) {
        let posicion = this.listaEmpleadoSeleccionados.indexOf(idSeleccionado);
        console.log('se encuentra en la posicion: ', this.listaEmpleadoSeleccionados.indexOf(idSeleccionado));
        // se elimina de la lista
        this.listaEmpleadoSeleccionados.splice(posicion, 1);
        this.listaNombreEmpleadoSeleccionados.splice(posicion, 1);
      } else {
        this.listaEmpleadoSeleccionados.push(idSeleccionado);
        this.listaNombreEmpleadoSeleccionados.push(nombreEmpleado);
      }
    }
    // solo si hay un elemento seleccionado se puede habilitar el boton de aceptar
    console.log('lista de id seleccionados al final: ', this.listaEmpleadoSeleccionados);
  }
  /*-------------------------------------------------------------------------*/
  aceptarEmpleado() {
    // obtener el empleado con el unico id que esta en la lista 'listaSeleccionados'
    this.empleadoId = this.listaEmpleadoSeleccionados[0];
    this.empleadoNombre = this.listaNombreEmpleadoSeleccionados[0];
    // limpiar la grilla del buscadorEmpleado
    this.buscarEmpleadoNombre = null;
    this.listaBuscarEmpleados = [];
    this.tableBuscarEmpleado = {
      headerRow: ['', 'Id', 'Nombre', 'Email', 'Local'],
      dataRows: this.listaBuscarEmpleados
    };
    $('#exampleModal2').modal('hide');
    // se elimina lo seleccionado
    this.listaEmpleadoSeleccionados = [];
    this.listaNombreEmpleadoSeleccionados = [];
  }
  /*-------------------------------------------------------------------------*/
  cancelarBuscarEmpleado() {
    this.buscarEmpleadoNombre = null;
    this.fila = null;
    this.listaBuscarEmpleados = [];
    this.tableBuscarEmpleado = {
      headerRow: ['Id', 'Nombre', 'Email', 'Local'],
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
    this.paginator.pageIndex = 0;
    this,this.dataSource.paginator = this.paginator;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  }
  /*-------------------------------------------------------------------------*/
  buscar() {
    /*
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
            // flagAsistio
            this.listaAtributos.push(reserva.flagAsistio === 'S' ? 'SI' : 'NO'); // 8
            this.listaAtributos.push(reserva.flagEstado === 'R' ? 'Reservado' : 'Cancelado'); // 9
            this.listaAtributos.push(reserva.observacion); // 10

            this.listaReservas.push(this.listaAtributos);

            this.tableData1 = {
              headerRow: ['Id', 'Fecha', 'Inicio', 'Fin', 'Id Emp.', 'Empleado',
                 'Id Cliente', 'Cliente', 'Asistió','Estado', 'Observación', 'Acciones'],
              dataRows: this.listaReservas
            };
          });
        } else {
          this.listaReservas = [];
          this.tableData1 = {
            headerRow: ['Id', 'Fecha', 'Inicio', 'Fin', 'Id Emp.', 'Empleado',
               'Id Cliente', 'Cliente', 'Asistió','Estado', 'Observación', 'Acciones'],
            dataRows: this.listaReservas
          };
        }
      }
    );*/
  }
  /*-------------------------------------------------------------------------*/
  listarReservaPaginado(evento) {
    let inicio;
    if(evento === undefined) {
      inicio = 0;
    } else {
      inicio  = evento.pageIndex * this.pageSize;
    }
    let url = this.crearStringUrl();
    console.log('url 1: ', url);
    if (url === '') {
      url = '?orderBy=idReserva&orderDir=asc&inicio=' + inicio + '&cantidad=' + this.pageSize;
    } else {
      url = url + '&orderBy=idReserva&orderDir=asc&inicio=' + inicio + '&cantidad=' + this.pageSize;
    }
    console.log('url 2: ', url);
    this.service.buscarReservas(url).subscribe(
      response => {
        this.listaReservas = new Array<any>();
        console.log('getReservas():', response);
        this.length = response.totalDatos;
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
            // flagAsistio
            this.listaAtributos.push(reserva.flagAsistio === 'S' ? 'SI' : 'NO'); // 8
            this.listaAtributos.push(reserva.flagEstado === 'R' ? 'Reservado' : 'Cancelado'); // 9
            this.listaAtributos.push(reserva.observacion); // 10

            this.listaReservas.push(this.listaAtributos);

            this.tableData1 = {
              headerRow: ['Id', 'Fecha', 'Inicio', 'Fin', 'Id Emp.', 'Empleado',
                 'Id Cliente', 'Cliente', 'Asistió','Estado', 'Observación', 'Acciones'],
              dataRows: this.listaReservas
            };
          });
        } else {
          this.listaReservas = [];
          this.tableData1 = {
            headerRow: ['Id', 'Fecha', 'Inicio', 'Fin', 'Id Emp.', 'Empleado',
               'Id Cliente', 'Cliente', 'Asistió','Estado', 'Observación', 'Acciones'],
            dataRows: this.listaReservas
          };
        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  crearStringUrl() {
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
    if (path.length === 0) { // cuando inicia trae todos los servicios y sin filtros
      return '';
    }
    path = path + '}';
    console.log('path', path);
    path = encodeURIComponent(path);
    path = '?ejemplo=' + path;
    return path;
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
    this.fechaHasta = null;
    this.fechaDesde = null;

    this.empleadoId = null;
    this.empleadoNombre = null;
    
    this.clienteId = null;
    this.clienteNombre = null;

    this.length = 0;
    this.listaReservas = [];
    this.tableData1 = {
      headerRow: ['Id', 'Fecha', 'Inicio', 'Fin', 'Id Emp.', 'Empleado',
         'Id Cliente', 'Cliente', 'Asistió', 'Estado', 'Observación', 'Acciones'],
      dataRows: this.listaReservas
    };
    // los list de los buscadores
    this.listaBuscarEmpleados = [];
    this.ELEMENT_DATA = [];
    
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
    // se cargan las reservas de la fecha actual
  //  this.fechaHasta = new Date();
  //  this.fechaDesde = new Date();
   // this.buscar();
  }
  /*-------------------------------------------------------------------------*/
  agregarReserva() {
    this.router.navigate(['reserva/agregar-reserva']);
  }
  /*-------------------------------------------------------------------------*/
  abrirModalModificar(idReserva, fechaReserva, inicio, fin, idEmpleado,
    nombreEmpleado, idCliente, nombreCliente, asistio, observacion) {
      this.modificarIdReserva = idReserva;
      this.modificarFechaReserva = fechaReserva;
      this.modificarInicio = inicio;
      this.modificarFin = fin;
      this.modificarIdEmpleado = idEmpleado;
      this.modificarNombreEmpleado = nombreEmpleado;
      this.modificarIdCliente = idCliente;
      this.modificarNombreCliente = nombreCliente;
     // this.asistencia = (asistio === 'SI' ? true : false);
      this.modificarAsistio =  (asistio === 'SI' ? true : false);// (asistio === 'SI' ? 'S' : 'N');
      this.modificarObservacion = observacion;
    $('#exampleModal5').modal('show');
  }
  /*-------------------------------------------------------------------------*/
  modificar(origen) {
    let dato = {
      idReserva: this.modificarIdReserva,
      observacion: (this.modificarObservacion ? this.modificarObservacion : ''),
      flagAsistio: (this.modificarAsistio ? 'S' : 'N')
    };
    console.log('datos para modificar: ', dato);
    this.service.modificarReserva(dato).subscribe(
      response => {
        console.log('modificarReserva(): ', response);
        if (!origen) {
          this.showNotification('Modificación de la reserva con éxito!', NOTIFY.SUCCESS);
        }
        this.buscar();
      },
      error => {
        this.showNotification('Error al modificar la reserva. Consulte con soporte', NOTIFY.WARNING);
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  confirmarCancelar(idReserva) {
    $('#exampleModal4').modal('show');
    this.cancelarId = idReserva;
  }
  /*-------------------------------------------------------------------------*/
  cancelarReserva() {
   this.service.eliminarReserva(this.cancelarId).subscribe(
     response => {
       this.showNotification('Reserva cancelada con éxito!', NOTIFY.SUCCESS);
     },
     error => {
      this.showNotification('Error al cancelar la reserva. Consulte con soporte', NOTIFY.DANGER);
     }
   );
  }
  /*-------------------------------------------------------------------------*/
  // modalFicha
  abrirModalNuevaFicha(row) {
    console.log('fila seleccionada para agregar nuevaFicha a la reserva: ');
    console.log(row);
    this.modificarIdReserva = row[0]; // se debe marcar como asistido
    this.fichaFecha = new Date();
    this.fichaIdEmpleado = row[4];
    this.fichaNombreEmpleado = row[5];
    this.fichaIdCliente = row[6];
    this.fichaNombreCliente = row[7];
    /*this.fichaIdCategoria = row[4];
    this.fichaDescripcionCategoria = row[4];
    this.fichaidProducto = row[4];
    this.fichaDescripcionSubCategoria = row[4];
    this.fichaMotivo = null;
    this.fichaDiagnostico = null;
    this.fichaObservacion = null;*/

    $('#modalFicha').modal('show');
  }
  /*-------------------------------------------------------------------------*/
  agregarNuevaFicha() {
    console.log('agregar nuevaFicha: ');
    this.showNotification('MARCAR COMO ASISTIDA LA RESERVA', NOTIFY.WARNING);
    let dato = {
      motivoConsulta: this.fichaMotivo,
      diagnostico: this.fichaDiagnostico,
      observacion: this.fichaObservacion,
      idEmpleado: {
        idPersona: this.fichaIdEmpleado
      },
      idCliente: {
        idPersona: this.fichaIdCliente
      },
      idTipoProducto: {
        idTipoProducto: this.fichaidProducto
      }
    };
    this.fichaService.agregarFicha(dato).subscribe(
      response => {
        console.log('postFicha(): ', response);
        this.showNotification('Ficha creada con éxito!', NOTIFY.SUCCESS);
        this.limpiar();
        this.asistencia = 'S';
        // this.modificarIdReserva
        this.modificarAsistio = 'S';
        this.modificar('NF');
      },
      error => {
        this.modificarIdReserva = null;
        this.showNotification('Ocurrió un error al agregar ficha. Consulte con soporte', NOTIFY.DANGER);
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  listarCategorias() {
    this.categoriaService.getCategoria().subscribe(
      response => {
        this.listaCategoria = new Array<any>();
        response.lista.forEach(cat => {
          this.listaAtributos = new Array<any>();
          this.listaAtributos.push(cat.idCategoria);
          this.listaAtributos.push(cat.descripcion);
          this.listaCategoria.push(this.listaAtributos);
        });
      },
      error => {
        this.showNotification('Error al obtener categorias', NOTIFY.DANGER);
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  listarSubCategorias(idCategoria) {
    console.log('categoriaSeleccionada: ', this.fichaIdCategoria);
    let url = '{"idCategoria":{"idCategoria":' + idCategoria + '}}';
    url = '?ejemplo=' + encodeURIComponent(url);
    this.categoriaService.obtenerSubCategoria(url).subscribe(
      response => {
        this.listaAtributos = new Array<any>();
        this.listaSubCategoria = new Array<any>();
        response.lista.forEach(subCat => {
          this.listaAtributos = new Array<any>();
          this.listaAtributos.push(subCat.idTipoProducto);
          this.listaAtributos.push(subCat.descripcion);
          this.listaSubCategoria.push(this.listaAtributos);
        });
      },
      error => {
        this.showNotification('Error al obtener sub-categorias', NOTIFY.DANGER);
      }
    );

  }
  /*-------------------------------------------------------------------------*/
  /*-------------------------------------------------------------------------*/
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
  toggleFiltro() {
    if (this.mostrarFiltro) {
      this.mostrarFiltro = false;
    } else {
      this.mostrarFiltro = true;
    }
  }
  /*-------------------------------------------------------------------------*/

  ngOnInit() {
    this.mostrarFiltro = false;
    this.listarCategorias();
    this.listaSubCategoria = new Array<any>();
    // this.listarReservas();
    // al iniciar busca las reservas del dia actual
    console.log(new Date());
    this.fechaDesde = new Date();
    this.fechaHasta = new Date();
    // this.buscar();
    this.listarReservaPaginado(undefined);
    this.listaClienteSeleccionado = new Array<any> ();
    this.listaEmpleadoSeleccionados = new Array<any> ();
    this.listaNombreEmpleadoSeleccionados = new Array<any> ();
    this.dataSource.paginator = this.paginator;
    this.mostrarAceptar = false;
    // this.listarEmpleadosBuscador();
  }

}
