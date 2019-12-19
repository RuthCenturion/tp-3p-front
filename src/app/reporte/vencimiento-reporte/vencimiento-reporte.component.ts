import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ReporteService } from 'src/app/services/reporte.service';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { TableData } from 'src/app/md/md-table/md-table.component';
import * as XLSX from 'xlsx';
import { NOTIFY } from '../../commons/app-utils';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-vencimiento-reporte',
  templateUrl: './vencimiento-reporte.component.html',
  styleUrls: ['./vencimiento-reporte.component.css']
})
export class VencimientoReporteComponent implements OnInit {

  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;

  public tableData1: TableData;

  listaAtributos: Array<any>;
  listaVencimiento: Array<any>;
  lista: Array<any>;

  diasVencimiento: any;
  mostrarFiltro: any;

  /*name of the excel-file which will be downloaded. */
  fileName = 'vencimiento-reporte.xlsx';

  constructor(private reporteService: ReporteService,
    public dialog: MatDialog,
    private toast: ToastrService) { }

  iniciarTabla() {
    this.tableData1 = {
      headerRow: ['Id', 'Nombre', 'Apellido', 'Nro. Documento', 'Fecha Caducidad'],
      dataRows: this.listaVencimiento
    };
  }

  getVencimientos() {
    if (this.diasVencimiento == undefined) {
      this.limpiar();
    } else {
      let body = {
        'dias': this.diasVencimiento
      };
      this.reporteService.getVencimientoReporte(body).subscribe(
        response => {
          console.log('getVencimientos(): ', response);
          this.listaVencimiento = new Array<any>();
          this.lista = new Array<any>();
          response.data.clientes.forEach(cliente => {
            this.lista.push(cliente);
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(cliente.clienteId);
            this.listaAtributos.push(cliente.nombre);
            this.listaAtributos.push(cliente.apellido);
            this.listaAtributos.push(cliente.nroDocumento);
            this.listaAtributos.push(cliente.fechaCaducidad);
            this.listaVencimiento.push(this.listaAtributos);
            this.tableData1 = {
              headerRow: ['Id', 'Nombre', 'Apellido', 'Nro. Documento', 'Fecha Caducidad'],
              dataRows: this.listaVencimiento
            };
          });
        },
        error => {
          //this.showNotification('Error al obtener vencimientos', NOTIFY.DANGER);
        }
      );
    }
  }

  limpiar() {
    this.diasVencimiento = null;
    this.listaVencimiento = [];
    this.tableData1 = {
      headerRow: ['Id', 'Nombre', 'Apellido', 'Nro. Documento', 'Fecha Caducidad'],
      dataRows: this.listaVencimiento
    };
  }

  /*-------------------------------------------------------------------------*/
  toggleFiltro() {
    if (this.mostrarFiltro) {
      this.mostrarFiltro = false;
    } else {
      this.mostrarFiltro = true;
    }
  }

  exportarExcel() {
    /* table id is passed over here */
    let element = document.getElementById('export-excel');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  exportarPdf() {
    const doc = new jsPDF('l', 'mm', 'a4');

    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    const pdfTable = this.pdfTable.nativeElement;

    doc.fromHTML(pdfTable.innerHTML, 15, 15, {
      width: 190,
      'elementHandlers': specialElementHandlers
    });

    doc.save('vencimiento-reporte.pdf');
  }

  ngOnInit() {
    this.mostrarFiltro = false;
    this.iniciarTabla();
  }
}
