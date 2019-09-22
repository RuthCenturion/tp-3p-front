import { Component, OnInit, ViewChild } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { Router } from '@angular/router';
import { NOTIFY } from '../commons/app-utils';
import { CategoriaService } from '../services/categoria.service';
import { ServicioService } from '../services/servicio.service';
import { ExcelServiceService } from '../services/excel-service.service';
import { PageEvent } from '@angular/material';
import * as jsPdf from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

declare const $: any;

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit {
  public tableDataServicio: TableData;
  public tableBuscarEmpleado: TableData;
  public tableBuscarCliente: TableData;
  public tableDataReporte: TableData;

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
  // buscador de empleados
  buscarEmpleadoNombre: any;
  // buscador de clientes
  buscarClienteNombre: any;

  listaAtributos: Array<any>;
  listaBuscarEmpleados: Array<any>;
  listaBuscarClientes: Array<any>;
  listaCategoria: Array<any>;
  listaSubCategoria: Array<any>;
  listaServicios: Array<any>;
  listaReservas: Array<any>;
  listaFichaClinica: Array<any>;
  listaHorarios: Array<any>;
  listaServiciosReporte: Array<any>;

  listaEmpleadoSeleccionados: Array<any>;
  listaNombreEmpleadoSeleccionados: Array<any>;
  listaClienteSeleccionados: Array<any>;
  listaNombreClienteSeleccionados: Array<any>;
  mostrarBoton: any;
  mensajeVacio: any;

 // MatPaginator Inputs
 length;
 pageSize = 5;

 // MatPaginator Output
 pageEvent: PageEvent;

  constructor(
    private service: ServicioService,
    private categoriaService: CategoriaService,
    private excelService:ExcelServiceService,
    private router: Router) {
      this.listaServicios = new Array<any>();
    this.tableDataServicio = {
      headerRow: ['Id', 'Fecha', 'Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
        'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Observación', 'Acciones'],
      dataRows: this.listaServicios
    };
    this.tableBuscarEmpleado = {
      headerRow: ['', 'Id', 'Nombre', 'Email', 'Local'],
      dataRows: this.listaBuscarEmpleados
    };
    this.tableBuscarCliente = {
      headerRow: ['', 'Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarClientes
    };
    this.tableDataReporte = {
      headerRow: ['Fecha', 'Profesional', 'Cliente', 'Sub-Categoria', 'Presupuesto'],
      dataRows: this.listaServiciosReporte
    };
  }
  /*-------------------------------------------------------------------------*/
  listarServicios() {
    this.service.getServicios().subscribe(
      response => {
        console.log('totalServicio(): ', response);
        if (response.totalDatos > 0) {
          this.listaServicios = new Array<any>();
          response.lista.forEach(
            servicio => {
              let lista = new Array<any>();
              // servicio
              lista.push(servicio.idServicio); // 0
              lista.push(servicio.fechaHora); // 1
              // ficha
              lista.push(servicio.idFichaClinica.idFichaClinica); // 2
              lista.push(servicio.idFichaClinica.fechaHora); // 3
              // profesional
              lista.push(servicio.idEmpleado.idPersona); // 4
              lista.push(servicio.idEmpleado.nombreCompleto); // 5
              // cliente
              lista.push(servicio.idFichaClinica.idCliente.idPersona); // 6
              lista.push(servicio.idFichaClinica.idCliente.nombreCompleto); // 7
              // categoria
              lista.push(servicio.idFichaClinica.idTipoProducto.idCategoria.idCategoria); // 8
              lista.push(servicio.idFichaClinica.idTipoProducto.idCategoria.descripcion); // 9
              // sub-categoria
              lista.push(servicio.idFichaClinica.idTipoProducto.idTipoProducto); // 10
              lista.push(servicio.idFichaClinica.idTipoProducto.descripcion); // 11
              lista.push(servicio.observacion); // 12 no se muestra
              this.listaServicios.push(lista);
              this.tableDataServicio = {
                headerRow: ['Id', 'Fecha', 'Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
                  'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Observacion',  'Acciones'],
                dataRows: this.listaServicios
              };
            },
            error => {
              this.listaServicios = [];
              this.tableDataServicio = {
                headerRow: ['Id', 'Fecha', 'Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
                  'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Acciones'],
                dataRows: this.listaServicios
              };
            });
        }
      }
    );
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
        path = path + ',"idFichaClinica":{"idCliente":{"idPersona":' + this.clienteId + '}}';
      } else {
        path = '{"idFichaClinica":{"idCliente":{"idPersona":' + this.clienteId + '}}';
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
    this.service.buscarServicios(path).subscribe(
      response => {
        console.log('buscarServicios(conParametros): ', response);
        if (response.totalDatos > 0) {
          this.listaServicios = new Array<any>();
          response.lista.forEach(
            servicio => {
              let lista = new Array<any>();
              // servicio
              lista.push(servicio.idServicio); // 0
              lista.push(servicio.fechaHora); // 1
              // ficha
              lista.push(servicio.idFichaClinica.idFichaClinica); // 2
              lista.push(servicio.idFichaClinica.fechaHora); // 3
              // profesional
              lista.push(servicio.idEmpleado.idPersona); // 4
              lista.push(servicio.idEmpleado.nombreCompleto); // 5
              // cliente
              lista.push(servicio.idFichaClinica.idCliente.idPersona); // 6
              lista.push(servicio.idFichaClinica.idCliente.nombreCompleto); // 7
              // categoria
              lista.push(servicio.idFichaClinica.idTipoProducto.idCategoria.idCategoria); // 8
              lista.push(servicio.idFichaClinica.idTipoProducto.idCategoria.descripcion); // 9
              // sub-categoria
              lista.push(servicio.idFichaClinica.idTipoProducto.idTipoProducto); // 10
              lista.push(servicio.idFichaClinica.idTipoProducto.descripcion); // 11
              lista.push(servicio.observacion); // 12 no se muestra
              this.listaServicios.push(lista);
              this.tableDataServicio = {
                headerRow: ['Id', 'Fecha', 'Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
                  'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Observacion', 'Acciones'],
                dataRows: this.listaServicios
              };
            },
            error => {
              this.listaServicios = [];
              this.tableDataServicio = {
                headerRow: ['Id', 'Fecha', 'Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
                  'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Acciones'],
                dataRows: this.listaServicios
              };
            });
        } else {
          this.mensajeVacio = 'Búsqueda sin resultados';
          this.listaServicios = [];
          this.tableDataServicio = {
            headerRow: ['Id', 'Fecha', 'Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
              'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Acciones'],
            dataRows: this.listaServicios
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
        console.log('buscadorEmpleados: ', response);
        if (response.totalDatos > 0) {
          response.lista.forEach(
            empleado => {
              if (empleado.idLocalDefecto) {
                let lista = new Array<any>();

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
                };
              }
            });
            console.log('lista empleado buscador: ', this.listaBuscarEmpleados);

        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  listarClientesBuscador(buscadorNombre) {
    // let buscadorNombre = 'Gustavo'
    // let url = '?ejemplo=%7B%22nombre%22%3A%22' + buscadorNombre + '%22%7D';
    let url = '';
    if (buscadorNombre) {
      url = '?ejemplo=%7B%22nombre%22%3A%22' + buscadorNombre + '%22%7D';
    } else {
      url = '';
    }
    this.listaBuscarClientes = new Array<any>();
    this.service.getClienteBuscador(url).subscribe(
      response => {
        console.log('buscadorClientes: ', response);
        if (response.totalDatos > 0) {
          response.lista.forEach(
            cliente => {
              if (cliente.idLocalDefecto === null) {
                let lista = new Array<any>();

                lista.push(false);
                lista.push(cliente.idPersona); // 0
                lista.push(cliente.nombreCompleto); // 1
                lista.push(cliente.email); // 2
                this.listaBuscarClientes.push(lista);

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
  agregarServicio() {
    this.router.navigate(['servicio/agregar-servicio']);
  }
  /*-------------------------------------------------------------------------*/
  modificarServicio(row) {
    console.log('fila seleccionada a modificar: ', row);
    this.router.navigate(['servicio/modificar-servicio', row]);
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
    // this.fila = null;
    this.listaEmpleadoSeleccionados = [];
    this.listaNombreEmpleadoSeleccionados = [];
    this.listaBuscarEmpleados = [];
    this.tableBuscarEmpleado = {
      headerRow: ['', 'Id', 'Nombre', 'Email', 'Local'],
      dataRows: this.listaBuscarEmpleados
    };
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
    // obtener el empleado con el unico id que esta en la lista 'listaSeleccionados'
    this.clienteId = this.listaClienteSeleccionados[0];
    this.clienteNombre = this.listaNombreClienteSeleccionados[0];
    // limpiar la grilla del buscadorEmpleado
    this.buscarClienteNombre = null;
    this.listaBuscarClientes = [];
    this.tableBuscarCliente = {
      headerRow: ['', 'Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarClientes
    };
    $('#exampleModal3').modal('hide');
    // se elimina lo seleccionado
    this.listaClienteSeleccionados = [];
    this.listaNombreClienteSeleccionados = [];
  }
   /*-------------------------------------------------------------------------*/
   cancelarBuscarCliente() {
    this.buscarClienteNombre = null;
    // this.fila = null;
    this.listaClienteSeleccionados = [];
    this.listaNombreClienteSeleccionados = [];
    this.listaBuscarClientes = [];
    this.tableBuscarCliente = {
      headerRow: ['', 'Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarClientes
    };
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
  /*-------------------------------------------------------------------------*/
  obtenerServiciosReporte() {
    let url = this.crearStringUrl();
    this.listaServiciosReporte = new Array<any>();
    this.service.buscarServicios(url).subscribe(
      response => {
        if (response.totalDatos > 0) {
          response.lista.forEach(
            servicio => {
              let lista = new Array<any>();
              lista.push(servicio.fechaHora); // 0
              lista.push(servicio.idEmpleado.nombreCompleto); // 1
              lista.push(servicio.idFichaClinica.idCliente.nombreCompleto); // 2
              lista.push(servicio.idFichaClinica.idTipoProducto.descripcion); // 3
              lista.push(servicio.observacion); // 4
              this.listaServiciosReporte.push(lista);
              this.tableDataReporte = {
                headerRow: ['Fecha', 'Profesional', 'Cliente', 'Sub-Categoria', 'Presuepuesto'],
                dataRows: this.listaServiciosReporte
              };
            });
            this.abrirModalReporte();
            console.log('lista: ', this.listaServiciosReporte);
        } /*else {
          this.listaServiciosReporte = [];
        }*/
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  abrirModalReporte() {
    $('#modalReporte').modal('show');
  }
  /*-------------------------------------------------------------------------*/
  crearStringUrl() {
    let path = '';
    let fechaHastaCadena = '';
    if (typeof this.fechaDesde !== 'undefined' && this.fechaDesde !== null) {
      let fechaDesdeString = this.fechaCadena(this.fechaDesde);
      path = '{"fechaDesdeCadena":"' + fechaDesdeString + '"';
    }
    if (typeof this.fechaHasta !== 'undefined' && this.fechaHasta !== null) {
      fechaHastaCadena = this.fechaCadena(this.fechaHasta);
      if (typeof this.fechaDesde !== 'undefined' && this.fechaDesde !== null) {
        path = path + ',"fechaHastaCadena":"' + fechaHastaCadena + '"';
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
        path = path + ',"idFichaClinica":{"idCliente":{"idPersona":' + this.clienteId + '}}';
      } else {
        path = '{"idFichaClinica":{"idCliente":{"idPersona":' + this.clienteId + '}}';
      }
    }
    if (typeof this.idProducto !== 'undefined' && this.idProducto !== null) {
      if ((typeof this.fechaDesde !== 'undefined' && this.fechaDesde !== null)
        || (typeof this.fechaHasta !== 'undefined' && this.fechaHasta !== null)
        || (typeof this.empleadoId !== 'undefined' && this.empleadoId !== null)
        || (typeof this.clienteId !== 'undefined' && this.clienteId !== null)) {
        path = path + ',"idFichaClinica":{"idTipoProducto":{"idTipoProducto":' + this.idProducto + '}}';
      } else {
        path = '{"idFichaClinica":{"idTipoProducto":{"idTipoProducto":' + this.idProducto + '}}';
      }
    }
    if (path.length === 0) { // cuando inicia trae todos los servicios y sin filtros
      return null;
    }
    path = path + '}';
    path = encodeURIComponent(path);
    path = '?ejemplo=' + path;
    return path;
  }
  /*-------------------------------------------------------------------------*/
  generarPdf() {
    console.log('lista para reporte: ', this.listaServiciosReporte);
    let doc  = new jsPdf ();         // doc.text( this.listaServiciosReporte , 10 , 10 );
      doc.autoTable({html: '#my-table'});
      doc.save('table.pdf');
  }
  /*-------------------------------------------------------------------------*/
  generarExcel() {
    let fechaHora= new Date();
    let mes = '';
    if ((fechaHora.getMonth() + 1) < 10) {
      mes = '0' + (fechaHora.getMonth() + 1).toString();
    } else {
      mes = (fechaHora.getMonth() + 1).toString();
    }
    let fechaHoraString = fechaHora.getFullYear().toString() +
      mes + fechaHora.getDate().toString() + fechaHora.getHours().toString() + fechaHora.getMinutes().toString() +
      fechaHora.getSeconds().toString();
    console.log('nombre: ', fechaHoraString);
    let lista = [];
    this.listaServiciosReporte.forEach( fila => {
      lista.push( {
        'Fecha': fila[0],
        'Especialista': fila[1],
        'Cliente': fila[2],
        'Sub-Categoría': fila[3],
        'Presupuesto': fila[4],
      });
    });
    this.excelService.exportAsExcelFile(lista, 'reporte' + fechaHoraString);
  }
  /*-------------------------------------------------------------------------*/
  /*cerrarModalReporte() {

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
  listarServicioPaginado(evento: any) {
    let inicio;
    if(evento == undefined) {
      inicio = 0
    } else {
      inicio  = evento.pageIndex * this.pageSize;
    }
    let url = this.crearStringUrl();
    console.log('url en: ', url);
    this.service.buscarServiciosPaginado(url, inicio, this.pageSize).subscribe(
      response => {
        console.log('buscarServicios(conParametros): ', response);
        this.length = response.totalDatos;
        if (response.totalDatos > 0) {
          this.listaServicios = new Array<any>();
          response.lista.forEach(
            servicio => {
              let lista = new Array<any>();
              // servicio
              lista.push(servicio.idServicio); // 0
              lista.push(servicio.fechaHora); // 1
              // ficha
              lista.push(servicio.idFichaClinica.idFichaClinica); // 2
              lista.push(servicio.idFichaClinica.fechaHora); // 3
              // profesional
              lista.push(servicio.idEmpleado.idPersona); // 4
              lista.push(servicio.idEmpleado.nombreCompleto); // 5
              // cliente
              lista.push(servicio.idFichaClinica.idCliente.idPersona); // 6
              lista.push(servicio.idFichaClinica.idCliente.nombreCompleto); // 7
              // categoria
              lista.push(servicio.idFichaClinica.idTipoProducto.idCategoria.idCategoria); // 8
              lista.push(servicio.idFichaClinica.idTipoProducto.idCategoria.descripcion); // 9
              // sub-categoria
              lista.push(servicio.idFichaClinica.idTipoProducto.idTipoProducto); // 10
              lista.push(servicio.idFichaClinica.idTipoProducto.descripcion); // 11
              lista.push(servicio.observacion); // 12 no se muestra
              this.listaServicios.push(lista);
              this.tableDataServicio = {
                headerRow: ['Id', 'Fecha', 'Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
                  'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Observacion', 'Acciones'],
                dataRows: this.listaServicios
              };
            },
            error => {
              this.listaServicios = [];
              this.tableDataServicio = {
                headerRow: ['Id', 'Fecha', 'Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
                  'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Acciones'],
                dataRows: this.listaServicios
              };
            });
        } else {
          this.mensajeVacio = 'Búsqueda sin resultados';
          this.listaServicios = [];
          this.tableDataServicio = {
            headerRow: ['Id', 'Fecha', 'Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
              'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Acciones'],
            dataRows: this.listaServicios
          };
        }
      }
    );



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

    this.listaServicios = [];
    this.length = 0;
    // this.pageSize = 0;
    this.tableDataServicio = {
      headerRow: ['Id', 'Fecha', 'Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
        'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Observacion', 'Acciones'],
      dataRows: this.listaServicios};
  }
  /*-------------------------------------------------------------------------*/
  ngOnInit() {
    this.listaEmpleadoSeleccionados = new Array<any>();
    this.listaNombreEmpleadoSeleccionados = new Array<any>();
    this.listaClienteSeleccionados = new Array<any>();
    this.listaNombreClienteSeleccionados = new Array<any>();
    this.listaServiciosReporte = new Array<any>();
    this.mostrarBoton = false;
    this.listarCategorias();
    // this.listarSubCategorias();
 //   this.listarServicios();
    this.listarServicioPaginado(undefined);
    // al iniciar busca las reservas del dia actual
    /* console.log(new Date());
     this.fechaDesde = new Date();
     this.fechaHasta = new Date();
     //  this.buscar();
     this.listaClienteSeleccionado = new Array<any>();
     this.dataSource.paginator = this.paginator;
     this.mostrarAceptar = false;*/
    // this.listarEmpleadosBuscador();
  }

}
