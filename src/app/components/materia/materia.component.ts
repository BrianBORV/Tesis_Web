import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var gapi: any;

@Component({
  selector: 'app-materia',
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.scss']
})
export class MateriaComponent implements OnInit {
  fileMetadata: any;
  form: any;
  files: any[] = [];
  filesP: any[] = [];
  isFiles: boolean = false;
  isFilesP: boolean = false;
  IdFacultad: any = null;
  IdProyecto: any = null;

  constructor(private formBuilder: FormBuilder, private router: Router, private zone: NgZone) {
    this.form = this.formBuilder.group({
      materia: '',
      grupo: ''
    });


  }

  ngOnInit(): void {
    this.buscarFacultad();
  }

  onSelect(val: any) {
    this.IdFacultad = val;
    this.buscarProyecto();
  }

  onSelectP(valP: any) {
    this.IdProyecto = valP;
  }

  creaCarpeta() {
    let materia = this.form.get("materia")?.value;
    let grupo = this.form.get("grupo")?.value;
    this.fileMetadata = {
      'name': materia + '-' + grupo,
      'mimeType': 'application/vnd.google-apps.folder',
      'parents': [this.IdProyecto]
    };
    gapi.client.drive.files.list({
      "q": "name='" + materia + ' ' + grupo + "' and '" + this.IdProyecto + "' in parents"
    })
      .then((response: any) => {
        // Handle the results here (response.result has the parsed body).
        if (response.result.files.length == 0) {
          gapi.client.drive.files.create({
            resource: this.fileMetadata,
            fields: 'id'
          }).then((response: any) => {
            Swal.fire({
              title: 'Asignatura Creada',
              text: 'Asignatura creada correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then((result) => {
              this.zone.run(() => {
                this.router.navigate(['/menu']);
              });
            })

          });
        }
      }, (err: any) => { console.error("Execute error", err); })

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

  async buscarProyecto() {
    try {
      this.filesP = [];
      await gapi.client.drive.files.list({
        "q": "mimeType='application/vnd.google-apps.folder' and '" + this.IdFacultad + "' in parents"
      }).then((res2: any) => {
        console.log("Buscando proyecto");
        Array.prototype.push.apply(this.filesP, res2.result.files);
        this.filesP.forEach(function (fileP: { name: any; id: any; }) {
        });
        this.isFilesP = true;
      });

    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

}
