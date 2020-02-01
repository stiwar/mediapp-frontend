import { ConsultaListaExamenDTO } from './../_model/consultaListaExamenDTO';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { FiltroConsulta } from '../_model/filtroConsulta';
import { Consulta } from '../_model/consulta';
import { ConsultaResumenDTO } from '../_model/consultaResumenDTO';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  url: string = `${environment.HOST_URL}/consultas`;

  constructor(private http: HttpClient) { }

  registrar(consultaDTO: ConsultaListaExamenDTO) {
    return this.http.post(this.url, consultaDTO);
  }

  buscar(filtroConsulta : FiltroConsulta){
    return this.http.post<Consulta[]>(`${this.url}/buscar`,filtroConsulta);
  }

  listarResumen(){
    return this.http.get<ConsultaResumenDTO[]>(`${this.url}/listarResumen`);
  }

  generarReporte(){
    return this.http.get(`${this.url}/generarReporte`,{
      responseType: 'blob' //para arreglo de bytes se utiliza blob
    });
  }

  guardarArchivo(data: File){
    let formdata: FormData = new FormData();
    formdata.append('file',data); //'file' es un apodo para la variable data que llega como argumento al método.

    return this.http.post(`${this.url}/guardarArchivo`, formdata,{
      responseType: 'text' //es text porque así el back-end retorne un entero (ResponseEntity<Integer>), lo toma como texto, y sino le especifico el tipo de respuesta lo toma como un Json.
    });
  }

  leerArchivo(){
    return this.http.get(`${this.url}/leerArchivo/1`,{ //le pasa el 1 quemado xq no está en el alcance del ejercicio el manejo de imágenes, sepodría hacer de manera dinámica recibiendo el id de la imagen como parámetro
      responseType: 'blob'
    });
  }

}
