import { Component, OnInit } from '@angular/core';
import { TableData } from '../../md/md-table/md-table.component';
import { HorarioService } from '../../services/horario.service';

declare const $: any;

@Component({
  selector: 'app-horario-atencion',
  templateUrl: './horario-atencion.component.html',
  styleUrls: ['./horario-atencion.component.css']
})
export class HorarioAtencionComponent implements OnInit {

  public tableData1: TableData;

  // time = {hour: 13, minute: 30};
  horaApertura: any;
  horaCierre: any;

  listaAtributos: Array<any>;
  listaHorarios: Array<any>;

  listaDias = [
    {value: '0', viewValue: 'Domingo'},
    {value: '1', viewValue: 'Lunes'},
    {value: '2', viewValue: 'Martes'},
    {value: '3', viewValue: 'Miércoles'},
    {value: '4', viewValue: 'Jueves'},
    {value: '5', viewValue: 'Viernes'},
    {value: '6', viewValue: 'Sábado'},
  ];

  constructor(
    private service: HorarioService,
    ) {
      this.tableData1 = {
        headerRow: ['Id', 'Id Esp.', 'Especialista', 'Día', 'Apertura', 'Cierre', 'Intervalo', 'Acciones'],
        dataRows: this.listaHorarios
      };
     }

  listarHorarioAtencion() {
    this.service.getHorarioAtencion().subscribe(
      response => {
        this.listaHorarios = new Array<any>();
        console.log('lista de horarios de atencion: ', response);
        if (response.totalDatos > 0) {
          response.lista.forEach(horario => {
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(horario.idPersonaHorarioAgenda); // 0
            // especialista
            this.listaAtributos.push(horario.idEmpleado.idPersona); // 1
            this.listaAtributos.push(horario.idEmpleado.nombreCompleto); // 2
            // dia
            this.listaAtributos.push(horario.diaCadena); // 3
            this.listaAtributos.push(horario.horaApertura); // 4
            this.listaAtributos.push(horario.horaCierre); // 5
            this.listaAtributos.push(horario.intervaloMinutos); // 6
            this.listaHorarios.push(this.listaAtributos);

            this.tableData1 = {
              headerRow: ['Id', 'Id Esp.', 'Especialista', 'Día', 'Apertura', 'Cierre', 'Intervalo', 'Acciones'],
              dataRows: this.listaHorarios
            };
            
          });
        }
      }
    );

  }

  ngOnInit() {
    this.listarHorarioAtencion();
  }

}
