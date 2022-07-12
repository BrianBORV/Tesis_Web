import { Component, OnInit } from '@angular/core';

declare var gapi: any;

@Component({
  selector: 'app-proyecto-c',
  templateUrl: './proyecto-c.component.html',
  styleUrls: ['./proyecto-c.component.scss']
})
export class ProyectoCComponent implements OnInit {
  fileMetadata: { name: string; mimeType: string; } | undefined;
  files: any[] = [];

  constructor() {
    this.buscarFacultad();
   }

  ngOnInit(): void {
    
  }

  creaCarpeta(){
    this.fileMetadata = {
      'name': 'carpetaTesis',
      'mimeType': 'application/vnd.google-apps.folder'
    };
    gapi.client.drive.files.create({
      resource: this.fileMetadata,
      fields: 'id'
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
