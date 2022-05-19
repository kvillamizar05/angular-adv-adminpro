import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [
    './register.component.css'
  ]
})
export class RegisterComponent  {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['', [ Validators.required, Validators.minLength(3) ]],
    email: ['',[Validators.required, Validators.email]],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    terminos: [false, Validators.required]
  }, {
    Validators: this.passwordsIguales('password', 'password2')
  })

  constructor( private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) { }

  crearUsuario() {
    this.formSubmitted = true
    console.log( this.registerForm.value )

    if( this. registerForm.invalid ){
      return
    } 

    this.usuarioService.crearusuario( this.registerForm.value ).subscribe( resp => {
      this.router.navigateByUrl('/')
    }, err => {
      Swal.fire('Error',err.error.msg, 'error')
    })
  }

  campoNoValido( campo: string ): boolean {
    return this.registerForm.get(campo)?.invalid && this.formSubmitted ? true : false
  }

  aceptaTerminos(): boolean {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted
  }

  validarPassword(): boolean {
    const pass1 = this.registerForm.get('password')?.value
    const pass2 = this.registerForm.get('password2')?.value

    return pass1 !== pass2 && this.formSubmitted ? true : false
  }

  passwordsIguales(pass1: string, pass2: string) {

    return (formGroup: FormGroup) => {

      const pass1Control = formGroup.get(pass1)
      const pass2Control = formGroup.get(pass2)

      if(pass1Control !== pass2Control){
        pass2Control?.setErrors(null)
      } else {
        pass2Control?.setErrors({ noEsIgual: true})
      }

    }
  }

}
