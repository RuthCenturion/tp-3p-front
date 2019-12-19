import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { ReporteService } from 'src/app/services/reporte.service';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { NOTIFY } from '../../commons/app-utils';
import * as jsPDF from 'jspdf';
import { HorarioService } from 'src/app/services/horario.service';

@Component({
  selector: 'app-bolsa-punto-reporte',
  templateUrl: './bolsa-punto-reporte.component.html',
  styleUrls: ['./bolsa-punto-reporte.component.css']
})
export class BolsaPuntoReporteComponent implements OnInit {

  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;

  public tableData1: TableData;

  listaAtributos: Array<any>;
  listaBolsaPunto: Array<any>;
  lista: Array<any>;

  clienteId: any;
  mostrarFiltro: any;

  /*name of the excel-file which will be downloaded. */
  fileName = 'bolsa-punto-reporte.xlsx';

  constructor(private reporteService: ReporteService,
    public dialog: MatDialog,
    private toast: ToastrService,
    private service: HorarioService) { }

  iniciarTabla() {
    this.tableData1 = {
      headerRow: ['Nombre', 'Apellido', 'Fecha Asignacion', 'Fecha Caducidad', 'Puntaje Asignado',
        'Puntaje Utilizado', 'Saldo', 'Monto'],
      dataRows: this.listaBolsaPunto
    };
  }

  getBolsaPuntos(clienteId) {

    let body = {};
    this.reporteService.getBolsaPuntoReporte(body).subscribe(
      response => {
        this.listaBolsaPunto = new Array<any>();
        this.lista = new Array<any>();
        response.data.bolsaPuntos.forEach(bolsaPuntos => {
          this.lista.push(bolsaPuntos);
          this.listaAtributos = new Array<any>();
          this.listaAtributos.push(bolsaPuntos.cliente.nombre);
          this.listaAtributos.push(bolsaPuntos.cliente.apellido);
          this.listaAtributos.push(bolsaPuntos.fechaAsignacion);
          this.listaAtributos.push(bolsaPuntos.fechaCaducidad);
          this.listaAtributos.push(bolsaPuntos.puntajeAsignado);
          this.listaAtributos.push(bolsaPuntos.puntajeUtilizado);
          this.listaAtributos.push(bolsaPuntos.saldo);
          this.listaAtributos.push(bolsaPuntos.monto);
          this.listaBolsaPunto.push(this.listaAtributos);
          this.tableData1 = {
            headerRow: ['Nombre', 'Apellido', 'Fecha Asignacion', 'Fecha Caducidad', 'Puntaje Asignado',
              'Puntaje Utilizado', 'Saldo', 'Monto'],
            dataRows: this.listaBolsaPunto
          };
        });
      },
      error => {
        //this.showNotification('Error al obtener vencimientos', NOTIFY.DANGER);
      }
    );
  }

  limpiar() {
    //this.diasVencimiento = null;
    this.listaBolsaPunto = [];
    this.tableData1 = {
      headerRow: ['Nombre', 'Apellido', 'Fecha Asignacion', 'Fecha Caducidad', 'Puntaje Asignado',
        'Puntaje Utilizado', 'Saldo', 'Monto'],
      dataRows: this.listaBolsaPunto
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

    doc.save('bolsa-punto-reporte.pdf');
  }

  listarClientePaginado(evento, buscarClienteNombre) {

    let filtros = '';
    if (buscarClienteNombre !== undefined && buscarClienteNombre !== null) {
      filtros = '?parametro=' + buscarClienteNombre;
    }
    this.service.getClienteBuscador(filtros).subscribe(
      response => {
        console.log('listarCliente en buscador(): ', response);
        this.listaHorarios = new Array<any>();
        console.log('lista de horarios de atencion: ', response);
        if (response.data.clientes.length > 0) {
          response.data.clientes.forEach(cliente => {
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(cliente.id); // 0
            // especialista
            this.listaAtributos.push(cliente.nombre + ' ' + cliente.apellido); // 1
            this.listaAtributos.push(cliente.nroDocumento); // 2
            this.listaAtributos.push(cliente.email); // 3
            // dia
            /*   
               this.listaAtributos.push(horario.horaApertura); // 4
               this.listaAtributos.push(horario.horaCierre); // 5
               this.listaAtributos.push(horario.intervaloMinutos); // 6*/
            this.listaHorarios.push(this.listaAtributos);

            this.tableBuscarCliente = {
              headerRow: ['Id', 'Nombre', 'Nro. Documento', 'Email'],
              dataRows: this.listaHorarios
            };
          });
        }

      });
  }

  ngOnInit() {
    this.mostrarFiltro = false;
    this.iniciarTabla();
    this.getBolsaPuntos(null);
  }

}
