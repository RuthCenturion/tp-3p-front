import { Component, Input, OnInit, ViewChild,  ElementRef } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { Router } from '@angular/router';
import { NOTIFY } from '../commons/app-utils'
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { FichaClinicaService } from '../services/ficha-clinica.service';
import { CategoriaService } from '../services/categoria.service';

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
  selector: 'app-agregar-ficha',
  templateUrl: './agregar-ficha.component.html',
  styleUrls: ['./agregar-ficha.component.css']
})
export class AgregarFichaComponent implements OnInit {  ELEMENT_DATA: PeriodicElement[] = [];

  
  public tableBuscarEmpleado: TableData;
  public tableBuscarCliente: TableData;
  public tableDataFicha: TableData;

  // datos a guardar
  fechaDesde: any;
  empleadoId: any;
  empleadoNombre: any;
  clienteId: any;
  clienteNombre: any;
  idCategoria: any;
  idProducto: any;
  tipoProductoNombre: any;
  motivo: any;
  diagnostico: any;
  observacion: any;
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

  // panelOpenState = false;
  listaAtributos: Array<any>;
  listaBuscarEmpleados: Array<any>;
  listaBuscarClientes: Array<any>;
  listaCategoria: Array<any>;
  listaSubCategoria: Array<any>;
  listaReservas: Array<any>;
  listaFichaClinica: Array<any>;
  listaHorarios: Array<any>;

  // archivo
  multiple: any;
  files: File[] = [];
  @Input()
  deleteButtonIcon = 'close';

  @ViewChild('fileUpload', {static: true}) fileUpload: ElementRef;


  displayedColumns: string[] = ['select', 'position', 'idCliente', 'name', 'email'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service: FichaClinicaService,
    private categoriaService: CategoriaService,
    private router: Router,
    private sanitizer: DomSanitizer ) {
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
        if (response.totalDatos > 0 ) {
          response.lista.forEach(
            empleado => {
              let lista = new Array<any>();
              if (empleado.idLocalDefecto) {
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
    // limpiar la grilla del buscadorEmpleado
    this.buscarEmpleadoNombre = null;
    this.listaBuscarEmpleados = [];
    this.tableBuscarEmpleado = {
      headerRow: ['', 'Id', 'Nombre', 'Email', 'Local'],
      dataRows: this.listaBuscarEmpleados
    };
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
    this.paginator.pageIndex = 0;
    this,this.dataSource.paginator = this.paginator;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  }
  /*-------------------------------------------------------------------------*/
  guardarFicha() {
    let dato = {
      motivoConsulta: this.motivo,
      diagnostico: this.diagnostico,
      observacion: this.observacion,
      idEmpleado: {
        idPersona: this.empleadoId
      },
      idCliente: {
        idPersona: this.clienteId
      },
      idTipoProducto: {
        idTipoProducto: this.idProducto
      }
    };
    console.log('archivos a subir: ', this.files);
    try {
      this.service.agregarFicha(dato).subscribe(
        response => {
          console.log('postFicha(): ', response);
          if (this.files.length > 0 ) {
            // subir los archivos seleccionados con el id generado
           /* this.files.forEach(
              file => {
                this.service.subirArchivo(file, response.idFichaClinica).subscribe(
                  res => {
                    let ix;
                    if (this.files && -1 !== (ix = this.files.indexOf(file))) {
                      this.files.splice(ix, 1);
                      this.clearInputElement();
                    }
                  }
                );
            });*/
            for (let i = 0; i < this.files.length; i++) {
              this.service.subirArchivo(this.files[i], response.idFichaClinica).subscribe(
                res => {
                  let ix;
                  if (this.files && -1 !== (ix = this.files.indexOf(this.files[i]))) {
                    this.files.splice(ix, 1);
                    this.clearInputElement();
                  }
                }
              );
            }
            this.files = [];
          }
          this.showNotification('Ficha creada con éxito!', NOTIFY.SUCCESS);
          this.limpiar();
        },
      );
    } catch (e) {
      this.showNotification('Ocurrió un error al agregar ficha. Consulte con soporte', NOTIFY.DANGER);
    }
  }
  
   /*-------------------------------------------------------------------------*/
  removeFile(event, file) {
    let ix;
    if (this.files && -1 !== (ix = this.files.indexOf(file))) {
      this.files.splice(ix, 1);
      // this.limpiar();
      this.clearInputElement();
    }
  }
  /*-------------------------------------------------------------------------*/
  clearInputElement() {
    this.fileUpload.nativeElement.value = '';
  }
  /*-------------------------------------------------------------------------*/
  cancelarAgregar() {
    // this.router
    this.router.navigate(['ficha-clinica']);
  }
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
  limpiar() {
    this.fechaDesde = new Date();
    this.empleadoId = null;
    this.empleadoNombre = null;
    this.clienteId = null;
    this.clienteNombre = null;
    this.idCategoria = null;
    this.idProducto = null;
    this.motivo = null;
    this.diagnostico = null;
    this.observacion = null;
    // los list de los buscadores
    this.listaBuscarEmpleados = [];
    this.ELEMENT_DATA = [];
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
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
/*  modificar() {
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
  onClick(event) {
    console.log(event.target.files);
    /*this.service.subirArchivo(event.target.files[0], 35).subscribe(
      response => {
        console.log('++++', response);
      }, error => {
        console.log('----', error);
      }
    );*/
    this.multiple = true;
    if (this.fileUpload) {
      this.fileUpload.nativeElement.click();
    }
  }
  /*-------------------------------------------------------------------------*/
  onFileSelected(event) {
    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    console.log('event::::::', event);
    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      //if(!this.isFileSelected(file)){
  //    if (this.validate(file)) {
        //      if(this.isImage(file)) {
        file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
        //      }
      /*  if (!this.isMultiple()) {
          this.files = [];
          console.log('multiple ', this.multiple);
        }*/
        this.files.push(files[i]);
        //  }
    //  }
      //}
    }
    console.log('ruthi: ', this.files);
  }
  /*-------------------------------------------------------------------------*/
  isMultiple(): boolean {
    return this.multiple
  }
  /*-------------------------------------------------------------------------*/

  ngOnInit() {
    this.listarCategorias();
    // al iniciar busca las reservas del dia actual
    this.fechaDesde = new Date();
    this.listaClienteSeleccionado = new Array<any> ();
    this.dataSource.paginator = this.paginator;
    this.mostrarAceptar = false;
  }

}
