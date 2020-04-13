import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SignosService } from 'src/app/_service/signos.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Signos } from 'src/app/_model/signos';
import { SignosComponent } from '../signos.component';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  formularioSignos : FormGroup;
  miControlPaciente: FormControl = new FormControl();
  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente;
  edicion: boolean;
  idSigno: number;

  pacientesFiltrados: Observable<Paciente[]>

  constructor(private route: ActivatedRoute, private router: Router, private signosService: SignosService, private pacienteService: PacienteService) { }

  ngOnInit() {
    this.cargarArrayDePacientes();
    this.inicializarFormulario();
    this.cargarFormulario();
    this.establecerAutoCompleteEnPacientes();
  }

  cargarFormulario(){

    this.route.params.subscribe( (parametrosUrl : Params) => {
      
      this.idSigno = parametrosUrl['id'];
      this.edicion = this.idSigno != null;

      if( this.edicion ) {
        this.inicializarFormularioConDatosDeSignos();
      }

      
    } );
  }

  inicializarFormulario() {

    this.formularioSignos = new FormGroup({
      id_signo : new FormControl(0),
      paciente :  this.miControlPaciente,
      fecha : new FormControl(new Date()),
      temperatura : new FormControl(''),
      pulso : new FormControl(''),
      ritmo_respiratorio : new FormControl('')

    });
  }

  inicializarFormularioConDatosDeSignos(){
      
    this.signosService.listarSignoPorId(this.idSigno).subscribe( dataSigno => {
      
      this.miControlPaciente.setValue(dataSigno.paciente);
      //this.formularioSignos.controls['paciente'].disable();

      this.formularioSignos = new FormGroup({
        id_signo : new FormControl(dataSigno.idSigno),
        paciente : this.miControlPaciente, // new FormControl({value: dataSigno.paciente, disabled: true}),
        fecha : new FormControl(new Date(dataSigno.fecha)),
        temperatura : new FormControl(dataSigno.temperatura),
        pulso : new FormControl(dataSigno.pulso),
        ritmo_respiratorio : new FormControl(dataSigno.ritmoRespiratorio)
  
      });

      
      //this.miControlPaciente.disable();

/*
      this.formularioSignos.patchValue({
        id_signo: dataSigno.idSigno,
        paciente: {
          value: dataSigno.paciente,
          disabled: true
        },
        fecha: new Date(dataSigno.fecha),
        temperatura : dataSigno.temperatura,
        pulso : dataSigno.pulso,
        ritmo_respiratorio : dataSigno.ritmoRespiratorio
      });
*/
    });
    

  }

  cargarArrayDePacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  filtrarPaciente(val: any) {

    if (val != null && val.idPaciente > 0) {//para que sólo entre si val es un objeto

      return this.pacientes.filter( pacienteActual =>
        pacienteActual.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || pacienteActual.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || pacienteActual.dni.includes(val.dni));
  
    } else {

      return this.pacientes.filter( pacienteActual =>
        pacienteActual.nombres.toLowerCase().includes(val.toLowerCase()) || pacienteActual.apellidos.toLowerCase().includes(val.toLowerCase()) || pacienteActual.dni.includes(val));
  
    }
    
  }

  //captura el objeto Paciente seleccionado actualmente 
  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }

  establecerAutoCompleteEnPacientes() {
    this.pacientesFiltrados = this.miControlPaciente.valueChanges.pipe(map(val => this.filtrarPaciente(val))); //consultar comportamiento de valueChanges y pipe en AutoComplete
  }

  mostrarPacienteFiltradoySeleccionado(pacienteFiltradoySeleccionado : Paciente){

    return pacienteFiltradoySeleccionado ? `${pacienteFiltradoySeleccionado.nombres} ${pacienteFiltradoySeleccionado.apellidos}` : pacienteFiltradoySeleccionado;

  }

  operarSigno() {
    
    let signos = new Signos();
    signos.idSigno = this.formularioSignos.value['id_signo'];
    signos.paciente = this.formularioSignos.value['paciente'];
    signos.fecha = this.procesarFecha();
    signos.temperatura = this.formularioSignos.value['temperatura'];
    signos.pulso = this.formularioSignos.value['pulso'];
    signos.ritmoRespiratorio = this.formularioSignos.value['ritmo_respiratorio'];

    if(this.edicion){

      this.signosService.actualizar(signos).subscribe(()=>{
        this.signosService.listarPageable(SignosComponent.INITIAL_PAGE, SignosComponent.INITIAL_SIZE).subscribe(data => {
          this.signosService.signoCambio.next(data.content);
          this.signosService.mensajeSignoCambio.next('SE MODIFICO');
        });
      });

    }else{
      this.signosService.registrar(signos).subscribe( () => {
        this.signosService.listarPageable(SignosComponent.INITIAL_PAGE, SignosComponent.INITIAL_SIZE).subscribe( data => {
          this.signosService.signoCambio.next(data.content);
          this.signosService.mensajeSignoCambio.next('SE REGISTRO');
        });
      });
    }

   this.router.navigate(['signo']);
  }

  procesarFecha(){

    let tzoffset = (this.formularioSignos.value['fecha']).getTimezoneOffset() * 60000;
    let localISOTime = ( new Date(Date.now() - tzoffset) ).toISOString();

    return localISOTime;
  }

}
