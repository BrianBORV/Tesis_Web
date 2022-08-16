import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

declare var gapi: any;

@Component({
  selector: 'app-proyecto-c',
  templateUrl: './proyecto-c.component.html',
  styleUrls: ['./proyecto-c.component.scss']
})
export class ProyectoCComponent implements OnInit {
  fileMetadata: any;
  files: any[] = [];
  isFiles: boolean = false;
  form:any;
  IdFacultad : any=null;

  constructor(private formBuilder: FormBuilder,private router:Router, private zone: NgZone) {
    this.form = this.formBuilder.group({
      proyecto:''
    });

    this.ngOnInit();
    
   }

  ngOnInit(): void {
    this.buscarFacultad();
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
                    this.zone.run(() => {
                      this.router.navigate(['/menu']);
                  });
                  });
                }
              }, (err:any) => { console.error("Execute error", err); })
    
  }

  async buscarFacultad(){
    try {
      await gapi.client.drive.files.list({
        "q": "mimeType='application/vnd.google-apps.folder' and '"+localStorage.getItem("IdBitacora")+"' in parents"
      }).then((res:any) => {
        console.log(res);
        Array.prototype.push.apply(this.files, res.result.files);
        this.files.forEach(function(file: { name: any; id: any; }) {
          console.log('Found file:', file.name, file.id);
        });

        this.isFiles = true;
      });
      
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

}
