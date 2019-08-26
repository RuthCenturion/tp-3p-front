import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { TableData } from '../../md/md-table/md-table.component';
import { CategoriaService } from '../../services/categoria.service';
import { NOTIFY } from '../../commons/app-utils';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

declare const $: any;

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  public tableData1: TableData;
  public dataTable: DataTable;
  idCategoria: any;
  descripcion: any;

  listaAtributos: Array<any>;
  listaCategoria: Array<any>;
  lista: Array<any>;


  constructor(
    private categoriaService: CategoriaService,
    public dialog: MatDialog,
    private toast: ToastrService ) {
    this.dataTable = {
      headerRow: ['Id', 'Descripción', 'Acciones'],
      footerRow: ['Id', 'Descripción', 'Acciones'],
      dataRows: this.listaCategoria
    };
    this.tableData1 = {
      headerRow: ['Id', 'Descripción', 'Acciones'],
      dataRows: this.listaCategoria
    };
  }

  /*-------------------------------------------------------------------------*/
  ngOnInit() {
    this.listarCategorias();
    
  }
  /*-------------------------------------------------------------------------*/
  ngAfterViewInit() {
    $('#datatables').DataTable({
      'pagingType': 'full_numbers',
      'lengthMenu': [
        [10, 25, 50, -1],
        [10, 25, 50, 'All']
      ],
      responsive: true,
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      }

    });
    const table = $('#datatables').DataTable();
    // Edit record
    table.on('click', '.edit', function (e) {
      let $tr = $(this).closest('tr');
      if ($($tr).hasClass('child')) {
        $tr = $tr.prev('.parent');
      }
      let data = table.row($tr).data();
      console.log('data ', data);
      alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
      e.preventDefault();
    });
    // Delete a record
    table.on('click', '.remove', function (e) {
      const $tr = $(this).closest('tr');
      table.row($tr).remove().draw();
      e.preventDefault();
    });
    // Like record
    table.on('click', '.like', function (e) {
      alert('You clicked on Like button');
      e.preventDefault();
    });

    $('.card .material-datatables label').addClass('form-group');
  }

  /*-------------------------------------------------------------------------*/
  changeDescripcion() {
    console.log('descripcion seleccionada: ', this.idCategoria);
  }

  /*-------------------------------------------------------------------------*/
  buscar() {
    if (this.idCategoria) {
      this.obtenerCategoria(this.idCategoria);
    } else {
      this.listarCategorias();
    }
  }
  /*-------------------------------------------------------------------------*/
  obtenerCategoria(id) {
    this.categoriaService.obtenerCategoria(id).subscribe(
      cat => {
        this.listaCategoria = new Array<any>();

        this.listaAtributos = new Array<any>();
        this.listaAtributos.push(cat.idCategoria);
        this.listaAtributos.push(cat.descripcion);
        this.listaCategoria.push(this.listaAtributos);
        this.dataTable = {
          headerRow: ['Id', 'Descripción', 'Acciones'],
          footerRow: ['Id', 'Descripción', 'Acciones'],
          dataRows: this.listaCategoria
        };
        this.tableData1 = {
          headerRow: ['Id', 'Descripción', 'Acciones'],
          dataRows: this.listaCategoria
        };

      },
      error => {
        console.log('Error al probar lista categoria', 'ERROR!');
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  listarCategorias() {
    this.categoriaService.obtenerCategoria(this.idCategoria).subscribe(
      response => {
        this.listaCategoria = new Array<any>();
        this.lista = new Array<any>();
        response.lista.forEach(cat => {
          this.lista.push(cat);
          this.listaAtributos = new Array<any>();
          this.listaAtributos.push(cat.idCategoria);
          this.listaAtributos.push(cat.descripcion);
          this.listaCategoria.push(this.listaAtributos);
          this.dataTable = {
            headerRow: ['Id', 'Descripción', 'Acciones'],
            footerRow: ['Id', 'Descripción', 'Acciones'],
            dataRows: this.listaCategoria
          };
          this.tableData1 = {
            headerRow: ['Id', 'Descripción', 'Acciones'],
            dataRows: this.listaCategoria
          };
        });
      },
      error => {
        console.log('Error al listar todas las categorías', 'ERROR!');
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  limpiar() {
    this.idCategoria = null;
    this.tableData1.dataRows = [];
   // this.showNotification('prueba de toast', NOTIFY.DANGER);
  }
  /*-------------------------------------------------------------------------*/
 agregar() {
   let dato = {
     descripcion: this.descripcion
   };
   this.categoriaService.agregarCategoria(dato).subscribe(
     response => {
       this.showNotification('Categoría creada con éxito!', NOTIFY.SUCCESS);
       this.listarCategorias();
     }
   );
 }
  /*-------------------------------------------------------------------------*/
  showNotification( mensaje: any, color: any) {
    /*color:  6 type[color]:  primary lila
      color:  5 type[color]:  rose    fucsia
      color:  4 type[color]:  danger rojo
      color:  3 type[color]:  warning anaranjado
      color:  2 type[color]:  success verde
      color:  1 type[color]:  info celeste*/
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



}
