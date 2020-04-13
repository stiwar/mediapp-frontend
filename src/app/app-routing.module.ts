import { BuscarComponent } from './pages/buscar/buscar.component';
import { EspecialComponent } from './pages/consulta/especial/especial.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { ExamenEdicionComponent } from './pages/examen/examen-edicion/examen-edicion.component';
import { ExamenComponent } from './pages/examen/examen.component';
import { EspecialidadEdicionComponent } from './pages/especialidad/especialidad-edicion/especialidad-edicion.component';
import { EspecialidadComponent } from './pages/especialidad/especialidad.component';
import { PacienteEdicionComponent } from './pages/paciente/paciente-edicion/paciente-edicion.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicoComponent } from './pages/medico/medico.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { LoginComponent } from './login/login.component';
import { GuardService } from './_service/guard.service';
import { Not401Component } from './pages/not401/not401.component';
import { RecuperarComponent } from './login/recuperar/recuperar.component';
import { TokenComponent } from './login/recuperar/token/token.component';
import { SignosComponent } from './pages/signos/signos.component';
import { SignosEdicionComponent } from './pages/signos/signos-edicion/signos-edicion.component';

const routes: Routes = [
  {
    path: 'paciente', component: PacienteComponent, children: [
      { path: 'nuevo', component: PacienteEdicionComponent },
      { path: 'edicion/:id', component: PacienteEdicionComponent }
    ], 
    canActivate: [GuardService]//es para proteger las rutas desde el front
  },
  {
    path: 'especialidad', component: EspecialidadComponent, children: [
      { path: 'nuevo', component: EspecialidadEdicionComponent },
      { path: 'edicion/:id', component: EspecialidadEdicionComponent }
    ], 
    canActivate: [GuardService]
  },
  {
    path: 'examen', component: ExamenComponent, children: [
      { path: 'nuevo', component: ExamenEdicionComponent },
      { path: 'edicion/:id', component: ExamenEdicionComponent }
    ], 
    canActivate: [GuardService]
  },
  { path: 'medico', component: MedicoComponent, canActivate: [GuardService] },
  { path: 'consulta', component: ConsultaComponent, canActivate: [GuardService] },
  { path: 'consulta-especial', component: EspecialComponent, canActivate: [GuardService] },
  { path: 'buscar', component: BuscarComponent, canActivate: [GuardService] },
  { path: 'reporte', component: ReporteComponent, canActivate: [GuardService] },
  { 
    path: 'signo', component: SignosComponent, children: [
      {path: 'nuevo', component: SignosEdicionComponent},
      {path: 'edicion/:id', component: SignosEdicionComponent}
    ], 
    canActivate: [GuardService]
  },
  //login
  { path: 'not-401', component: Not401Component},
  { path: 'login', component: LoginComponent},//el login no se debe proteger
  { path: '', redirectTo: 'login',  pathMatch: 'full'}, //pathMatch: 'full' significa que le va a agregar localhost:4200, es decir, el dominio, sino buscaria 'login' sin el dominio previo y lanzaría un error
  { path: 'recuperar', component: RecuperarComponent, children: [
    {path: ':token', component: TokenComponent}
  ] 
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
