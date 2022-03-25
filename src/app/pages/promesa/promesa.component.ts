import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesa',
  templateUrl: './promesa.component.html',
  styles: [
  ]
})
export class PromesaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    // const promesa = new Promise((resolve, reject) => {
    //   if (true) {
    //     resolve('hola mundo')
    //   } else {
    //     reject('algo salio mal')
    //   }
    // });

    // promesa.then((message)=>{
    //   console.log(message)
    // }).catch(err => console.log('error en la promesa', err))

    // console.log('fin de init')
    this.getUsers().then((users) => {
      console.log(users)
    })
  }

  getUsers() {
    return new Promise( resolve =>{
      fetch('https://reqres.in/api/users?page=2')
        .then(response => response.json())
        .then(body => resolve(body.data))
    } )    
  }

}
