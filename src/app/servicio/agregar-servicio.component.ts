import { Component, OnInit, ViewChild } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { Router } from '@angular/router';
import { NOTIFY } from '../commons/app-utils';
import { CategoriaService } from '../services/categoria.service';
import { ServicioService } from '../services/servicio.service';

declare const $: any;

@Component({
  selector: 'app-agregar-servicio',
  templateUrl: './agregar-servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class AgregarServicioComponent implements OnInit {
  public tableDataFichasAsociadas: TableData;
  public tableBuscarEmpleado: TableData;
  public tableBuscarCliente: TableData;

  // 
  fechaDesde: any;
  fechaHasta: any;
  empleadoId: any;
  empleadoNombre: any;
  clienteId: any;
  clienteNombre: any;
  idCategoria: any;
  idProducto: any;
  idServicio: any; // id del servicio creados
  tipoProductoNombre: any;
  observacion: any;
  modelAgregarDetalle: any;
  // del detalle
  precio: any;
  // buscador de empleados
  buscarEmpleadoNombre: any;
  // buscador de clientes
  buscarClienteNombre: any;

  listaAtributos: Array<any>;
  listaBuscarEmpleados: Array<any>;
  listaBuscarClientes: Array<any>;
  listaCategoria: Array<any>;
  listaSubCategoria: Array<any>;
  listaTipoServicio: Array<any>; // tipo en el detalle
  listaIdTipoServicios: Array<any>; // para obtener el precio para el detalle
  listaServicios: Array<any>;
  listaReservas: Array<any>;
  listaFichaClinica: Array<any>;
  listaHorarios: Array<any>;

  listaEmpleadoSeleccionados: Array<any>;
  listaNombreEmpleadoSeleccionados: Array<any>;
  listaClienteSeleccionados: Array<any>;
  listaNombreClienteSeleccionados: Array<any>;
  listaFichaSeleccionada: Array<any>;
  listaFichasAsociadas = new Array<any>();
  mostrarDetalles: any;
  mostarAgregarDetalle: any;
  mensajeVacio: any;

  cargado: any;
  guardado: any;

  constructor(
    private service: ServicioService,
    private categoriaService: CategoriaService,
    private router: Router) {
      
      this.listaFichasAsociadas = new Array<any>();
      this.tableDataFichasAsociadas = {
        headerRow: ['Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
          'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Acciones'],
        dataRows: this.listaFichasAsociadas
      };
    this.tableBuscarEmpleado = {
      headerRow: ['Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarEmpleados
    };
    this.tableBuscarCliente = {
      headerRow: ['Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarClientes
    };
  }
  /*-------------------------------------------------------------------------*/
  /*listarServicios() {
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
              lista.push(false); // 12
              this.listaServicios.push(lista);
              this.tableDataServicio = {
                headerRow: ['Id', 'Fecha', 'Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
                  'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Acciones'],
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
  }*/
  /*-------------------------------------------------------------------------*/
  
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
          this.listaBuscarEmpleados = new Array<any>();
          response.lista.forEach(
            empleado => {
        //      if (empleado.idLocalDefecto) {
                let lista = new Array<any>();
                lista.push(empleado.idPersona); // 0
                lista.push(empleado.nombreCompleto); // 1
                lista.push(empleado.email); // 2
                this.listaBuscarEmpleados.push(lista);
                this.tableBuscarEmpleado = {
                  headerRow: ['Id', 'Nombre', 'Email'],
                  dataRows: this.listaBuscarEmpleados
                };
        //      }
            });

        }
      }
    );
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
    this.service.getClienteBuscador(url).subscribe(
      response => {
        console.log('buscadorClientes: ', response);
        if (response.totalDatos > 0) {
          response.lista.forEach(
            cliente => {
              if (cliente.idLocalDefecto === null) {
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
  cancelar() {
    this.router.navigate(['servicio']);
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
      headerRow: ['Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarEmpleados
    };
    $('#exampleModal2').modal('hide');
    // se elimina lo seleccionado
    this.listaEmpleadoSeleccionados = [];
    this.listaNombreEmpleadoSeleccionados = [];
    /* si ya se seleccionó también un cliente, cargar la grilla de fichas 
    correspondientes a el cliente y empleado seleccionados */
    if (this.clienteId) {
      this.listarFichasAsociadas();
    } else {
      this.showNotification('Seleccionar cliente para obtener las fichas', NOTIFY.INFO);
    }
  }
  /*-------------------------------------------------------------------------*/
  cancelarBuscarEmpleado() {
    this.buscarEmpleadoNombre = null;
    // this.fila = null;
    this.listaEmpleadoSeleccionados = [];
    this.listaNombreEmpleadoSeleccionados = [];
    this.listaBuscarEmpleados = [];
    this.tableBuscarEmpleado = {
      headerRow: ['Id', 'Nombre', 'Email'],
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
      headerRow: ['Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarClientes
    };
    $('#exampleModal3').modal('hide');
    // se elimina lo seleccionado
    this.listaClienteSeleccionados = [];
    this.listaNombreClienteSeleccionados = [];
    /* si ya se seleccionó también un cliente, cargar la grilla de fichas 
    correspondientes a el cliente y empleado seleccionados */
    if (this.empleadoId) {
      this.listarFichasAsociadas();
    } else {
      this.showNotification('Seleccionar empleado para obtener las fichas', NOTIFY.INFO);
    }
  }
   /*-------------------------------------------------------------------------*/
   cancelarBuscarCliente() {
    this.buscarClienteNombre = null;
    // this.fila = null;
    this.listaClienteSeleccionados = [];
    this.listaNombreClienteSeleccionados = [];
    this.listaBuscarClientes = [];
    this.tableBuscarCliente = {
      headerRow: ['Id', 'Nombre', 'Email'],
      dataRows: this.listaBuscarClientes
    };
  }
  /*-------------------------------------------------------------------------*/
  listarFichasAsociadas() {
    let path = '{"idCliente":{"idPersona":' + this.clienteId + '},"idEmpleado":{"idPersona":' + this.empleadoId + '}}';
    console.log('path', path);
    path = encodeURIComponent(path);
    path = '?ejemplo=' + path;
    this.service.getFichasAsociadas(path).subscribe(
      response => {
        console.log('listarServiciosAsociados(): ' + response);
        if (response.totalDatos > 0) {
          this.listaFichasAsociadas = new Array<any>();
          response.lista.forEach(
            ficha => {
              let lista = new Array<any>();
              // ficha
              lista.push(ficha.idFichaClinica); // 0
              lista.push(ficha.fechaHora); // 1
              // profesional
              lista.push(ficha.idEmpleado.idPersona); // 2
              lista.push(ficha.idEmpleado.nombreCompleto); // 3
              // cliente
              lista.push(ficha.idCliente.idPersona); // 4
              lista.push(ficha.idCliente.nombreCompleto); // 5
              // categoria
              lista.push(ficha.idTipoProducto.idCategoria.idCategoria); // 6
              lista.push(ficha.idTipoProducto.idCategoria.descripcion); // 7
              // sub-categoria
              lista.push(ficha.idTipoProducto.idTipoProducto); // 8
              lista.push(ficha.idTipoProducto.descripcion); // 9
              this.listaFichasAsociadas.push(lista);
              this.tableDataFichasAsociadas = {
                headerRow: ['Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
                  'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Acciones'],
                dataRows: this.listaFichasAsociadas
              };
            },
            error => {
              // this.mensajeVacio = SIN_DATOS;
              this.listaFichasAsociadas = [];
              this.tableDataFichasAsociadas = {
                headerRow: ['Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
                  'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Acciones'],
                dataRows: this.listaFichasAsociadas
              };
            });
        } else {
          this.mensajeVacio = 'Búsqueda sin resultados';
          this.listaFichasAsociadas = [];
              this.tableDataFichasAsociadas = {
                headerRow: ['Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
                  'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria', 'Acciones'],
                dataRows: this.listaFichasAsociadas
              };
        }
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
  listarTipoServicio() {
    this.categoriaService.getServicios().subscribe(
      response => {
        this.listaAtributos = new Array<any>();
        this.listaTipoServicio = new Array<any>();
        this.listaIdTipoServicios = new Array<any>();
        response.lista.forEach(tipo => {
          this.listaAtributos = new Array<any>();
          this.listaAtributos.push(tipo.idPresentacionProducto);
          this.listaAtributos.push(tipo.descripcionGeneral);
          this.listaAtributos.push(tipo.existenciaProducto);
          this.listaIdTipoServicios.push(tipo.idPresentacionProducto);
          this.listaTipoServicio.push(this.listaAtributos);
        });
      },
      error => {
        this.showNotification('Error al obtener sub-categorias', NOTIFY.DANGER);
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  obtenerPrecio(idPresentacionProducto) {
    let index = this.listaIdTipoServicios.indexOf(idPresentacionProducto);
    this.precio = this.listaTipoServicio[index].existenciaProducto ? this.listaTipoServicio[index].existenciaProducto : 0;

    console.log('---',  this.precio ); // { nombre: 'cerezas', cantidad: 5 }
  }
  /*-------------------------------------------------------------------------*/
  seleccionarUnaFicha(idFichaSeleccionada) {
    console.log('idFichaSeleccionada: ', idFichaSeleccionada);
    console.log('lista de id seleccionados: ', this.listaFichaSeleccionada);

    // si no hay elementos en la lista --> agregar
    if (this.listaFichaSeleccionada.length === 0) {
      this.listaFichaSeleccionada.push(idFichaSeleccionada);
    } else {
      // si el id ya está en la lista, no agregar y sacar de la lista, porque des-seleccionó en el check
      if (this.listaFichaSeleccionada.includes(idFichaSeleccionada)) {
        let posicion = this.listaFichaSeleccionada.indexOf(idFichaSeleccionada);
        console.log('se encuentra en la posicion: ', this.listaFichaSeleccionada.indexOf(idFichaSeleccionada));
        // se elimina de la lista
        this.listaFichaSeleccionada.splice(posicion, 1);
      } else {
        this.listaFichaSeleccionada.push(idFichaSeleccionada);
      }
    }
    // solo si hay un elemento seleccionado se puede habilitar el boton de aceptar
    console.log('lista de id seleccionados al final: ', this.listaFichaSeleccionada);
  }
  /*-------------------------------------------------------------------------*/
  guardarServicio() {
    let dato = {
      observacion: this.observacion,
      idFichaClinica: {
        idFichaClinica: this.listaFichaSeleccionada[0]
      }
    };
    this.service.agregarServicio(dato).subscribe(
      servicio => {
        console.log('servicio creado: ', servicio);
        this.mostrarDetalles = true;
        this.mostarAgregarDetalle = true;
        this.idServicio =  servicio;
        this.guardado = true;
        this.showNotification('Servicio creado con éxito!', NOTIFY.SUCCESS);
      },
      error => {
        this.mostrarDetalles = false;
        this.mostarAgregarDetalle = false;
        this.idServicio =  null;
        this.showNotification('Error al crear el servicio. Consulte con soporte', NOTIFY.DANGER);
      }
    );
    /*
        { 
        "cantidad": 1,
        "idPresentacionProducto":{
        "idPresentacionProducto":31
        },
        "idServicio":{
        "idServicio":3
        }
        }*/
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
  }
  /*-------------------------------------------------------------------------*/
  ngOnInit() {
    this.listaEmpleadoSeleccionados = new Array<any>();
    this.listaNombreEmpleadoSeleccionados = new Array<any>();
    this.listaClienteSeleccionados = new Array<any>();
    this.listaNombreClienteSeleccionados = new Array<any>();
    this.listaFichaSeleccionada = new Array<any>();
    this.mostrarDetalles = false;
    this.mostarAgregarDetalle = false;
    this.listarCategorias();
    this.listarTipoServicio();
    this.idServicio = null;
    this.cargado = false;
    this.guardado = false;
    // this.listarSubCategorias();
  //  this.listarServicios();
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
