import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any[] = [];

  cargarMenu() {
    const temp = localStorage.getItem('menu') || ""
    this.menu = JSON.parse(temp) || []
  }

  // menu: any[] = [
  //   { 
  //     title: 'Dashboard',
  //     icon: "mdi mdi-gauge",
  //     submenu: [
  //       { title: 'Main', url: '/'},
  //       { title: 'ProgressBar', url: 'progress'},
  //       { title: 'Graficas', url: 'grafica1'},
  //       { title: 'Promesas', url: 'promise'},
  //       { title: 'RXJS', url: 'rxjs'},      

  //     ]
  //   },
  //   { 
  //     title: 'Mantenimiento',
  //     icon: "mdi mdi-folder-lock-open",
  //     submenu: [
  //       { title: 'Usuarios', url: 'usuarios'},
  //       { title: 'Hospitales', url: 'hospitales'},
  //       { title: 'Medicos', url: 'medicos'},     

  //     ]
  //   }
  // ]

}
