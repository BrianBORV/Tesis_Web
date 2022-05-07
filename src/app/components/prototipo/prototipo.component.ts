import { Component, OnInit } from '@angular/core';

declare var gapi: any;



@Component({
  selector: 'app-prototipo',
  templateUrl: './prototipo.component.html',
  styleUrls: ['./prototipo.component.scss']
})
export class PrototipoComponent implements OnInit {
  isLogin: boolean = false;
  fileMetadata: any;
// If modifying these scopes, delete token.json.

  initClient() {
  
      // It's OK to expose these credentials, they are client safe.
      let initObj = {
        apiKey: 'AIzaSyDnkotdvUH83-K_M7h3i-Y6p2AJwihAz8Q',
        clientId: '28332543331-tekrfvbp0lqkve1femo42dbai5gikk37.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: 'https://www.googleapis.com/auth/drive'
      };
      
      gapi.client.init(initObj);
      

  }


  constructor() {
   }

  ngOnInit(): void {
    gapi.load('client:auth2', this.initClient);
    if (gapi) {
      if (this.isLogin) {
        this.verificarCarpetaPadre();
        this.mostrarOpciones();
      }else{
        this.login();
        this.isLogin=true;
      }
    }
    
  }

  login(){
    gapi.auth2.getAuthInstance().signIn();
    this.isLogin=gapi.auth2.getAuthInstance().isSignedIn.get();
    console.log(this.isLogin);
    gapi.auth2.getAuthInstance().signIn().then(this.mostrarOpciones());    
  }

  verificarCarpetaPadre(){
    this.fileMetadata = {
      'name': "Bitacoras Academicas",
      'mimeType': 'application/vnd.google-apps.folder'
    };
    gapi.client.drive.files.list({
      "q": "name='Bitacoras Academicas'"
    })
        .then((response:any) => {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
                if (response.result.files.length == 0){
                  gapi.client.drive.files.create({
                    resource: this.fileMetadata,
                    fields: 'id'
                  }).then((response:any) =>{
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
              }, (err:any) => { console.error("Execute error", err); })
  }


  listFiles(){
    gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)"
    }).then(function(response:any) {
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

  visible:boolean=false;
  visibleF:boolean=false;
  visibleP:boolean=false;
  visibleM:boolean =false;
  visibleC:boolean= false;
  visibleB:boolean =false;

  mostrarOpciones(){
    this.visible = this.visible?false:true;
  }
  mostrarMateria(){
    this.visibleM = this.visibleM?false:true;
    this.visible = this.visible?false:true;
  }
  mostrarClase(){
    this.visibleC = this.visibleC?false:true;
    this.visible = this.visible?false:true;
  }
  mostrarBitacora(){
    this.visibleB = this.visibleB?false:true;
    this.visible = this.visible?false:true;
  }
  mostrarFacultad(){
    this.visibleF = this.visibleM?false:true;
    this.visible = this.visible?false:true;
  }
  mostrarProyecto(){
    this.visibleP = this.visibleM?false:true;
    this.visible = this.visible?false:true;
  }

}
