import { Component, OnInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NOTIFY } from '../commons/app-utils';
import { ServicioService } from '../services/servicio.service';
import { CategoriaService } from '../services/categoria.service';

declare const $: any;

@Component({
  selector: 'app-modificar-servicio',
  templateUrl: './modificar-servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ModificarServicioComponent implements OnInit {
  public tableDataFichasAsociadas: TableData;
  public tableDataDetalle: TableData;
  
  mensajeVacio: any;

  idServicio: any;
  fechaHoraServicio: any;
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
  observacion: any;
  precio: any;
  cantidad: any;
  idTipoServicio: any;
  
  // listaServicios: Array<any>;
  listaFichasAsociadas: Array<any>;
  listaDetalles: Array<any>;
  listaTipoServicio: Array<any>; // tipo en el detalle
  listaIdTipoServicios: Array<any>; // para obtener el precio para el detalle

  constructor(
    private service: ServicioService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router, ) {
    this.listaFichasAsociadas = new Array<any>();
    this.tableDataFichasAsociadas = {
      headerRow: ['Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
        'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria'],
      dataRows: this.listaFichasAsociadas
    };
    this.listaDetalles = new Array<any>();
    this.tableDataDetalle = {
      headerRow: ['Id. Detalle', 'Id Pres.', 'Presentación', 'Precio Unit.', 'Cantidad', 'Total', 'Acciones'],
      dataRows: this.listaDetalles
    };
  }
  /*-------------------------------------------------------------------------*/
  /*-------------------------------------------------------------------------*/
  listarFichasAsociadasAlServicio() {
    //  if (response.totalDatos > 0) {
    this.listaFichasAsociadas = new Array<any>();
    // response.lista.forEach();
    let lista = new Array<any>();
    // ficha
    lista.push(this.idFicha); // 0
    lista.push(this.fechaFicha); // 1
    // profesional
    lista.push(this.idEmpleado); // 2
    lista.push(this.nombreEmpleado); // 3
    // cliente
    lista.push(this.idCliente); // 4
    lista.push(this.nombreCliente); // 5
    // categoria
    lista.push(this.idCategoria); // 6
    lista.push(this.descripcionCategoria); // 7
    // sub-categoria
    lista.push(this.idSubCategoria); // 8
    lista.push(this.descripcionSubCategoria); // 9
    this.listaFichasAsociadas.push(lista);
    console.log('lista de fichasAsociadas: ', this.listaFichasAsociadas);
    this.tableDataFichasAsociadas = {
      headerRow: ['Ficha', 'Fecha Ficha', 'Id Pr.', 'Profesional', 'Id Clie.',
        'Cliente', 'Id Cat', 'Categoria', 'Id Sub-Cat.', 'Sub-Categoria'],
      dataRows: this.listaFichasAsociadas
    };
  }
  /*-------------------------------------------------------------------------*/
  listarDetallesDelServicio() {
    let url = '/' + this.idServicio + '/detalle';
    this.service.listarDetallesDelServicio(url).subscribe(
      response => {
        if (response.length > 0) {
          console.log('totalDetalles: ', response);
          this.listaDetalles = new Array<any>();
          response.forEach(detalle => {
            let lista = new Array<any>();
            lista.push(detalle.idServicioDetalle); // 0
            lista.push(detalle.idPresentacionProducto.idPresentacionProducto); // 1
            lista.push(detalle.idPresentacionProducto.descripcionGeneral) //2
            // en la imagen hay un PRECIO-UNITARIO, no encontrado en el response de detalles
            lista.push('P.U.'); // 3
            lista.push(detalle.cantidad); // 4
            // en la imagen hay un PRECIO-UNITARIO, no encontrado en el response de detalles
            lista.push('TOTAL'); // 5, lo mismo que precio-unitario
            this.listaDetalles.push(lista);
            this.tableDataDetalle = {
              headerRow: ['Id. Detalle', 'Id Pres.', 'Presentación', 'Precio Unit.', 'Cantidad', 'Total', 'Acciones'],
              dataRows: this.listaDetalles
            };
          });
        } else {
          this.mensajeVacio = 'Sin datos';
          this.listaDetalles = [];
          this.tableDataDetalle = {
            headerRow: ['Id. Detalle', 'Id Pres.', 'Presentación', 'Precio Unit.', 'Cantidad', 'Total', 'Acciones'],
            dataRows: this.listaDetalles
          };
        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  agregarDetalle() {
    console.log('agregar detalle');
    let dato = {
      cantidad: this.cantidad,
      idPresentacionProducto: {
        idPresentacionProducto: this.idTipoServicio
      },
      idServicio: {
        idServicio: this.idServicio
      }
    };
    let url = '/' + this.idServicio + '/detalle';
    this.service.agregarDetalle(url, dato).subscribe(
      response => {
        this.showNotification('Detalle agregado con éxito!.', NOTIFY.SUCCESS);
        this.idTipoServicio = null;
        this.cantidad = null;
        this.listarDetallesDelServicio();
      },
      error => {
        this.showNotification('Error al agregar el detalle. Consulte con soporte', NOTIFY.DANGER);
        this.listarDetallesDelServicio();
      }
    );
    
  }
  confirmarEliminar(idDetalle) {
    console.log('confirmar eliminar detalle ', idDetalle);
  }
  /*-------------------------------------------------------------------------*/
  listarTipoServicio() {
    this.categoriaService.getServicios().subscribe(
      response => {
        this.listaTipoServicio = new Array<any>();
        this.listaIdTipoServicios = new Array<any>();
        response.lista.forEach(tipo => {
         let listaAtributos = new Array<any>();
          listaAtributos.push(tipo.idPresentacionProducto);
          listaAtributos.push(tipo.descripcionGeneral);
          listaAtributos.push(tipo.existenciaProducto);
          this.listaIdTipoServicios.push(tipo.idPresentacionProducto);
          this.listaTipoServicio.push(listaAtributos);
        });
      },
      error => {
        this.showNotification('Error al obtener tipos de servicio', NOTIFY.DANGER);
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
    this.listaFichasAsociadas = new Array<any>();
    this.listaDetalles = new Array<any>();
    
    this.route.params.subscribe(params => {
      console.log('hola mundo: ', params);
      this.idServicio = params[0];
      this.fechaHoraServicio = params[1];
      this.idFicha = params[2];
      this.fechaFicha = params[3];
      this.idEmpleado = params[4];
      this.nombreEmpleado = params[5];
      this.idCliente = params[6];
      this.nombreCliente = params[7];
      this.idCategoria = params[8];
      this.descripcionCategoria = params[9];
      this.idSubCategoria = params[10];
      this.descripcionSubCategoria = params[11];
      this.observacion = params[12];
    });
    this.listarFichasAsociadasAlServicio();
    this.listarDetallesDelServicio();
    this.listarTipoServicio();
  }

}
