import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PacienteEdicionComponent } from './pages/paciente/paciente-edicion/paciente-edicion.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MedicoComponent } from './pages/medico/medico.component';
import { EspecialidadComponent } from './pages/especialidad/especialidad.component';
import { ExamenComponent } from './pages/examen/examen.component';
import { MedicoDialogoComponent } from './pages/medico/medico-dialogo/medico-dialogo.component';
import { EspecialidadEdicionComponent } from './pages/especialidad/especialidad-edicion/especialidad-edicion.component';
import { ExamenEdicionComponent } from './pages/examen/examen-edicion/examen-edicion.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { EspecialComponent } from './pages/consulta/especial/especial.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { DialogoDetalleComponent } from './pages/buscar/dialogo-detalle/dialogo-detalle.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {JwtModule} from '@auth0/angular-jwt';
import { LoginComponent } from './login/login.component';
import { environment } from 'src/environments/environment';
import { Not401Component } from './pages/not401/not401.component';
import { ServerErrorsInterceptor } from './_shared/server-errors.interceptor';
import { RecuperarComponent } from './login/recuperar/recuperar.component';
import { TokenComponent } from './login/recuperar/token/token.component';

//el siguiente método proporciona un mecanismo para obtener el token
export function tokenGetter(){
  let tk = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME));
  let token = tk != null ? tk.access_token : '';

  return token;
}

@NgModule({
  declarations: [
    AppComponent,
    PacienteComponent,
    PacienteEdicionComponent,
    MedicoComponent,
    EspecialidadComponent,
    ExamenComponent,
    MedicoDialogoComponent,
    EspecialidadEdicionComponent,
    ExamenEdicionComponent,
    ConsultaComponent,
    EspecialComponent,
    BuscarComponent,
    DialogoDetalleComponent,
    ReporteComponent,
    LoginComponent,
    Not401Component,
    RecuperarComponent,
    TokenComponent
  ],
  entryComponents: [MedicoDialogoComponent, DialogoDetalleComponent], //Necesario para abrir los modales y que el menú lateral no se dañe y pueda desplegarse correctamente.
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,//especifica cómo se van a obtener los tokens
        whitelistedDomains: ['localhost:8080'], //esta librería le pasa el token automáticamente en el header a todo lo que pertenezca a este dominio
        blacklistedRoutes: ['http://localhost:8080/login/enviarCorreo'] //aquí van los servicios que no necesitan tokens, SIEMPRE VA http:// según el instructor (consultar si es cierto)
      }
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ServerErrorsInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
