import { ConsultaListaExamenDTO } from './../_model/consultaListaExamenDTO';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { FiltroConsulta } from '../_model/filtroConsulta';
import { Consulta } from '../_model/consulta';

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

}
