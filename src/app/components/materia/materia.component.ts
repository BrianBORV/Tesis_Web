import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';

declare var gapi: any;

@Component({
  selector: 'app-materia',
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.scss']
})
export class MateriaComponent implements OnInit {
  fileMetadata:any;
  form:any;
  files: any[] = [];
  filesP: any[] = [];
  isFiles: boolean = false;
  isFilesP: boolean = false;
  IdFacultad : any=null;
  IdProyecto :any=null;

  constructor(private formBuilder: FormBuilder,private router:Router, private zone: NgZone) {
    this.form = this.formBuilder.group({
      materia:'',
      grupo: ''
    });
    console.log(this.zone);
    
    
   }

  ngOnInit(): void {
    this.buscarFacultad();
  }

  onSelect(val:any){
    this.IdFacultad=val;
    this.buscarProyecto();
  }

  onSelectP(valP:any){
    this.IdProyecto=valP;
  }

  creaCarpeta(){
    let materia = this.form.get("materia")?.value;
    let grupo = this.form.get("grupo")?.value;
    console.log(materia+grupo);
    console.log(this.IdProyecto);
    this.fileMetadata = {
      'name': materia+'-'+grupo,
      'mimeType': 'application/vnd.google-apps.folder',
      'parents': [this.IdProyecto]
    };
    gapi.client.drive.files.list({
      "q": "name='"+ materia+' '+grupo+"' and '"+this.IdProyecto+"' in parents" 
    })
        .then((response:any) => {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
                if (response.result.files.length == 0){
                  gapi.client.drive.files.create({
                    resource: this.fileMetadata,
                    fields: 'id'
                  }).then((response:any) =>{
                    console.log(response);
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
        Array.prototype.push.apply(this.files, res.result.files);
        this.files.forEach(function(file: { name: any; id: any; }) {
          console.log('Found file:', file.name, file.id);
        });
        this.isFiles = true;
        if (!this.isFilesP){
          this.IdFacultad = this.files[0].id;
          this.buscarProyecto();
        }
        
      });
      
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  async buscarProyecto(){
    try {
      this.filesP = [];
      await gapi.client.drive.files.list({
        "q": "mimeType='application/vnd.google-apps.folder' and '"+this.IdFacultad+"' in parents"
      }).then((res2:any) => {
        console.log("Buscando proyecto");
        Array.prototype.push.apply(this.filesP, res2.result.files);
        this.filesP.forEach(function(fileP: { name: any; id: any; }) {
        });
        console.log(this.filesP);
        this.isFilesP = true;
      });
      
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

}
