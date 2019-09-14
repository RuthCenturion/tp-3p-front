import { Component, OnInit } from '@angular/core';

import { TableData } from '../../md/md-table/md-table.component';
import { CategoriaService } from '../../services/categoria.service';
import { NOTIFY } from '../../commons/app-utils';

declare const $: any;
@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit {
  codigo: any; // solo para agregar, dato requerido del back
  idPresentacionProducto: any; // --> corresponde al id del servicio
  nombre: any;
  descripcionGeneral: any;
  existenciaProducto: any;
  idProducto: any;
  descripcionProducto: any;
  idTipoProducto: any; // --> corresponde al id de la subcategoria
  descripcionTipoProducto: any;
  idCategoria: any;
  descripcionCategoria: any;
  // para modificar
  modificarIdPresentacionProducto: any; // --> corresponde al id del servicio
  modificarNombre: any;
  modificarDescripcionGeneral: any;
  modificarExistenciaProducto: any;
  modificarIdProducto: any;
  modificarDescripcionProducto: any;
  modificarIdTipoProducto: any; // --> corresponde al id de la subcategoria
  modificarDescripcionTipoProducto: any;
  modificarIdCategoria: any;
  modificarDescripcionCategoria: any;
  // para eliminar
  eliminarId: any;
  // para listar
  lista: Array<any>;
  listaProductos: Array<any>;
  listaAtributos: Array<any>;
  listaCategoria: Array<any>;
  listaSubCategoria: Array<any>;
  listaServicios: Array<any>;

  public tableData1: TableData;

  constructor(private service: CategoriaService) {
    this.tableData1 = {
      headerRow: ['Id', 'Nombre', 'Descripción', 'Acciones'],
      dataRows: this.listaServicios
    };
  }
  /*-------------------------------------------------------------------------*/
  listarProductos() {
    this.listaProductos = [];
    this.service.listarProductos().subscribe(
      response => {
        console.log('lista de productos: ', response.lista);
        if (response.totalDatos > 0) {
          response.lista.forEach(producto => {
            this.listaProductos.push(
              {
                idProducto: producto.idProducto,
                descripcionProducto: producto.descripcionGeneral
              }
            );
          });
          console.log('lista de productos: ', this.listaProductos);
        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  listarServicios() {
    this.service.getServicios().subscribe(
      response => {
        this.listaServicios = new Array<any>();
        this.listaAtributos = new Array<any>();
        if (response.totalDatos > 0) {
          response.lista.forEach(servicio => {
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(servicio.idPresentacionProducto); // 0
            this.listaAtributos.push(servicio.nombre); // 1
            this.listaAtributos.push(servicio.descripcionGeneral); // 2
            this.listaAtributos.push(servicio.existenciaProducto); // 3
            // producto
            this.listaAtributos.push(servicio.idProducto.idProducto); // 4
            this.listaAtributos.push(servicio.idProducto.descripcionGeneral); // 5
            // idTipoProducto --> subcategoria
            this.listaAtributos.push(servicio.idProducto.idTipoProducto.idTipoProducto); // 6
            this.listaAtributos.push(servicio.idProducto.idTipoProducto.descripcion); // 7
            // categoria
            this.listaAtributos.push(servicio.idProducto.idTipoProducto.idCategoria.idCategoria); // 8
            this.listaAtributos.push(servicio.idProducto.idTipoProducto.idCategoria.descripcion); // 9
            this.listaServicios.push(this.listaAtributos);
            this.tableData1 = {
              headerRow: [
                'Id', 'Nombre', 'Descripción', 'Existencia',
                'Id Prod', 'Producto',
                'Id Tipo Prod.', 'Tipo Producto',
                'Id Cat.', 'Categoria',
                'Acciones'],
              dataRows: this.listaServicios
            };
          });
        }
      },
      error => {
        this.showNotification('Error al obtener categorias', NOTIFY.DANGER);
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  agregar() {
    var dato = {
      codigo: this.codigo,
      flagServicio: 'S',
      idProducto: {
        idProducto: this.idProducto
      },
      nombre: this.nombre,
      existenciaProducto: {
        precioVenta: this.existenciaProducto
      }
    };
    console.log('datos a agregar: ', dato);
    this.service.agregarServicio(dato).subscribe(
      response => {
        this.showNotification('Servicio creado con éxito!', NOTIFY.SUCCESS);
        this.listarServicios();
        this.codigo = null;
        this.idProducto = null;
        this.nombre = null;
        this.existenciaProducto = null;
      },
      error => {
        this.showNotification('Error al agregar servicio', NOTIFY.DANGER);
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  cancelarAgregar() {
    this.codigo = null;
    this.idProducto = null;
    this.nombre = null;
    this.existenciaProducto = null;
  }
  /*-------------------------------------------------------------------------*/
  abrirModalModificar(id, nombre, desc, evento, idProducto, descProducto, idTipoProducto,
    descTipoProducto, idCat, descCat) {
    console.log('fila seleccionada: ', id, ' ', nombre, '', desc, ' ', descCat, ' ', idCat);
    this.modificarIdPresentacionProducto = id;
    this.modificarDescripcionGeneral = desc;
    this.modificarNombre = nombre;
    this.modificarExistenciaProducto = evento;
    this.modificarIdProducto = idProducto;
    this.modificarDescripcionProducto = descProducto;
    this.modificarIdTipoProducto = idTipoProducto;
    this.modificarDescripcionTipoProducto = descTipoProducto;
    this.modificarIdCategoria = idCat;
    this.modificarDescripcionCategoria = descCat;
    $('#exampleModal2').modal('show');
  }
  /*-------------------------------------------------------------------------*/
  confirmarEliminar(id, desc) {
    $('#exampleModal3').modal('show');
    this.eliminarId = id;
   // this.eliminarDescripcion = desc;
  }
  /*-------------------------------------------------------------------------*/
  eliminar() {
    //  this.showNotification('FALTA IMPLEMENTAR LLAMADO AL BACK ', NOTIFY.WARNING);
    this.service.eliminarServicio(this.eliminarId).subscribe(
      response => {
        this.showNotification('Servicio eliminado con éxito!', NOTIFY.SUCCESS);
        this.listarServicios();
      },
      error => {
        this.showNotification('Error al eliminar Servicio', NOTIFY.DANGER);
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

  ngOnInit() {
    this.codigo = null;
    this.idProducto = null;
    this.nombre = null;
    this.existenciaProducto = null;
    this.listarProductos();
    this.listarServicios();
  }

}
