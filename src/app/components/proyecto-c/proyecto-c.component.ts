import { Component, OnInit } from '@angular/core';

declare var gapi: any;

@Component({
  selector: 'app-proyecto-c',
  templateUrl: './proyecto-c.component.html',
  styleUrls: ['./proyecto-c.component.scss']
})
export class ProyectoCComponent implements OnInit {
  fileMetadata: { name: string; mimeType: string; } | undefined;

  constructor() { }

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

}
