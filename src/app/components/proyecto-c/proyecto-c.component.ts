import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var gapi: any;

@Component({
  selector: 'app-proyecto-c',
  templateUrl: './proyecto-c.component.html',
  styleUrls: ['./proyecto-c.component.scss']
})
export class ProyectoCComponent implements OnInit {
  fileMetadata: any;
  files: any[] = [];
  isFiles: boolean = false;
  form: any;
  IdFacultad: any = null;

  constructor(private formBuilder: FormBuilder, private router: Router, private zone: NgZone) {
    this.form = this.formBuilder.group({
      proyecto: ''
    });

  }

  ngOnInit(): void {
    this.buscarFacultad();
  }

  onSelect(val: any) {
    this.IdFacultad = val;
  }

  creaCarpeta() {
    let proyecto = this.form.get("proyecto")?.value;
    if (proyecto == null || proyecto == "") {
      Swal.fire({
        title: 'Error',
        text: 'Debe digitar el nombre de un Proyecto Curricular',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
    } else {
      this.fileMetadata = {
        'name': proyecto,
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': [this.IdFacultad]
      };
      gapi.client.drive.files.list({
        "q": "name='" + proyecto + "' and '" + this.IdFacultad + "' in parents"
      })
        .then((response: any) => {
          if (response.result.files.length == 0) {
            gapi.client.drive.files.create({
              resource: this.fileMetadata,
              fields: 'id'
            }).then((response: any) => {
              Swal.fire({
                title: 'Proyecto Creada',
                text: 'Proyecto Curricular creado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              }).then((result) => {
                this.zone.run(() => {
                  this.router.navigate(['/menu']);
                });
              })

            });
          }else{
            if (response.result.files[0].name==proyecto) {
              Swal.fire({
                title: 'Advertencia',
                text: 'El Proyecto ya existe',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
              })
              
            }
          }
        }, (err: any) => { console.error("Execute error", err); })
    }

  }

  async buscarFacultad() {
    try {
      await gapi.client.drive.files.list({
        "q": "mimeType='application/vnd.google-apps.folder' and '" + localStorage.getItem("IdBitacora") + "' in parents and name contains 'Facultad'"
      }).then((res: any) => {
        Array.prototype.push.apply(this.files, res.result.files);


        this.isFiles = true;
      });

    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

}
