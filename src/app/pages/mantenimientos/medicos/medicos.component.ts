import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando: boolean = true;
  private imgSubs!: Subscription;

  constructor( private medicoService: MedicoService, private modalImagenService: ModalImagenService, private busquedasService: BusquedasService ) { }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {
    this.cargarMedicos()

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => this.cargarMedicos())
  }

  cargarMedicos() {
    this.cargando = true
    this.medicoService.cargarMedicos().subscribe(medicos => {
      this.cargando = false
      this.medicos = medicos
    })
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal("medicos", medico._id, medico.img)
  }

  buscar( termino: string) {
    if (termino.length === 0) {
      this.cargarMedicos()
    }
    this.busquedasService.buscar('medicos', termino).subscribe(resp => {
      this.medicos = resp as Medico[]
    })
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Eliminar médico?',
      text: `Esta apunto de eliminar al médico ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminalo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico._id).subscribe(resp => {
          Swal.fire('Médico eliminado',
          `${medico.nombre} ha sido eliminado correctamente.`,
          'success'
          )
          this.cargarMedicos()
        });
      }
    })
    return
  }

}
