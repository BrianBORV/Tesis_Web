import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var gapi: any;

@Component({
  selector: 'app-facultad',
  templateUrl: './facultad.component.html',
  styleUrls: ['./facultad.component.scss']
})
export class FacultadComponent implements OnInit {
  fileMetadata: any;
  form: any;
  facultad:any;
  alertaFormulario:string = "Por favor diligencie este campo";
  isLogin: boolean;

  constructor(private formBuilder: FormBuilder, private router: Router, private zone: NgZone) {
    this.form = this.formBuilder.group({
      facultad: ''
    });
    this.isLogin = Boolean(localStorage.getItem("isLogin"));
    
  }

  ngOnInit(): void {
    if (this.isLogin == true) {
      if(localStorage.getItem("InfoF")!="1"){
        var info: any = document.getElementById("modal");
      info.click();
      localStorage.setItem("InfoF", "1");
      }
    var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;
    form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
    }else{
      this.zone.run(() => {
        this.router.navigate(['/index']);
      });
    }
    
  }

  creaCarpeta() {
    let facultad = this.form.get("facultad")?.value;
    if (facultad==null || facultad=="") {
      Swal.fire({
        title: 'Error',
        text: 'Debe digitar el nombre de una facultad',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
    } else {
      let padre: any;
    gapi.client.drive.files.list({
      "q": "name='Bitacoras Academicas'"
    }).then((response: any) => {
      padre = response.result.files[0].id;
      this.fileMetadata = {
        'name': facultad,
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': [padre]
      };
      gapi.client.drive.files.list({
        "q": "name='" + facultad + "' and '" + padre + "' in parents"
      })
        .then((response: any) => {
          if (response.result.files.length == 0) {
            gapi.client.drive.files.create({
              resource: this.fileMetadata,
              fields: 'id'
            }).then((response: any) => {
              Swal.fire({
                title: 'Facultad Creada',
                text: 'Facultad creada correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              }).then((result) => {
                this.zone.run(() => {
                  this.router.navigate(['/menu']);
                });
              })

            });
          }else{
            if (response.result.files[0].name==facultad) {
              Swal.fire({
                title: 'Advertencia',
                text: 'La facultad ya existe',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
              })
              
            }
          }
        }, (err: any) => { console.error("Execute error", err); })
    }, (err: any) => { console.error("Execute error", err); })
    }
    

  }

  navMenu(){
    this.zone.run(() => {
      this.router.navigate(['/menu']);
    });
  }

  navFacultad(){
    this.zone.run(() => {
      this.router.navigate(['/registrar_facultad']);
    });
  }

  navProyecto(){
    this.zone.run(() => {
      this.router.navigate(['/registrar_proyecto']);
    });
  }

  navMateria(){
    this.zone.run(() => {
      this.router.navigate(['/registrar_materia']);
    });
  }

  navClase(){
    this.zone.run(() => {
      this.router.navigate(['/registrar_clase']);
    });
  }

  navBitacora(){
    this.zone.run(() => {
      this.router.navigate(['/generar_bitacora']);
    });
  }

}
