import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SignoPacienteDTO } from '../_model/signoPacienteDTO';
import { Signos } from '../_model/signos';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignosService {

  signoCambio = new Subject<SignoPacienteDTO[]>();
  mensajeSignoCambio = new Subject<string>();

  private url: string = `${environment.HOST_URL}/signos`;

  constructor(private http: HttpClient) { }

  listarPageable(page: number, size: number){
    console.log('page: '+page);
    console.log('size: '+size);
    return this.http.get<any>(`${this.url}/pageable?page=${page}&size=${size}`); //el 'any' es necesario para que en signos.component.ts no aparezca el error en dataSignos.content (solución, crear un Dto para representar el pageable que me retorna el back)
  }

  listarSignoPorId(idSigno : number ){
    return this.http.get<Signos>(`${this.url}/${idSigno}`);
  }

  registrar(signo: Signos) {
    return this.http.post(`${this.url}`, signo);
  }

  actualizar(signo: Signos) {
    return this.http.put(`${this.url}`, signo);
  }

  eliminar(idSigno: number) {
    return this.http.delete(`${this.url}/${idSigno}`);
  }

}
