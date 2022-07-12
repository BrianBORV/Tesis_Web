import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';

declare var gapi: any;

@Component({
  selector: 'app-materia',
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.scss']
})
export class MateriaComponent implements OnInit {
  fileMetadata:any;
  form:any;

  constructor(private formBuilder: FormBuilder,) {
    this.form = this.formBuilder.group({
      materia:''
    });
   }

  ngOnInit(): void {
  }

  creaCarpeta(){
    let materia = this.form.get("materia")?.value;
    this.fileMetadata = {
      'name': materia,
      'mimeType': 'application/vnd.google-apps.folder'
    };
    gapi.client.drive.files.list({
      "q": "name='"+materia+"'"
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

}
