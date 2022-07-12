import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

declare var gapi: any;
declare var async: any;
declare var pageToken: null;

@Component({
  selector: 'app-facultad',
  templateUrl: './facultad.component.html',
  styleUrls: ['./facultad.component.scss']
})
export class FacultadComponent implements OnInit {
  fileMetadata: any;
  form:any;

  constructor(private formBuilder: FormBuilder,) {
    this.form = this.formBuilder.group({
      facultad:''
    });
  }

  ngOnInit(): void {
  }

  creaCarpeta(){
    let facultad = this.form.get("facultad")?.value;
    let padre:any;
    gapi.client.drive.files.list({
      "q": "name='Bitacoras Academicas'"
    }).then((response:any) => {
      // Handle the results here (response.result has the parsed body).
      console.log("Bitacora?", response.result.files[0].id);
      padre=response.result.files[0].id;
      this.fileMetadata = {
        'name': "Facultad de "+facultad,
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': [padre]
      };
      gapi.client.drive.files.list({
        "q": "name='"+facultad+"'"
      })
          .then((response:any) => {
                  // Handle the results here (response.result has the parsed body).
                  console.log("Response", response);
                  if (response.result.files.length == 0){
                    gapi.client.drive.files.create({
                      resource: this.fileMetadata,
                      fields: 'id'
                    }).then((response:any) =>{
                      console.log('Files:' + response.result.files);
                    });
                  }
                }, (err:any) => { console.error("Execute error", err); })
    }, (err:any) => { console.error("Execute error", err); })
    
  }

  buscar(){
    return gapi.client.drive.files.list({
      "q": "name='XXX'"
    })
        .then(function(response:any) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response.result.files);
              },
              function(err:any) { console.error("Execute error", err); });
  }

}
