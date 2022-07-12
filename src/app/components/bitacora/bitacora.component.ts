import { Component, OnInit } from '@angular/core';
import { PrototipoComponent } from '../prototipo/prototipo.component';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.scss']
})
export class BitacoraComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  proto = new PrototipoComponent;

  mostrarBitacora(){
    this.proto.visible = this.proto.visible?false:true;
  }

}
