import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';
import { Usuario } from '../models/usuario.model';

const BASE_URL = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  get getToken():string{
    return localStorage.getItem('token') || ''
  }

  get headers() {
    return {
      headers: {
        'x-token': this.getToken
      }
    }
  }

  private transformarUsuarios( resultado: any[]): Usuario[] {
    return resultado.map(
      user => new Usuario(user.nombre, user.email,'', user.role, user.google, user.img, user.email)
    )
  }

  
  private transformarHospitales( resultado: any[]): Hospital[] {
    return resultado
  }

  private transformarMedicos( resultado: any[]): Medico[] {
    return resultado
  }

  busquedaGlobal(termino:string) {
    const url = `${BASE_URL}/todo/${termino}`
    return this.http.get(url, this.headers)
  }

  buscar(
    tipo: "usuarios"|"medicos"|"hospitales",
    termino: string = ''
    ) {
    const url = `${BASE_URL}/todo/coleccion/${tipo}/${termino}`
    return this.http.get<any[]>(url, this.headers).pipe( map( (resp: any) => {
      switch (tipo) {
        case "usuarios":
          return this.transformarUsuarios(resp.resultado)
        case "hospitales":
          return this.transformarHospitales(resp.resultado)
        case "medicos":
          return this.transformarMedicos(resp.resultado)
     
        default:
          return []
      }
    }))
  }
}
