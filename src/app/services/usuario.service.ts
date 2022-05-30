import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap, map, catchError } from 'rxjs/operators'

import { LoginForm } from '../interfaces/loginform.interface';
import { RegisterForm } from '../interfaces/registerform.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

const BASE_URL = environment.base_url;
declare const gapi: any

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  public usuario!: Usuario;

  constructor( private http: HttpClient, private router: Router, private ngZone: NgZone) { 
    this.googleInit()
  }

  get getToken():string{
    return localStorage.getItem('token') || ''
  }

  get uid(): string {
    return this.usuario?.uid || ''
  }

  logout(){
    localStorage.removeItem('token') 
    this.router.navigateByUrl('/login')

    // Esto es para cuando arregle el de google
    // this.auth2.signOut().then(() => {
    //   this.ngZone.run(() => {
    //     this.router.navigateByUrl('/login')
    //   })
    // });
  }

  googleInit(){

    return new Promise<void>( resolve => {
      gapi.load('auth2', () =>{
        this.auth2 = gapi.auth2.init({
          client_id: '407267542075-6d1uv221seqntohuer5eh6057nhkemmm.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    })

  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${BASE_URL}/login/renew`, {
      headers: {
        'x-token': this.getToken
      }
    }).pipe(
      map( (resp: any) => {
        const { email = '', google, nombre, role, uid, img = ''} = resp.usuario
        this.usuario = new Usuario(nombre, email, '', role, google, img, uid)
        localStorage.setItem('token', resp.token)
        return true
      }),
      catchError( error => of(false))
    )
  }

  crearusuario( formData: RegisterForm) {
    return this.http.post(`${BASE_URL}/usuarios`, formData).pipe(
      tap( (resp: any) => { 
        localStorage.setItem('token', resp.token)
      })
    )
  }

  actualizarPerfil( data: { email: string, nombre: string, role: string}){

    const role = this.usuario?.role || ''

    data = { ...data, role }

    return this.http.put(`${BASE_URL}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.getToken
      }
    });

  }

  login( formData: LoginForm) {
    return this.http.post(`${BASE_URL}/login`, formData).pipe(
      tap( (resp: any) => { 
        localStorage.setItem('token', resp.token)
      })
    )
  }

  loginGoogle( token: string ) {
    return this.http.post(`${BASE_URL}/login/google`, { token }).pipe(
      tap( (resp: any) => { 
        localStorage.setItem('token', resp.token)
      })
    )
  }
}
