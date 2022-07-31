import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';

declare var gapi: any;

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.scss']
})
export class BitacoraComponent implements OnInit {
  fileMetadata:any;
  form:any;
  files: any[] = [];
  filesP: any[] = [];
  filesM: any[] = [];
  IdFacultad : any=null;
  IdProyecto :any=null;
  IdMateria :any=null;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      materia:'',
      clase:'',
      inicio: '',
      fin:'',
      nombre:'',
      periodo:''
    });
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
    this.buscarMateria();
  }

  onSelectM(valM:any){
    this.IdMateria=valM;

  }

  async buscarFacultad(){
    try {
      await gapi.client.drive.files.list({
        "q": "mimeType='application/vnd.google-apps.folder' and '"+localStorage.getItem("IdBitacora")+"' in parents"
      }).then((res:any) => {
        Array.prototype.push.apply(this.files, res.result.files);
        this.files.forEach(function(file: { name: any; id: any; }) {
        });
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
        Array.prototype.push.apply(this.filesP, res2.result.files);
        this.filesP.forEach(function(fileP: { name: any; id: any; }) {
        });
      });
      
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  async buscarMateria(){
    try {
      this.filesM = [];
      await gapi.client.drive.files.list({
        "q": "mimeType='application/vnd.google-apps.folder' and '"+this.IdProyecto+"' in parents"
      }).then((res2:any) => {
        Array.prototype.push.apply(this.filesM, res2.result.files);
        this.filesM.forEach(function(fileM: { name: any; id: any; }) {
        });
      });
      
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  generarBitacora(){
    let inicio = this.form.get("inicio")?.value;
    let fin = this.form.get("fin")?.value;
    let nombre = this.form.get("nombre")?.value;
    let periodo= this.form.get("periodo")?.value;
    let request:  any[] = [];

    console.log("Generando bitacora")

    request = [
      {
        "insertText": {
          "location": {
            "index": 1
          },
          "text": "DESARROLLO CONTENIDO PROGRAMÁTICO PERIODO ACADÉMICO {{PERIODO}}\n\n"
        }
      },
      {
        "insertTable": {
          "rows": 3,
          "columns": 5,
          "endOfSegmentLocation": {
            "segmentId": ""
          }
        }
      },
      {
        "mergeTableCells": {
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 0,
              "rowIndex": 0,
              "tableStartLocation": {
                "segmentId": "",
                "index": 67
              }
            },
            "rowSpan": 1,
            "columnSpan": 5
          }
        }
      },
      {
        "mergeTableCells": {
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 0,
              "rowIndex": 1,
              "tableStartLocation": {
                "segmentId": "",
                "index": 67
              }
            },
            "rowSpan": 1,
            "columnSpan": 5
          }
        }
      },
      {
        "mergeTableCells": {
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 1,
              "rowIndex": 2,
              "tableStartLocation": {
                "segmentId": "",
                "index": 67
              }
            },
            "rowSpan": 1,
            "columnSpan": 4
          }
        }
      },
      {
        "insertText": {
          "location": {
            "index": 70
          },
          "text": "PERIODO COMPRENDIDO ENTRE"
        }
      },
      {
        "insertText": {
          "location": {
            "index": 106
          },
          "text": "{{INICIO}} Y {{FIN}}"
        }
      },
      {
        "insertText": {
          "location": {
            "index": 137
          },
          "text": "Profesor:"
        }
      },
      {
        "insertText": {
          "location": {
            "index": 148
          },
          "text": "{{NOMBRE}}"
        }
      }
    ]

    let request2:any[]=[];
    request2=[
      {
        "insertText": {
          "location": {
            "index": 166
          },
          "text": "\nSeñores proyecto curricular: \nDe acuerdo con las temáticas trazadas por los syllabus, les informo que en el período referenciado he dictado los siguientes temas para las materias que dicto así:\n\n"
        }
      },
      {
        "replaceAllText": {
          "containsText": {
            "text": "{{PERIODO}}"
          },
          "replaceText": periodo
        }
      },
      {
        "replaceAllText": {
          "containsText": {
            "text": "{{INICIO}}"
          },
          "replaceText": inicio
        }
      },
      {
        "replaceAllText": {
          "containsText": {
            "text": "{{FIN}}"
          },
          "replaceText": fin
        }
      },
      {
        "replaceAllText": {
          "containsText": {
            "text": "{{NOMBRE}}"
          },
          "replaceText": nombre
        }
      }
    ]

    let nombreBitacora= this.filesM.find(x=>x.id == this.IdMateria).name;
    console.log(nombreBitacora);
    this.fileMetadata = {
      'name': 'Informe '+nombreBitacora,
      'mimeType': 'application/vnd.google-apps.document',
      'parents': [this.IdMateria]
    };
    gapi.client.drive.files.list({
      "q": "name='Informe "+nombreBitacora+"'"
    })
        .then((response:any) => {
                // Handle the results here (response.result has the parsed body).
                if (response.result.files.length == 0){
                  gapi.client.drive.files.create({
                    resource: this.fileMetadata,
                    fields: 'id'
                  }).then((response:any) =>{
                    console.log(response.result.id);
                    gapi.client.docs.documents.batchUpdate({
                      "documentId": response.result.id, 
                      "resource": {
                        "requests": request
                      }
                    }).then((response2:any) => {
                      // Handle the results here (response.result has the parsed body).
                      console.log("Response", response2);
                      gapi.client.docs.documents.batchUpdate({
                        "documentId": response2.result.documentId,
                        "resource": {
                          "requests": request2
                        } 
                      }).then((response:any)=>{
                        console.log(response);
                      })
                    })
                  });
                }
              }, (err:any) => { console.error("Execute error", err); })
  }

  

  

}
