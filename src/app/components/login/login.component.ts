import { AfterViewInit, Component, OnInit, } from '@angular/core';
import { GapiService } from '../../services/gapiService'

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

  
  constructor(private gapiServ: GapiService) {
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

    
    //this.gapiServ.updateGapi(gapi);
    gapi.client.init(initObj);
    

  }

  ngAfterViewInit(): void {
   
    if(this.isLogin){
      this.gapiServ.gapi$.subscribe((data)=>{
        if (data) {
          gapi = data;          
        }
      })
    }else{
      gapi.load('client:auth2', this.initClient);
    }       
    
  }

  login(){
    gapi.auth2.getAuthInstance().signIn();
    this.isLogin=gapi.auth2.getAuthInstance().isSignedIn.get();
    localStorage.setItem("isLogin",String(this.isLogin) );
    console.log(this.isLogin);
    gapi.auth2.getAuthInstance().signIn().then(this.mostrarOpciones());
    this.gapiServ.updateGapi(gapi);
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
                if (response.result.files.length == 0){
                  gapi.client.drive.files.create({
                    resource: this.fileMetadata,
                    fields: 'id'
                  }).then((response:any) =>{
                    localStorage.setItem("IdBitacora", response.result.id);
                  });
                }else{
                  localStorage.setItem("IdBitacora",response.result.files[0].id);
                  console.log(response.result.files[0].id)
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

  mostrarOpciones(){
    this.verificarCarpetaPadre();
    console.log(gapi.client.docs.documents);
    console.log(gapi.client.drive.files.create);
  }


}
