import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';

declare var gapi: any;


@Component({
  selector: 'app-clase',
  templateUrl: './clase.component.html',
  styleUrls: ['./clase.component.scss']
})
export class ClaseComponent implements OnInit {
  fileMetadata:any;
  form:any;
  files: any[] = [];
  filesP: any[] = [];
  filesM: any[] = [];
  isFiles: boolean = false;
  isFilesP: boolean = false;
  IdFacultad : any = null;
  IdProyecto : any = null;
  IdMateria : any = null;
  IdClase: any = null;

  constructor(private formBuilder: FormBuilder, private router:Router, private zone: NgZone) {
    this.form = this.formBuilder.group({
      materia:'',
      clase:'',
      inicio: '',
      fin:'',
      texto:'',
      anexos:''
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

  registrarClase(){
    let clase = this.form.get("clase")?.value;
    let inicio = this.form.get("inicio")?.value;
    let fin = this.form.get("fin")?.value;
    let texto = this.form.get("texto")?.value;
    let anexos = this.form.get("anexos")?.value;
    let requestTabla:  any[] = [];
    let requestTextoT: any[] = [];
  
    requestTabla = [
      {
        "insertTable": {
          "rows": 6,
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
              "columnIndex": 1,
              "rowIndex": 0,
              "tableStartLocation": {
                "segmentId": "",
                "index": 2
              }
            },
            "rowSpan": 1,
            "columnSpan": 2
          }
        }
      },
      {
        "mergeTableCells": {
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 3,
              "rowIndex": 1,
              "tableStartLocation": {
                "segmentId": "",
                "index": 2
              }
            },
            "rowSpan": 1,
            "columnSpan": 2
          }
        }
      },
      {
        "mergeTableCells": {
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 0,
              "rowIndex": 2,
              "tableStartLocation": {
                "segmentId": "",
                "index": 2
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
              "rowIndex": 3,
              "tableStartLocation": {
                "segmentId": "",
                "index": 2
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
              "rowIndex": 4,
              "tableStartLocation": {
                "segmentId": "",
                "index": 2
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
              "rowIndex": 5,
              "tableStartLocation": {
                "segmentId": "",
                "index": 2
              }
            },
            "rowSpan": 1,
            "columnSpan": 5
          }
        }
      }      
 ]
  let nombreMateria:any;
  let grupo:any;
  console.log(this.filesM.find(x=>x.id == this.IdMateria).name);
   nombreMateria=this.filesM.find(x=>x.id == this.IdMateria).name.substring(0, this.filesM.find(x=>x.id == this.IdMateria).name.indexOf('-'));
   grupo=this.filesM.find(x=>x.id == this.IdMateria).name.substring(this.filesM.find(x=>x.id == this.IdMateria).name.indexOf('-')+1);
 let request2: any;
 request2=[
  {
    "replaceAllText": {
      "replaceText": nombreMateria,
      "containsText": {
        "text": "{{MATERIA}}"
      }
    }
  },
  {
    "replaceAllText": {
      "replaceText": grupo,
      "containsText": {
        "text": "{{Grupo}}"
      }
    }
  },
  {
    "replaceAllText": {
      "replaceText": clase,
      "containsText": {
        "text": "{{FECHA}}"
      }
    }
  },
  {
    "replaceAllText": {
      "replaceText": inicio+" a "+fin,
      "containsText": {
        "text": "{{HORARIO}}"
      }
    }
  },
  {
    "replaceAllText": {
      "replaceText": texto,
      "containsText": {
        "text": "{{TEXTO}}"
      }
    }
  },
  {
    "replaceAllText": {
      "replaceText": anexos,
      "containsText": {
        "text": "{{ANEXOS}}"
      }
    }
  }
 ]
    this.fileMetadata = {
      'name': clase,
      'mimeType': 'application/vnd.google-apps.document',
      'parents': [this.IdMateria]
    };
    gapi.client.drive.files.list({
      "q": "name='"+clase+"' and '"+this.IdMateria+"' in parents"
    })
        .then((response:any) => {
                // Handle the results here (response.result has the parsed body).
                if (response.result.files.length == 0){
                  gapi.client.drive.files.create({
                    resource: this.fileMetadata,
                    fields: 'id'
                  }).then(async (response:any) =>{
                    console.log(response.result.id);
                    this.IdClase=response.result.id;
                    await gapi.client.docs.documents.batchUpdate({
                      "documentId": response.result.id, 
                      "resource": {
                        "requests": requestTabla
                      }
                    })
                    await gapi.client.docs.documents.get({
                      "documentId": this.IdClase
                    })
                      .then(async (response4:any)=>{
                        var body=response4.result.body;
                        console.log(body)
                        requestTextoT=[
                          {
                            "insertText": {
                              "location": {
                                "index": 5
                              },
                              "text": "Asignatura:"
                            }
                          },
                          {
                            "insertText": {
                              "location": {
                                "index": 18
                              },
                              "text": "{{MATERIA}}"
                            }
                          },
                          {
                            "insertText": {
                              "location": {
                                "index": 33
                              },
                              "text": "Grupo:"
                            }
                          },
                          {
                            "insertText": {
                              "location": {
                                "index": 41
                              },
                              "text": "{{Grupo}}"
                            }
                          },
                          {
                            "insertText": {
                              "location": {
                                "index": 53
                              },
                              "text": "Fecha Sesión:"
                            }
                          },
                          {
                            "insertText": {
                              "location": {
                                "index": 68
                              },
                              "text": "{{FECHA}}"
                            }
                          },
                          {
                            "insertText": {
                              "location": {
                                "index": 79
                              },
                              "text": "Horario:"
                            }
                          },
                          {
                            "insertText": {
                              "location": {
                                "index": 89
                              },
                              "text": "{{HORARIO}}"
                            }
                          },
                          {
                            "insertText": {
                              "location": {
                                "index": 105
                              },
                              "text": "DESCRIPCIÓN DE LA UNIDAD Y ACTIVIDADES"
                            }
                          },
                          {
                            "insertText": {
                              "location": {
                                "index": 162
                              },
                              "text": "{{TEXTO}}"
                            }
                          },
                          {
                            "insertText": {
                              "location": {
                                "index": 174
                              },
                              "text": "HERRAMIENTA"
                            }
                          },
                          {
                            "insertText": {
                              "location": {
                                "index": 196
                              },
                              "text": "{{ANEXOS}}"
                            }
                          }
                       ]
                       await gapi.client.docs.documents.batchUpdate({
                        "documentId": this.IdClase,
                        "resource": {
                          "requests": requestTextoT
                        } 
                      }).then((response4:any)=>{console.log("base añadida")})
                      })
                      await gapi.client.docs.documents.batchUpdate({
                        "documentId": this.IdClase,
                        "resource": {
                          "requests": request2
                        } 
                      })
                    this.estiloClase();
                    this.zone.run(() => {
                      this.router.navigate(['/menu']);
                  });
                    
                  });
                }
              }, (err:any) => { console.error("Execute error", err); })
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

  async buscarMateria(){
    try {
      this.filesM = [];
      await gapi.client.drive.files.list({
        "q": "mimeType='application/vnd.google-apps.folder' and '"+this.IdProyecto+"' in parents"
      }).then((res2:any) => {
        console.log("Buscando materia");
        Array.prototype.push.apply(this.filesM, res2.result.files);
        this.filesM.forEach(function(fileM: { name: any; id: any; }) {
        });
        console.log(this.filesM);
        this.isFilesP = true;
      });
      
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  async estiloClase(){
    let request:any;
    request=[
      {
        "updateTableCellStyle": {
          "fields": "backgroundColor",
          "tableCellStyle": {
        "contentAlignment": "MIDDLE",
            "backgroundColor": {
              "color": {
                "rgbColor": {
                  "blue": 0.8509804,
                  "green": 0.8509804,
                  "red": 0.8509804
                }
              }
            }
            
          },
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 0,
              "rowIndex": 0,
              "tableStartLocation": {
                "index": 2
                
              }
            },
            "columnSpan": 1,
            "rowSpan": 1
          }
          
        }
        
      },
      {
        "updateTableCellStyle": {
          "fields": "backgroundColor",
          "tableCellStyle": {
        "contentAlignment": "MIDDLE",
            "backgroundColor": {
              "color": {
                "rgbColor": {
                  "blue": 0.8509804,
                  "green": 0.8509804,
                  "red": 0.8509804
                }
              }
            }
            
          },
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 3,
              "rowIndex": 0,
              "tableStartLocation": {
                "index": 2
                
              }
            },
            "columnSpan": 1,
            "rowSpan": 1
          }
          
        }
        
      },
      {
        "updateTableCellStyle": {
          "fields": "backgroundColor",
          "tableCellStyle": {
        "contentAlignment": "MIDDLE",
            "backgroundColor": {
              "color": {
                "rgbColor": {
                  "blue": 0.8509804,
                  "green": 0.8509804,
                  "red": 0.8509804
                }
              }
            }
            
          },
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 0,
              "rowIndex": 1,
              "tableStartLocation": {
                "index": 2
                
              }
            },
            "columnSpan": 1,
            "rowSpan": 1
          }
          
        }
        
      },
      {
        "updateTableCellStyle": {
          "fields": "backgroundColor",
          "tableCellStyle": {
        "contentAlignment": "MIDDLE",
            "backgroundColor": {
              "color": {
                "rgbColor": {
                  "blue": 0.8509804,
                  "green": 0.8509804,
                  "red": 0.8509804
                }
              }
            }
            
          },
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 2,
              "rowIndex": 1,
              "tableStartLocation": {
                "index": 2
                
              }
            },
            "columnSpan": 1,
            "rowSpan": 1
          }
          
        }
        
      },
      {
        "updateTableCellStyle": {
          "fields": "backgroundColor",
          "tableCellStyle": {
        "contentAlignment": "MIDDLE",
            "backgroundColor": {
              "color": {
                "rgbColor": {
                  "blue": 0.8509804,
                  "green": 0.8509804,
                  "red": 0.8509804
                }
              }
            }
            
          },
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 0,
              "rowIndex": 2,
              "tableStartLocation": {
                "index": 2
                
              }
            },
            "columnSpan": 5,
            "rowSpan": 1
          }
          
        }
        
      },
      {
        "updateTableCellStyle": {
          "fields": "backgroundColor",
          "tableCellStyle": {
        "contentAlignment": "MIDDLE",
            "backgroundColor": {
              "color": {
                "rgbColor": {
                  "blue": 0.8509804,
                  "green": 0.8509804,
                  "red": 0.8509804
                }
              }
            }
            
          },
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 0,
              "rowIndex": 4,
              "tableStartLocation": {
                "index": 2
                
              }
            },
            "columnSpan": 5,
            "rowSpan": 1
          }
          
        }
        
      }
    ]
    let request2:any;
    request2=[
      {
        "updateTableCellStyle": {
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 0,
              "rowIndex": 0,
              "tableStartLocation": {
                "index": 2
              }
            },
            "columnSpan": 5,
            "rowSpan": 1
          },
          "fields": "*",
          "tableCellStyle": {
            "contentAlignment": "MIDDLE"
          }
        }
      },
      {
        "updateTableCellStyle": {
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 0,
              "rowIndex": 1,
              "tableStartLocation": {
                "index": 2
              }
            },
            "columnSpan": 5,
            "rowSpan": 1
          },
          "fields": "*",
          "tableCellStyle": {
            "contentAlignment": "MIDDLE"
          }
        }
      },
      {
        "updateTableCellStyle": {
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 0,
              "rowIndex": 2,
              "tableStartLocation": {
                "index": 2
              }
            },
            "columnSpan": 5,
            "rowSpan": 1
          },
          "fields": "*",
          "tableCellStyle": {
            "contentAlignment": "MIDDLE"
          }
        }
      },
      {
        "updateTableCellStyle": {
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 0,
              "rowIndex": 4,
              "tableStartLocation": {
                "index": 2
              }
            },
            "columnSpan": 5,
            "rowSpan": 1
          },
          "fields": "*",
          "tableCellStyle": {
            "contentAlignment": "MIDDLE"
          }
        }
      }
    ]
    await gapi.client.docs.documents.batchUpdate({
      "documentId": this.IdClase, 
      "resource": {
        "requests": request2
      }
    })  
    await gapi.client.docs.documents.get({
      "documentId": this.IdClase
    })
      .then(async (response:any)=>{
        var body:any;
        body=response.result.body;
        console.log(body)
        let request3:any;
        request3=[
          {
            "updateParagraphStyle": {
              "fields": "alignment",
              "paragraphStyle": {
                "alignment": "CENTER"
                
              },
              "range": {
                "startIndex": body.content[2].table.tableRows[0].tableCells[0].content[0].startIndex,
                "endIndex": body.content[2].table.tableRows[2].tableCells[0].content[0].endIndex
                
              }
            }
            
          },
          {
            "updateParagraphStyle": {
              "fields": "alignment",
              "paragraphStyle": {
                "alignment": "CENTER"
                
              },
              "range": {
                "startIndex": body.content[2].table.tableRows[4].tableCells[0].content[0].startIndex,
                "endIndex": body.content[2].table.tableRows[4].tableCells[0].content[0].endIndex
                
              }
            }
            
          }
        ]

        let request4:any;
        request4=[
          {
            "updateTextStyle": {
              "fields": "*",
              "textStyle": {
                "weightedFontFamily": {
                  "fontFamily": "Calibri"
                }
              },
              "range": {
                "startIndex": body.content[2].startIndex,
                "endIndex": body.content[3].endIndex
              }
            }
          },
          {
            "updateTextStyle": {
              "fields": "bold",
              "textStyle": {
                "bold": true
                
              },
              "range": {
                "startIndex": body.content[2].table.tableRows[0].tableCells[0].content[0].startIndex,
                "endIndex": body.content[2].table.tableRows[0].tableCells[0].content[0].endIndex 
                
              }
            }
            
          },
          {
            "updateTextStyle": {
              "fields": "bold",
              "textStyle": {
                "bold": true
                
              },
              "range": {
                "startIndex": body.content[2].table.tableRows[0].tableCells[3].content[0].startIndex,
                "endIndex": body.content[2].table.tableRows[0].tableCells[3].content[0].endIndex
                
              }
            }
            
          },
          {
            "updateTextStyle": {
              "fields": "bold",
              "textStyle": {
                "bold": true
                
              },
              "range": {
                "startIndex": body.content[2].table.tableRows[1].tableCells[0].content[0].startIndex,
                "endIndex": body.content[2].table.tableRows[1].tableCells[0].content[0].endIndex 
                
              }
            }
            
          },
          {
            "updateTextStyle": {
              "fields": "bold",
              "textStyle": {
                "bold": true
                
              },
              "range": {
                "startIndex": body.content[2].table.tableRows[1].tableCells[2].content[0].startIndex,
                "endIndex": body.content[2].table.tableRows[1].tableCells[2].content[0].endIndex
                
              }
            }
            
          },
          {
            "updateTextStyle": {
              "fields": "bold",
              "textStyle": {
                "bold": true
                
              },
              "range": {
                "startIndex": body.content[2].table.tableRows[2].tableCells[0].content[0].startIndex,
                "endIndex": body.content[2].table.tableRows[2].tableCells[0].content[0].endIndex
                
              }
            }
            
          },
          {
            "updateTextStyle": {
              "fields": "bold",
              "textStyle": {
                "bold": true
                
              },
              "range": {
                "startIndex": body.content[2].table.tableRows[4].tableCells[0].content[0].startIndex,
                "endIndex": body.content[2].table.tableRows[4].tableCells[0].content[0].endIndex
                
              }
            }
            
          }
        ]
        await gapi.client.docs.documents.batchUpdate({
          "documentId": this.IdClase, 
          "resource": {
          "requests": request3
          }
        })
        await gapi.client.docs.documents.batchUpdate({
          "documentId": this.IdClase, 
          "resource": {
          "requests": request4
          }
        })    

      })
    await gapi.client.docs.documents.batchUpdate({
      "documentId": this.IdClase, 
      "resource": {
        "requests": request
      }
    })
    
  }

}
