import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';

const BASE_URL = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient, private router: Router) { }

  get getToken():string{
    return localStorage.getItem('token') || ''
  }

  get headers() {
    return {
      headers: {
        'x-token': this.getToken,
      }
    }
  }

  crearHospital(nombre: string){
    const url = `${BASE_URL}/hospitales`
    return this.http.post(url, { nombre } ,this.headers)
  }

  cargarHospitales() {
    const url = `${BASE_URL}/hospitales`
    return this.http.get<{ ok: boolean, hospitales: Hospital[] }>(url, this.headers).pipe(
      map( (resp: { hospitales: Hospital[], ok: boolean }) => resp.hospitales)
    )
  }

  actualizarHospital(_id: string | undefined, nombre: string){
    const url = `${BASE_URL}/hospitales/${_id}`
    return this.http.put(url, { nombre } ,this.headers)
  }

  eliminarHospital(_id: string | undefined){
    const url = `${BASE_URL}/hospitales/${_id}`
    return this.http.delete(url,this.headers)
  }
}
