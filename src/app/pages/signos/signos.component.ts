import { Component, OnInit, ViewChild } from '@angular/core';
import { SignosService } from 'src/app/_service/signos.service';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { SignoPacienteDTO } from 'src/app/_model/signoPacienteDTO';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  static readonly INITIAL_PAGE: number = 0;
  static readonly INITIAL_SIZE: number = 10;

  dataSource : MatTableDataSource<SignoPacienteDTO>;
  displayedColumns : string[] = ['idSigno', 'paciente', 'fecha', 'temperatura', 'pulso', 'ritmoRespiratorio', 'acciones'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidadRegistros: number = 0;

  constructor(private signosService: SignosService, private snackBar: MatSnackBar, public route: ActivatedRoute) { }

  ngOnInit() {
    this.configurarVariablesReactivas();
    this.cargarConfiguracionYDatosInicialesEnTabla();
  }

  
  configurarVariablesReactivas() {
    
    this.signosService.signoCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.signosService.mensajeSignoCambio.subscribe(data => {
      this.snackBar.open(data, 'INFO', {
        duration: 2000
      });
    });

  }

  applyFilter(filterValue: string) {    
    this.establecerBusquedaPorTodosLosCamposEnDataSource(); //necesario para que filtre por todos los campos y no solo por el nombre del paciente.
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  cargarConfiguracionYDatosInicialesEnTabla() {

    this.signosService.listarPageable(SignosComponent.INITIAL_PAGE, SignosComponent.INITIAL_SIZE ).subscribe( dataSignos => {

      this.establecerCantidadDeRegistros(dataSignos.totalElements);

      this.dataSource = new MatTableDataSource(dataSignos.content);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }

  establecerCantidadDeRegistros(cantidadRegistros : number){
    this.cantidadRegistros = cantidadRegistros;
  }

  establecerBusquedaPorTodosLosCamposEnDataSource() {
    //Se omite búsqueda por Id de Signo
    this.dataSource.filterPredicate = (data, filter: string) => {
      
      return ( data.nombrePacienteCompleto.toLowerCase().includes(filter) || 
             data.signo.fecha.toLowerCase().includes(filter) || 
             data.signo.temperatura.toString().includes(filter) || 
             data.signo.pulso.toString().includes(filter) || 
             data.signo.ritmoRespiratorio.toString().includes(filter) );
     };

  }

  cambiarPagina(e: any) {
    this.signosService.listarPageable(e.pageIndex, e.pageSize).subscribe(dataSignos => {
      this.establecerCantidadDeRegistros(dataSignos.totalElements);
      this.dataSource = new MatTableDataSource(dataSignos.content);
      //this.dataSource.paginator = this.paginator; //ya no es necesario porque ya estoy trayendo la data de bloque en bloque
      this.dataSource.sort = this.sort;
    });
  }

  eliminarSigno(idSigno: number) {
    this.signosService.eliminar(idSigno).subscribe(() => {
      this.signosService.listarPageable(SignosComponent.INITIAL_PAGE, SignosComponent.INITIAL_SIZE).subscribe(data => {
        this.signosService.signoCambio.next(data.content);
        this.signosService.mensajeSignoCambio.next('SE ELIMINO');
      });
    });
  }

}
