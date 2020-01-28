import { HttpClient } from '@angular/common/http';
import { Examen } from './../_model/examen';
import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { ConsultaListaExamenDTO } from '../_model/consultaListaExamenDTO';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  examenesCambio = new Subject<Examen[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST_URL}/examenes`;

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Examen[]>(this.url);
  }

  listarExamenPorId(id: number) {
    return this.http.get<Examen>(`${this.url}/${id}`);
  }

  registrar(examen: Examen) {
    return this.http.post(this.url, examen);
  }

  modificar(examen: Examen) {
    return this.http.put(this.url, examen);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  listarExamenPorConsulta(idConsulta : number){

    return this.http.get<ConsultaListaExamenDTO[]>(`${environment.HOST_URL}/consultaexamenes/${idConsulta}`);

  }
}
