import { AfterViewInit, Component, NgZone, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { GapiService } from '../../services/gapiService'
import Swal from 'sweetalert2'

declare var gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {

  isLogin: boolean = false;
  fileMetadata: any;
  // If modifying these scopes, delete token.json.


  constructor(private gapiServ: GapiService, private router: Router, private zone: NgZone) {
    localStorage.removeItem('isLogin');
    localStorage.removeItem('IdBitacora');
    localStorage.removeItem('IdRecursos');
    this.isLogin = Boolean(localStorage.getItem("isLogin"));
    console.log(this.isLogin)

  }

  initClient() {

    // It's OK to expose these credentials, they are client safe.
    let initObj = {
      apiKey: 'AIzaSyDnkotdvUH83-K_M7h3i-Y6p2AJwihAz8Q',
      clientId: '28332543331-tekrfvbp0lqkve1femo42dbai5gikk37.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest', 'https://docs.googleapis.com/$discovery/rest?version=v1'],
      scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents'
    };
    gapi.client.init(initObj);


  }

  ngOnInit(): void {
    var info: any = document.getElementById("modal");
    info.click();
  }

  ngAfterViewInit(): void {
    if (this.isLogin) {
      this.gapiServ.gapi$.subscribe((data) => {
        if (data) {
          gapi = data;
        }
      })
    } else {
      gapi.load('client:auth2', this.initClient);
    }

  }

  async login() {
    await gapi.auth2.getAuthInstance().signIn();
    this.isLogin = gapi.auth2.getAuthInstance().isSignedIn.get();
    localStorage.setItem("isLogin", String(this.isLogin));
    console.log(this.isLogin);
    gapi.auth2.getAuthInstance().signIn().then(this.mostrarOpciones());
    this.gapiServ.updateGapi(gapi);
  }

  async verificarCarpetaPadre() {
    this.fileMetadata = {
      'name': "Bitacoras Academicas",
      'mimeType': 'application/vnd.google-apps.folder'
    };
    await gapi.client.drive.files.list({
      "q": "name='Bitacoras Academicas'"
    })
      .then(async (response: any) => {
        // Handle the results here (response.result has the parsed body).
        if (response.result.files.length == 0) {
          await gapi.client.drive.files.create({
            resource: this.fileMetadata,
            fields: 'id'
          }).then(async (response: any) => {
            localStorage.setItem("IdBitacora", response.result.id);
            let metadata: any = {};
            metadata = {
              'name': "Recursos Bitácoras",
              'mimeType': 'application/vnd.google-apps.folder',
              'parents': [response.result.id]
            };
            await gapi.client.drive.files.create({
              resource: metadata,
              fields: 'id'
            }).then((response2: any) => {
              localStorage.setItem("IdRecursos", response2.result.id);
            })
          });
        } else {
          localStorage.setItem("IdBitacora", response.result.files[0].id);

        }
        console.log("Redirigiendo")
        Swal.fire({
          title: 'Sesión Iniciada',
          text: 'Haz iniciado sesión correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          this.zone.run(() => {
            this.router.navigate(['/menu']);
          });
        })
      }, (err: any) => { console.error("Execute error", err); })
  }


  listFiles() {
    gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)"
    }).then(function (response: any) {
      console.log('Files:');
      var files = response.result.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          console.log(file.name + ' (' + file.id + ')');
        }
      } else {
        console.log('No files found.');
      }
    });
  }

  mostrarOpciones() {
    this.verificarCarpetaPadre();
  }


}
