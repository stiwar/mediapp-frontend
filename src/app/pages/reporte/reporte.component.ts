import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  chart: any;  //es para la referencia al canvas y es de tipo any xq en typeScript no tengo una variable de tipo Canvas.
  tipo: string;
  pdfSrc: string = '';
  labelFile: string;
  selectedFiles: FileList; //imágenes seleccionadas para subir
  currentFileUpload: File;
  imagenData: any;
  imagenEstado: boolean = false;

  constructor(private consultaService: ConsultaService, private sanitization : DomSanitizer) { }

  ngOnInit() {
    this.tipo = 'line';
    this.dibujar();

    this.consultaService.leerArchivo().subscribe(data => {
      this.convertir(data);
    });
  }

  convertir(data: any){
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      let x = reader.result;
      //console.log(x); //imagen en base64 (inseguro)
      this.setear(x);
    };
  }

  setear(x: any){//para englobar la data como segura (sanitizar)
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(x);
  }

  dibujar() {
    this.consultaService.listarResumen().subscribe(data => {

      console.log(data);

      let cantidad = data.map(res => res.cantidad);
      let fechas = data.map(res => res.fecha);

      console.log(cantidad);
      console.log(fechas);

      this.chart = new Chart('canvas', {
        type: this.tipo,
        data: {
          labels: fechas,
          datasets: [
            {
              label: 'Cantidad',
              data: cantidad,
              borderColor: "#3cba9f",
              fill: false,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 0, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ]
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }],
          }
        }
      });
    });
  }

  cambiar(tipo: string) {
    this.tipo = tipo;
    if (this.chart) {//ya existe una instancia del gráfico, destruir antes de volver a dibujar, con esto se elimina el bug para Angular
      this.chart.destroy();
    }
    this.dibujar();
  }

  generarReporte() {
    this.consultaService.generarReporte().subscribe(data => {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        //console.log(e.target.result);
        this.pdfSrc = e.target.result;
      }
      reader.readAsArrayBuffer(data);
    });
  }

  descargarReporte() {
    this.consultaService.generarReporte().subscribe(data => {
      const url = window.URL.createObjectURL(data); //se crea una url a partir de la data que me llega del servidor y a través del método createObjectURL de la clase URL de JS
      //console.log(url);
      const a = document.createElement('a'); //crea una etiqueta <a href.../>
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'archivo.pdf'; //como desde el back me llega un arreglo del bytes, yo podría cambiar la extensión a ppt, xls, etc
      a.click(); //simular el click del usuario
    });
  }

  selectFile(e: any) {
    //console.log(e.target.files);
    this.labelFile = e.target.files[0].name;
    this.selectedFiles = e.target.files;
  }

  upload() {
    this.currentFileUpload = this.selectedFiles.item(0);

    this.consultaService.guardarArchivo(this.currentFileUpload).subscribe(data => {
      console.log(data);
      this.selectedFiles = undefined; //limpiar lista
    })
  }

  accionImagen(accion: string){
    if(accion === "M"){
      this.imagenEstado = true;
    }else{
      this.imagenEstado = false;
    }    
  }
}
