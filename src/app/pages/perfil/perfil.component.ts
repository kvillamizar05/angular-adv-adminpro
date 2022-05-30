import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public profileForm!: FormGroup;
  public usuario: Usuario;
  public imagen!: File;
  public imgTemp: any = null

  constructor( private fb: FormBuilder, private usuarioService: UsuarioService, private fileUploadService: FileUploadService ) { 
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nombre: [this.usuario?.nombre, Validators.required],
      email: [this.usuario?.email, [Validators.required, Validators.email]]
    });

  }

  actualizarPerfil() {
    console.log(this.profileForm?.value);
    this.usuarioService.actualizarPerfil(this.profileForm.value)
      .subscribe(resp => {
        const { nombre, email } = this.profileForm.value
        this.usuario.nombre = nombre
        this.usuario.email = email

        Swal.fire('Guardado', 'Cambios guardados correctamente', 'success')
      }, err => {
        Swal.fire('Error', err.error.msg, 'error')
      })
  }

  cambiarImagen(event: any) {
    this.imagen = event.target.files[0];

    if (!event.target.files[0]) {
      return this.imgTemp = null
    }

    const reader = new FileReader()
    reader.readAsDataURL(event.target.files[0])

    reader.onloadend = () =>{
      this.imgTemp = reader.result
    }

    return

  }

  subirImagen() {
    const id = this.usuario.uid || ''
    this.fileUploadService.actualizarImg(this.imagen, 'usuarios', id).then(img => {
      this.usuario.img = img
      Swal.fire('Guardado', 'Cambios guardados correctamente', 'success')
    }).catch(err => {
      Swal.fire('Error', 'No se pudo cargar la imagen', 'error')
    })
  }

}
