import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {
  ngOnInit(){
    this.btnClass = `btn ${ this.btnClass }`
  }

  //@Input('value') progress: number = 25;  --> para renombrar la propiedad
  @Input() progress: number = 25;
  @Input() btnClass: string = 'btn-primary'

  @Output() progressChange: EventEmitter<number> = new EventEmitter();

  changeValue(value: number) {
    if (this.progress >= 100 && value >=0) {
      this.progressChange.emit(100);
      this.progress = 100;
    } else if (this.progress <= 0 && value < 0) {
      this.progressChange.emit(0);
      this.progress = 0;
    } else {
      this.progress = this.progress + value
      this.progressChange.emit(this.progress);
    };
  }

  onChange( value: number ){
    if (value >= 100) {
      this.progress = 100
    } else if (value < 0) {
      this.progress = 0
    } else {
      this.progress = value
    }
    this.progressChange.emit( this.progress );
  }
}
