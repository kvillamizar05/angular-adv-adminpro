import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';

const BASE_URL = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }

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

  crearMedico(medico: { nombre: string, hospital: string}){
    const url = `${BASE_URL}/medicos`
    return this.http.post(url, medico ,this.headers)
  }

  cargarMedicos() {
    const url = `${BASE_URL}/medicos`
    return this.http.get<{ ok: boolean, medicos: Medico[] }>(url, this.headers).pipe(
      map( (resp: { medicos: Medico[], ok: boolean }) => resp.medicos)
    )
  }

  actualizarMedico(medico: Medico){
    const url = `${BASE_URL}/medicos/${medico._id}`
    return this.http.put(url, medico ,this.headers)
  }

  eliminarMedico(_id: string | undefined){
    const url = `${BASE_URL}/medicos/${_id}`
    return this.http.delete(url,this.headers)
  }

  getMedicoById(id: string){
    const url = `${BASE_URL}/medicos/${id}`
    return this.http.get<{ ok: boolean, medico: Medico }>(url, this.headers).pipe(
      map( (resp: { medico: Medico, ok: boolean }) => resp.medico)
    )
  }
}
