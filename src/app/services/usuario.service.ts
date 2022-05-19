import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap, map, catchError } from 'rxjs/operators'

import { LoginForm } from '../interfaces/loginform.interface';
import { RegisterForm } from '../interfaces/registerform.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const BASE_URL = environment.base_url;
declare const gapi: any

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor( private http: HttpClient, private router: Router, private ngZone: NgZone) { 
    this.googleInit()
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
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${BASE_URL}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token)
      }),
      map( resp => true),
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
