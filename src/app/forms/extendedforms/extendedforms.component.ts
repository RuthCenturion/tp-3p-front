import { Component, OnInit, ElementRef } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { CategoriaService } from '../../services/categoria.service';


declare const require: any;

declare const $: any;

@Component({
    selector: 'app-extendedforms-cmp',
    templateUrl: 'extendedforms.component.html',
    styles: [`md-calendar {
      width: 300px;
  }`]
})

export class ExtendedFormsComponent implements OnInit {
    simpleSlider = 40;
    doubleSlider = [20, 60];

    regularItems = ['Pizza', 'Pasta', 'Parmesan'];
    touch: boolean;

    selectedValue: string;
    currentCity: string[];

    selectTheme = 'primary';
    cities = [
      {value: 'paris-0', viewValue: 'Paris'},
      {value: 'miami-1', viewValue: 'Miami'},
      {value: 'bucharest-2', viewValue: 'Bucharest'},
      {value: 'new-york-3', viewValue: 'New York'},
      {value: 'london-4', viewValue: 'London'},
      {value: 'barcelona-5', viewValue: 'Barcelona'},
      {value: 'moscow-6', viewValue: 'Moscow'},
    ];
    constructor(
      private categoriaService: CategoriaService,
      ) {

      }
    ngOnInit() {
      this.categoriaService.getCategoria().subscribe(
        response => {
          console.log('prueba lista categoria: ', response);
        },
        error => {
          console.log('Error al probar lista categoria', 'ERROR!');
        }
      );
    }
        myFunc(val: any) {
          // code here
        }

}
