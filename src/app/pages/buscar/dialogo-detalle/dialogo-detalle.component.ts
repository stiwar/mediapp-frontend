import { Component, OnInit, Inject } from '@angular/core';
import { Consulta } from 'src/app/_model/consulta';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExamenService } from 'src/app/_service/examen.service';
import { ConsultaListaExamenDTO } from 'src/app/_model/consultaListaExamenDTO';

@Component({
  selector: 'app-dialogo-detalle',
  templateUrl: './dialogo-detalle.component.html',
  styleUrls: ['./dialogo-detalle.component.css']
})
export class DialogoDetalleComponent implements OnInit {

  consulta : Consulta;
  examenes : ConsultaListaExamenDTO[];

  constructor(public dialogRef : MatDialogRef<DialogoDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data : Consulta, private examenService : ExamenService) { }

  ngOnInit() {
    this.consulta = this.data;
    this.listarExamenes();
  }

  listarExamenes(){
    this.examenService.listarExamenPorConsulta(this.consulta.idConsulta).subscribe((data) => {
      this.examenes = data;
    });
  }

  cancelar(){
    this.dialogRef.close();
  }

}
