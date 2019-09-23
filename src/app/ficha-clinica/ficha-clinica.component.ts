import { Component, OnInit, ViewChild } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { Router } from '@angular/router';
import { NOTIFY } from '../commons/app-utils';
import { FichaClinicaService } from '../services/ficha-clinica.service';
import { CategoriaService } from '../services/categoria.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material';

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
  selector: 'app-ficha-clinica', 
  templateUrl: './ficha-clinica.component.html',
  styleUrls: ['./ficha-clinica.component.css']
})
export class FichaClinicaComponent implements OnInit {

  public tableData1: TableData;
  public tableBuscarEmpleado: TableData;
  public tableBuscarCliente: TableData;
  public tableDataFicha: TableData;

  // filtro de la grilla
  fechaDesde: any;
  fechaHasta: any;
  empleadoId: any;
  empleadoNombre: any;
  clienteId: any;
  clienteNombre: any;
  idCategoria: any;
  idProducto: any;
  tipoProductoNombre: any;
  /***BUSCADORES***/
  // empleado
  fila: any;
  buscarEmpleadoNombre: any;
  empleadoSeleccionadoId: any;
  empleadoSeleccionadoNombre: any;
  panelOpenState = false;
  // cliente
  filaCliente: any;
  buscarClienteNombre: any;
  listaClienteSeleccionado: Array<any>;
  clienteSeleccionadoId: any;
  clienteSeleccionadoNombre: any;
  mostrarAceptar: any;

  listaEmpleadoSeleccionados: Array<any>;
  listaNombreEmpleadoSeleccionados: Array<any>;
  listaClienteSeleccionados: Array<any>;
  listaNombreClienteSeleccionados: Array<any>;

  // MatPaginator Inputs
 length;
 pageSize = 5;
 lengthBuscadorCliente;
 // MatPaginator Output
 pageEvent: PageEvent;

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
    { value: 'S', viewValue: 'SI' },
    { value: 'N', viewValue: 'NO' }
  ];

  // panelOpenState = false;
  listaAtributos: Array<any>;
  listaBuscarEmpleados: Array<any>;
  listaBuscarClientes: Array<any>;
  listaCategoria: Array<any>;
  listaSubCategoria: Array<any>;
  listaReservas: Array<any>;
  listaFichaClinica: Array<any>;
  listaHorarios: Array<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: FichaClinicaService,
    private categoriaService: CategoriaService,
    private router: Router) {
    this.tableData1 = {
      headerRow: ['Id', 'Fecha', 'Inicio', 'Fin', 'Id Emp.', 'Empleado',
       'Id Cliente', 'Cliente', 'Asistió', 'Estado', 'Observación', 'Acciones'],
      dataRows: this.listaReservas
    };
    this.tableBuscarEmpleado = {
      headerRow: ['Id', 'Nombre', 'Email', 'Local'],
      dataRows: this.listaBuscarEmpleados
    };
    this.tableBuscarCliente = {
      headerRow: ['Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarClientes
    };
    this.tableDataFicha = {
      headerRow: ['Id', 'Fecha', 'Id Pr.', 'Profesional', 'Id Clie.', 'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 
          'Sub-Categoria', 'Motivo', 'Diagnóstico', 'Observación', 'Acciones'],
      dataRows: this.listaFichaClinica
    };
  }
  /*-------------------------------------------------------------------------*/
  listarFichas() {
    this.service.getFichas().subscribe(
      response => {
        this.listaFichaClinica = new Array<any>();
        console.log('getFichas():', response);
        if (response.totalDatos > 0) {
          response.lista.forEach(ficha => {
            this.listaAtributos = new Array<any>();
            // fechas
            this.listaAtributos.push(ficha.idFichaClinica); // 0
            this.listaAtributos.push(ficha.fechaHora); // 1
            // profesional
            this.listaAtributos.push(ficha.idEmpleado.idPersona); // 2
            this.listaAtributos.push(ficha.idEmpleado.nombreCompleto); // 3
            // cliente
            this.listaAtributos.push(ficha.idCliente.idPersona); // 4
            this.listaAtributos.push(ficha.idCliente.nombreCompleto); // 5
            // categoria
            this.listaAtributos.push(ficha.idTipoProducto.idCategoria.idCategoria); // 6
            this.listaAtributos.push(ficha.idTipoProducto.idCategoria.descripcion); // 7
            // sub-categoria === tipoProducto
            this.listaAtributos.push(ficha.idTipoProducto.idTipoProducto); // 8
            this.listaAtributos.push(ficha.idTipoProducto.descripcion); // 9
            // de la ficha
            this.listaAtributos.push(ficha.motivoConsulta); // 10
            this.listaAtributos.push(ficha.diagnostico); // 11
            this.listaAtributos.push(ficha.observacion); // 12

            this.listaFichaClinica.push(this.listaAtributos);

            this.tableDataFicha = {
              headerRow: ['Id', 'Fecha', 'Id Pr.', 'Profesional', 'Id Clie.', 'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 
              'Sub-Categoria', 'Motivo', 'Diagnóstico', 'Observación', 'Acciones'],
              dataRows: this.listaFichaClinica
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
      url = '?ejemplo=%7B%22nombre%22%3A%22' + buscadorNombre + '%22%7D&orderBy=idPersona&orderDir=asc';
    } else {
      url = '?orderBy=idPersona&orderDir=asc';
    }
    this.listaBuscarEmpleados = new Array<any>();
    this.service.getEmpleadosBuscador(url).subscribe(
      response => {
        console.log('buscadorEmpleados: ', response);
        if (response.totalDatos > 0) {
          response.lista.forEach(
            empleado => {
              if (empleado.idLocalDefecto) {
                let lista = new Array<any>();

                // lista.push(false);
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
            });
        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  empleadoSeleccionado(id, nombre, c, d) {
    if (!this.fila) {
      console.log('empleado seleccionado del buscador: ', id, ' ', nombre, '', c, '', d);
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
      headerRow: ['Id', 'Nombre', 'Email', 'Local'],
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
    // this.fila = null;
    this.listaEmpleadoSeleccionados = [];
    this.listaNombreEmpleadoSeleccionados = [];
    this.listaBuscarEmpleados = [];
    this.tableBuscarEmpleado = {
      headerRow: ['Id', 'Nombre', 'Email', 'Local'],
      dataRows: this.listaBuscarEmpleados
    };
  }
   /*-------------------------------------------------------------------------*/
  listarClientePaginado(evento, buscarClienteNombre) {
    let inicio;
    if (evento === undefined) {
      inicio = 0;
    } else {
      inicio  = evento.pageIndex * this.pageSize;
    }
    let url = '';
    if (buscarClienteNombre !== undefined && buscarClienteNombre !== null) {
      url = '?ejemplo=%7B%22nombre%22%3A%22' + buscarClienteNombre + '%22%2C%22soloUsuariosDelSistema%22%3Anull%7D'
      //              %7B%22nombre%22%3A%22ana%22%2C%22soloUsuariosDelSistema%22%3Anull%7D
      + '&orderBy=idPersona&orderDir=asc&inicio=' + inicio + '&cantidad=' + this.pageSize;
    } else {
      url = '?ejemplo=%7B%22soloUsuariosDelSistema%22%3Anull%7D&orderBy=idPersona&orderDir=asc&inicio='
        + inicio + '&cantidad=' + this.pageSize;
    }
    this.listaBuscarClientes = new Array<any>();
    this.service.getClienteBuscadorPaginado(url).subscribe(
      response => {
        console.log('buscadorClientes: ', response);
        this.lengthBuscadorCliente = response.totalDatos;
        if (response.totalDatos > 0) {
          response.lista.forEach(
            cliente => {
              if (cliente.soloUsuariosDelSistema !== true) {
                let lista = new Array<any>();
                lista.push(cliente.idPersona); // 0
                lista.push(cliente.nombreCompleto); // 1
                lista.push(cliente.email); // 2
                this.listaBuscarClientes.push(lista);

                this.tableBuscarCliente = {
                  headerRow: ['Id', 'Nombre', 'Email'],
                  dataRows: this.listaBuscarClientes
                };
              }
            });

        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  seleccionarVariosCliente(idSeleccionado, nombreCliente) {
    console.log('idSeleccionado: ', idSeleccionado);
    console.log('lista de id seleccionados: ', this.listaClienteSeleccionados);

    // si no hay elementos en la lista --> agregar
    if (this.listaClienteSeleccionados.length === 0) {
      this.listaClienteSeleccionados.push(idSeleccionado);
      this.listaNombreClienteSeleccionados.push(nombreCliente);
    } else {
      // si el id ya está en la lista, no agregar y sacar de la lista, porque des-seleccionó en el check
      if (this.listaClienteSeleccionados.includes(idSeleccionado)) {
        let posicion = this.listaClienteSeleccionados.indexOf(idSeleccionado);
        console.log('se encuentra en la posicion: ', this.listaClienteSeleccionados.indexOf(idSeleccionado));
        // se elimina de la lista
        this.listaClienteSeleccionados.splice(posicion, 1);
        this.listaNombreClienteSeleccionados.splice(posicion, 1);
      } else {
        this.listaClienteSeleccionados.push(idSeleccionado);
        this.listaNombreClienteSeleccionados.push(nombreCliente);
      }
    }
    // solo si hay un elemento seleccionado se puede habilitar el boton de aceptar
    console.log('lista de id seleccionados al final: ', this.listaClienteSeleccionados);
  }
  /*-------------------------------------------------------------------------*/
  aceptarCliente() {
    // obtener el cliente con el unico id que esta en la lista 'listaSeleccionados'
    this.clienteId = this.listaClienteSeleccionados[0];
    this.clienteNombre = this.listaNombreClienteSeleccionados[0];
    // limpiar la grilla del buscadorEmpleado
    this.buscarClienteNombre = null;
    this.listaBuscarClientes = [];
    this.tableBuscarCliente = {
      headerRow: [ 'Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarClientes
    };
    $('#exampleModal3').modal('hide');
    // se elimina lo seleccionado
    this.listaClienteSeleccionados = [];
    this.listaNombreClienteSeleccionados = [];
    this.lengthBuscadorCliente = 0;

  }
  /*-------------------------------------------------------------------------*/
  cancelarBuscarCliente() {
    this.listaClienteSeleccionados = [];
    this.listaNombreClienteSeleccionados = [];
    this.lengthBuscadorCliente = 0;
    this.buscarClienteNombre = null;
    this.listaBuscarClientes = [];
    this.tableBuscarCliente = {
      headerRow: ['Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarClientes
    };
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
        path = path + ',"fechaHastaCadena":"' + fechaHastaCadena + '"';
        console.log('path: ', path);
      } else {
        path = '{"fechaHastaCadena":"' + fechaHastaCadena + '"';
      }
    }
    if (typeof this.empleadoId !== 'undefined' && this.empleadoId !== null) {
      if ((typeof this.fechaDesde !== 'undefined' && this.fechaDesde !== null)
        || (typeof this.fechaHasta !== 'undefined' && this.fechaHasta !== null)) {
        path = path + ',"idEmpleado":{"idPersona":' + this.empleadoId + '}';
      } else {
        path = '{"idEmpleado":{"idPersona":' + this.empleadoId + '}';
      }
    }
    if (typeof this.clienteId !== 'undefined' && this.clienteId !== null) {
      if ((typeof this.fechaDesde !== 'undefined' && this.fechaDesde !== null)
        || (typeof this.fechaHasta !== 'undefined' && this.fechaHasta !== null)
        || (typeof this.empleadoId !== 'undefined' && this.empleadoId !== null)) {
        path = path + ',"idCliente":{"idPersona":' + this.clienteId + '}';
      } else {
        path = '{"idCliente":{"idPersona":' + this.clienteId + '}';
      }
    }
    if (typeof this.idProducto !== 'undefined' && this.idProducto !== null) {
      if ((typeof this.fechaDesde !== 'undefined' && this.fechaDesde !== null)
        || (typeof this.fechaHasta !== 'undefined' && this.fechaHasta !== null)
        || (typeof this.empleadoId !== 'undefined' && this.empleadoId !== null)
        || (typeof this.clienteId !== 'undefined' && this.clienteId !== null)) {
        console.log('this.categoriaId: ', this.idCategoria);
        console.log('this.tipoProductoId: ', this.idProducto);
        path = path + ',"idTipoProducto":{"idTipoProducto":' + this.idProducto + '}';
      } else {
        path = '{"idTipoProducto":{"idTipoProducto":' + this.idProducto + '}';
      }
    }
    path = path + '}';
    console.log('path', path);
    path = encodeURIComponent(path);
    path = '?ejemplo=' + path;
    this.service.buscarFichas(path).subscribe(
      response => {
        this.listaFichaClinica = new Array<any>();
        console.log('getFichasBuscar():', response);
        if (response.totalDatos > 0) {
          response.lista.forEach(ficha => {
            this.listaAtributos = new Array<any>();
            // fechas
            this.listaAtributos.push(ficha.idFichaClinica); // 0
            this.listaAtributos.push(ficha.fechaHora); // 1
            // profesional
            this.listaAtributos.push(ficha.idEmpleado.idPersona); // 2
            this.listaAtributos.push(ficha.idEmpleado.nombreCompleto); // 3
            // cliente
            this.listaAtributos.push(ficha.idCliente.idPersona); // 4
            this.listaAtributos.push(ficha.idCliente.nombreCompleto); // 5
            // categoria
            this.listaAtributos.push(ficha.idTipoProducto.idCategoria.idCategoria); // 6
            this.listaAtributos.push(ficha.idTipoProducto.idCategoria.descripcion); // 7
            // sub-categoria === tipoProducto
            this.listaAtributos.push(ficha.idTipoProducto.idTipoProducto); // 8
            this.listaAtributos.push(ficha.idTipoProducto.descripcion); // 9
            this.listaAtributos.push(ficha.motivoConsulta); // 10
            this.listaAtributos.push(ficha.diagnostico); // 11
            this.listaAtributos.push(ficha.observacion); // 12
            
            this.listaFichaClinica.push(this.listaAtributos);

            this.tableDataFicha = {
              headerRow: ['Id', 'Fecha', 'Id Pr.', 'Profesional', 'Id Clie.', 'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 
                 'Sub-Categoria', 'Motivo', 'Diagnóstico', 'Observación', 'Acciones'],
              dataRows: this.listaFichaClinica
            };
          });
        } else {
          this.listaReservas = [];
          this.tableData1 = {
            headerRow: ['Id', 'Fecha', 'Inicio', 'Fin', 'Id Emp.', 'Empleado', 'Id Cliente', 
            'Cliente', 'Asistió', 'Estado', 'Observación', 'Acciones'],
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
    this.fechaHasta = null;
    this.fechaDesde = null;
    this.empleadoId = null;
    this.empleadoNombre = null;
    this.clienteId = null;
    this.clienteNombre = null;
    this.idCategoria = null;
    this.idProducto = null;
    // los list de los buscadores
    this.listaBuscarEmpleados = [];
    this.length = 0;
    this.listaFichaClinica = [];

    this.tableDataFicha = {
      headerRow: ['Id', 'Fecha', 'Id Pr.', 'Profesional', 'Id Clie.', 'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 
      'Sub-Categoria', 'Motivo', 'Diagnóstico', 'Observación', 'Acciones'],
      dataRows: this.listaFichaClinica
    };
  }
  /*-------------------------------------------------------------------------*/
  agregarFicha() {
    this.router.navigate(['ficha-clinica/agregar-ficha']);
  }
  /*-------------------------------------------------------------------------*/
  modificarFicha(idFicha, fechaFicha, idEmpleado, nombreEmpleado,
    idCliente, nombreCliente, idCategoria, descripcionCategoria, idSubCategoria,
    descripcionSubCategoria, motivo, diagnostico, observacion) {
    let dato: DatoModificar;
    dato = {
      idFicha: idFicha,
      fechaFicha: fechaFicha,
      idEmpleado: idEmpleado,
      nombreEmpleado: nombreEmpleado,
      idCliente: idCliente,
      nombreCliente: nombreCliente,
      idCategoria: idCategoria,
      descripcionCategoria: descripcionCategoria,
      idSubCategoria: idSubCategoria,
      descripcionSubCategoria: descripcionSubCategoria,
      motivo: motivo,
      diagnostico: diagnostico,
      observacion: observacion
    };
    this.router.navigate(['ficha-clinica/modificar-ficha', dato]);
  }
  /*-------------------------------------------------------------------------*/
  crearServicio(row) {
    console.log('filaSeleccionada para crear servicio: ', row);
    row.push('F');
    this.router.navigate(['servicio/agregar-servicio', row]);
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
    this.modificarAsistio = (asistio === 'SI' ? true : false);// (asistio === 'SI' ? 'S' : 'N');
    this.modificarObservacion = observacion;
    $('#exampleModal5').modal('show');
  }
  /*-------------------------------------------------------------------------*/
  /*modificar() {
    let dato = {
      idReserva: this.modificarIdReserva,
      observacion: (this.modificarObservacion ? this.modificarObservacion : ''),
      flagAsistio: (this.modificarAsistio ? 'S' : 'N')
    };
    console.log('datos para modificar: ', dato);
    this.service.modificarReserva(dato).subscribe(
      response => {
        console.log('modificarReserva(): ', response);
        this.showNotification('Modificación de la reserva con éxito!', NOTIFY.SUCCESS);
        this.buscar();
      },
      error => {
        this.showNotification('Error al modificar la reserva. Consulte con soporte', NOTIFY.WARNING);
      }
    );
  }*/
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
 /* isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    if (numSelected === 1) {
      this.mostrarAceptar = true;
    } else {
      this.mostrarAceptar = false;
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. *
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row *
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
*/
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
    console.log('holaMundo: ', idCategoria);
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
        path = path + ',"fechaHastaCadena":"' + fechaHastaCadena + '"';
        console.log('path: ', path);
      } else {
        path = '{"fechaHastaCadena":"' + fechaHastaCadena + '"';
      }
    }
    if (typeof this.empleadoId !== 'undefined' && this.empleadoId !== null) {
      if ((typeof this.fechaDesde !== 'undefined' && this.fechaDesde !== null)
        || (typeof this.fechaHasta !== 'undefined' && this.fechaHasta !== null)) {
        path = path + ',"idEmpleado":{"idPersona":' + this.empleadoId + '}';
      } else {
        path = '{"idEmpleado":{"idPersona":' + this.empleadoId + '}';
      }
    }
    if (typeof this.clienteId !== 'undefined' && this.clienteId !== null) {
      if ((typeof this.fechaDesde !== 'undefined' && this.fechaDesde !== null)
        || (typeof this.fechaHasta !== 'undefined' && this.fechaHasta !== null)
        || (typeof this.empleadoId !== 'undefined' && this.empleadoId !== null)) {
        path = path + ',"idCliente":{"idPersona":' + this.clienteId + '}';
      } else {
        path = '{"idCliente":{"idPersona":' + this.clienteId + '}';
      }
    }
    if (typeof this.idProducto !== 'undefined' && this.idProducto !== null) {
      if ((typeof this.fechaDesde !== 'undefined' && this.fechaDesde !== null)
        || (typeof this.fechaHasta !== 'undefined' && this.fechaHasta !== null)
        || (typeof this.empleadoId !== 'undefined' && this.empleadoId !== null)
        || (typeof this.clienteId !== 'undefined' && this.clienteId !== null)) {
        console.log('this.categoriaId: ', this.idCategoria);
        console.log('this.tipoProductoId: ', this.idProducto);
        path = path + ',"idTipoProducto":{"idTipoProducto":' + this.idProducto + '}';
      } else {
        path = '{"idTipoProducto":{"idTipoProducto":' + this.idProducto + '}';
      }
    }
    if (path.length === 0) { // cuando inicia trae todos las fichas y sin filtros
      return '';
    }
    path = path + '}';
    console.log('path', path);
    path = encodeURIComponent(path);
    path = '?ejemplo=' + path;
    return path;
  }
  /*-------------------------------------------------------------------------*/
  listarFichaPaginado(evento) {
    let inicio;
    if (evento === undefined) {
      inicio = 0;
    } else {
      inicio  = evento.pageIndex * this.pageSize;
    }
    let url = this.crearStringUrl();
    if (url === '') {
      url = '?orderBy=idFichaClinica&orderDir=asc&inicio=' + inicio + '&cantidad=' + this.pageSize;
    } else {
      url = url + '&orderBy=idFichaClinica&orderDir=asc&inicio=' + inicio + '&cantidad=' + this.pageSize;
    }
    console.log('url en: ', url);
    this.service.getFichasPaginado(url).subscribe(
      response => {
        this.listaFichaClinica = new Array<any>();
        console.log('getFichas():', response);
        this.length = response.totalDatos;
        if (response.totalDatos > 0) {
          response.lista.forEach(ficha => {
            this.listaAtributos = new Array<any>();
            // fechas
            this.listaAtributos.push(ficha.idFichaClinica); // 0
            this.listaAtributos.push(ficha.fechaHora); // 1
            // profesional
            this.listaAtributos.push(ficha.idEmpleado.idPersona); // 2
            this.listaAtributos.push(ficha.idEmpleado.nombreCompleto); // 3
            // cliente
            this.listaAtributos.push(ficha.idCliente.idPersona); // 4
            this.listaAtributos.push(ficha.idCliente.nombreCompleto); // 5
            // categoria
            this.listaAtributos.push(ficha.idTipoProducto.idCategoria.idCategoria); // 6
            this.listaAtributos.push(ficha.idTipoProducto.idCategoria.descripcion); // 7
            // sub-categoria === tipoProducto
            this.listaAtributos.push(ficha.idTipoProducto.idTipoProducto); // 8
            this.listaAtributos.push(ficha.idTipoProducto.descripcion); // 9
            // de la ficha
            this.listaAtributos.push(ficha.motivoConsulta); // 10
            this.listaAtributos.push(ficha.diagnostico); // 11
            this.listaAtributos.push(ficha.observacion); // 12

            this.listaFichaClinica.push(this.listaAtributos);

            this.tableDataFicha = {
              headerRow: ['Id', 'Fecha', 'Id Pr.', 'Profesional', 'Id Clie.', 'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 
              'Sub-Categoria', 'Motivo', 'Diagnóstico', 'Observación', 'Acciones'],
              dataRows: this.listaFichaClinica
            };
          });
        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  ngOnInit() {
    this.listarCategorias();
    console.log(new Date());
    this.fechaDesde = new Date();
    this.fechaHasta = new Date();
    this.listaClienteSeleccionado = new Array<any>();
    this.mostrarAceptar = false;
    this.listaEmpleadoSeleccionados = new Array<any>();
    this.listaNombreEmpleadoSeleccionados = new Array<any>();
    this.listaClienteSeleccionados = new Array<any>();
    this.listaNombreClienteSeleccionados = new Array<any>();
    // al iniciar busca las fichas del dia actual
    this.listarFichaPaginado(undefined);
  }

}
