import { AfterViewInit, Component, NgZone, } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GapiService } from '../../services/gapiService'


declare var gapi: any;

@Component({
  selector: 'app-prototipo',
  templateUrl: './prototipo.component.html',
  styleUrls: ['./prototipo.component.scss']
})
export class PrototipoComponent implements AfterViewInit {
  isLogin: boolean = false;
  fileMetadata: any;
  // If modifying these scopes, delete token.json.


  constructor(private gapiServ: GapiService, private router: Router, private zone: NgZone) {
    this.isLogin = Boolean(localStorage.getItem("isLogin"));

  }

  ngOnInit() {
    if (this.isLogin == true) {
      if(localStorage.getItem("InfoM")!="1"){
        var info: any = document.getElementById("modal");
      info.click();
      localStorage.setItem("InfoM", "1");
      }
      }else{
      this.zone.run(() => {
        this.router.navigate(['/index']);
      });
    }

  }

  initClient() {

    // It's OK to expose these credentials, they are client safe.
    let initObj = {
      apiKey: 'AIzaSyDnkotdvUH83-K_M7h3i-Y6p2AJwihAz8Q',
      clientId: '28332543331-tekrfvbp0lqkve1femo42dbai5gikk37.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest', 'https://docs.googleapis.com/$discovery/rest?version=v1'],
      scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents'
    };


    //this.gapiServ.updateGapi(gapi);
    gapi.client.init(initObj);


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

  verificarCarpetaPadre() {
    this.fileMetadata = {
      'name': "Bitacoras Academicas",
      'mimeType': 'application/vnd.google-apps.folder'
    };
    gapi.client.drive.files.list({
      "q": "name='Bitacoras Academicas'"
    })
      .then((response: any) => {
        // Handle the results here (response.result has the parsed body).
        if (response.result.files.length == 0) {
          gapi.client.drive.files.create({
            resource: this.fileMetadata,
            fields: 'id'
          }).then((response: any) => {
            localStorage.setItem("IdBitacora", response.result.id);
          });
        } else {
          localStorage.setItem("IdBitacora", response.result.files[0].id);
          console.log(response.result.files[0].id)
        }
      }, (err: any) => { console.error("Execute error", err); })
  }

  mostrarOpciones() {
    this.verificarCarpetaPadre();
    console.log(gapi.client.docs.documents);
    console.log(gapi.client.drive.files.create);
  }

  navFacultad() {
    this.zone.run(() => {
      this.router.navigate(['/registrar_facultad']);
    });
  }

  navProyecto() {
    this.zone.run(() => {
      this.router.navigate(['/registrar_proyecto']);
    });
  }

  navMateria() {
    this.zone.run(() => {
      this.router.navigate(['/registrar_materia']);
    });
  }

  navClase() {
    this.zone.run(() => {
      this.router.navigate(['/registrar_clase']);
    });
  }

  navBitacora() {
    this.zone.run(() => {
      this.router.navigate(['/generar_bitacora']);
    });
  }

  async logOut() {
    await gapi.auth2.getAuthInstance().signOut();
    localStorage.removeItem('isLogin');
    localStorage.removeItem('IdBitacora');
    localStorage.removeItem('IdRecursos');
    localStorage.removeItem("InfoM");
    localStorage.removeItem("InfoC");
    localStorage.removeItem("InfoMat");
    localStorage.removeItem("InfoP");
    localStorage.removeItem("InfoF");
    localStorage.removeItem("InfoB");
    this.gapiServ.updateGapi(gapi);
    console.log(localStorage);
    Swal.fire({
      title: 'Sesión Cerrada',
      text: 'Sesión cerrada correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      this.zone.run(() => {
        this.router.navigate(['/index']);
      });
    })
  }

}
