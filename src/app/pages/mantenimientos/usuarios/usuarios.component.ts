import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { delay, Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0
  public usuarios: Usuario[] = []
  public usuariosTemp: Usuario[] = []
  public desde: number = 0
  public loading: boolean = true
  public imgSubs!: Subscription;

  constructor( private usuarioService: UsuarioService, private busquedasService: BusquedasService, private modalImagenService: ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => this.cargarUsuarios())
  }

  cargarUsuarios() {
    this.loading = true
    this.usuarioService.cargarUsuarios(this.desde).subscribe(({ total, usuarios }) => { 
      this.totalUsuarios = total;
      if (usuarios.length !== 0) {
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.loading = false
      }
     })
  }

  cambiarPagina( valor: number ){
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0
    } else if( this.desde > this.totalUsuarios) {
      this.desde -= valor 
    }

    this.cargarUsuarios()
  }

  buscar( termino: string) {
    if (termino.length === 0) {
      this.usuarios = this.usuariosTemp
      return
    }
    this.busquedasService.buscar('usuarios', termino).subscribe(resp => {
      this.usuarios = resp as Usuario[]
    })
  }

  eliminarUsuario(usuario:Usuario){

    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire("Error", "No puede eliminarse a si mismo", 'error')
    }

    Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Esta apunto de eliminar al usuario ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminalo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario).subscribe(resp => {
          Swal.fire('Usuario eliminado',
          `${usuario.nombre} ha sido eliminado correctamente.`,
          'success'
          )
          this.cargarUsuarios()
        });
      }
    })
    return
  }

  cambiarRole(usuario:Usuario){
    this.usuarioService.guardarUsuario(usuario).subscribe(resp =>console.log('resp', resp))
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal("usuarios", usuario.uid, usuario.img)
  }
}
