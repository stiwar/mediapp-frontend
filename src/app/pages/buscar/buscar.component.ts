import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { FiltroConsulta } from 'src/app/_model/filtroConsulta';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Consulta } from 'src/app/_model/consulta';
import { DialogoDetalleComponent } from './dialogo-detalle/dialogo-detalle.component';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  maxFecha = new Date();
  form: FormGroup;
  displayedColumns = ['paciente', 'medico', 'especialidad', 'fecha', 'acciones'];
  dataSource : MatTableDataSource<Consulta>;
  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort) sort : MatSort;

  constructor(private consultaService : ConsultaService, private dialog : MatDialog) { }

  ngOnInit() {
    this.form = new FormGroup({
      'dni': new FormControl(''),
      'nombreCompleto': new FormControl(''),
      'fechaConsulta': new FormControl()
    });
  }

  buscar(){

    let filtro = new FiltroConsulta(this.form.value['dni'], 
                                    this.form.value['nombreCompleto'], 
                                    this.form.value['fechaConsulta']);

    filtro.nombreCompleto = filtro.nombreCompleto.toLowerCase();//para enviar siempre en minúsculas al backend.

    if(filtro.fechaConsulta){

      filtro.fechaConsulta.setHours(0);
      filtro.fechaConsulta.setMinutes(0);
      filtro.fechaConsulta.setSeconds(0);
      filtro.fechaConsulta.setMilliseconds(0);

      delete filtro.dni;  //delete es una palabra reservada de JavaScript
      delete filtro.nombreCompleto;  //delete es una palabra reservada de JavaScript

      this.consultaService.buscar(filtro).subscribe(data => {
        //datasource
        this.dataSource = new MatTableDataSource(data);

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });

    }else{
      
      delete filtro.fechaConsulta;

      if(filtro.dni.length === 0){
        delete filtro.dni;
      }

      if(filtro.nombreCompleto.length === 0){
        delete filtro.nombreCompleto;
      }

      this.consultaService.buscar(filtro).subscribe(data => {
        //datasource
        this.dataSource = new MatTableDataSource(data);

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });

    }

    
  }

  verDetalle(consulta : Consulta){
    this.dialog.open(DialogoDetalleComponent,{
      data:consulta
    });
  }

}