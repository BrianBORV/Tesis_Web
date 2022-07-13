import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

declare var gapi: any;

@Component({
  selector: 'app-proyecto-c',
  templateUrl: './proyecto-c.component.html',
  styleUrls: ['./proyecto-c.component.scss']
})
export class ProyectoCComponent implements OnInit {
  fileMetadata: any;
  files: any[] = [];
  form:any;
  IdFacultad : any=null;

  constructor(private formBuilder: FormBuilder,) {
    this.form = this.formBuilder.group({
      proyecto:''
    });
    this.buscarFacultad();
   }

  ngOnInit(): void {
    
  }

  onSelect(val:any){
    this.IdFacultad=val;
  }

  creaCarpeta(){
    let proyecto = this.form.get("proyecto")?.value;
    this.fileMetadata = {
      'name': proyecto,
      'mimeType': 'application/vnd.google-apps.folder',
      'parents': [this.IdFacultad]
    };
    gapi.client.drive.files.list({
      "q": "name='"+proyecto+"' and '"+this.IdFacultad+"' in parents" 
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
    
  }

  buscarFacultad(){
    try {
      gapi.client.drive.files.list({
        "q": "mimeType='application/vnd.google-apps.folder' and '"+localStorage.getItem("IdBitacora")+"' in parents"
      }).then((res:any) => {
        console.log(res);
        Array.prototype.push.apply(this.files, res.result.files);
        this.files.forEach(function(file: { name: any; id: any; }) {
          console.log('Found file:', file.name, file.id);
        });
      });
      
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

}
