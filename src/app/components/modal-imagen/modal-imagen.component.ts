import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagen!: File;
  public imgTemp: any = null

  constructor( public modalImagenService: ModalImagenService,
                public fileUploadService: FileUploadService ) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal()
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarImg(this.imagen, tipo, id).then(img => {
      Swal.fire('Guardado', 'Cambios guardados correctamente', 'success')
      this.modalImagenService.nuevaImagen.emit(img)
      this.cerrarModal()
    }).catch(err => {
      Swal.fire('Error', 'No se pudo cargar la imagen', 'error')
    })
  }


}
