import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarImg(
    file: File,
    type: 'usuarios'|'medicos'|'hospitales',
    id: string
  ) {
    try {

      const url = `${base_url}/uploads/${type}/${id}`
      const formData = new FormData()

      formData.append('imagen', file);

      const resp = await fetch(url, {
        method: 'put',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json()

      if (data.ok) {
        return data.nombreArchivo
      }

      console.log('data', data)

      return false

    } catch (error) {
      console.log('Error', Error)
      return false
    }
  } 

}
