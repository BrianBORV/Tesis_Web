import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';

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
  nombreFacultad:any=null;
  nombreProyecto:any=null;
  nombreMateria:any=null;
  nombreBitacora:any=null;
  IdBitacora:any=null;
  element:any=null;
  bodys: any[] =[];
  archivoActual:any;
  body:any;
  map:any;

  constructor(private formBuilder: FormBuilder, private router:Router, private zone: NgZone) {
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

  async completarBitacora(){
    let inicio = this.form.get("inicio")?.value;
    let fin = this.form.get("fin")?.value;
    let nombre = this.form.get("nombre")?.value;
    let periodo= this.form.get("periodo")?.value;
    let request:  any[] = [];

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
          "location": {
            "index": 65
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
                "index": 66
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
                "index": 66
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
                "index": 66
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
            "index": 69
          },
          "text": "PERIODO COMPRENDIDO ENTRE"
        }
      },
      {
        "insertText": {
          "location": {
            "index": 105
          },
          "text": "{{INICIO}} Y {{FIN}}"
        }
      },
      {
        "insertText": {
          "location": {
            "index": 136
          },
          "text": "Profesor:"
        }
      },
      {
        "insertText": {
          "location": {
            "index": 147
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

    await gapi.client.docs.documents.batchUpdate({
      "documentId": this.IdBitacora, 
      "resource": {
        "requests": request
      }
    })
    await gapi.client.docs.documents.batchUpdate({
      "documentId": this.IdBitacora, 
      "resource": {
        "requests": request2
      }
    })
    await gapi.client.docs.documents.get({
      "documentId": this.IdBitacora
    }).then(async (response:any)=>{
      var body=response.result.body;
      console.log(body)
      let request3:any[]=[];
      request3=[
        {
          "updateTextStyle": {
            "fields": "*",
            "textStyle": {
              "fontSize": {
                "unit": "PT",
                "magnitude": 12
              }
              
            },
            "range": {
              "startIndex": body.content[1].startIndex,
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
              "startIndex": 1,
              "endIndex": body.content[3].table.tableRows[0].endIndex
              
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
              "startIndex": 1,
              "endIndex": body.content[3].table.tableRows[1].endIndex
              
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
              "startIndex": body.content[3].table.tableRows[2].tableCells[0].startIndex,
              "endIndex": body.content[3].table.tableRows[2].tableCells[0].endIndex
              
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
              "startIndex": body.content[3].table.tableRows[2].tableCells[0].startIndex,
              "endIndex": body.content[3].table.tableRows[2].tableCells[0].endIndex
              
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
                "rowIndex": 0,
                "tableStartLocation": {
                  "index":  body.content[3].startIndex
                  
                }
              },
              "columnSpan": 5 ,
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
                  "index":  body.content[3].startIndex
                  
                }
              },
              "columnSpan": 5 ,
              "rowSpan": 1
            }
            
          }
          
        }
        
      ]
      await gapi.client.docs.documents.batchUpdate({
        "documentId": this.IdBitacora, 
        "resource": {
          "requests": request3
        }
      })
    })
    
    
  }

  generarBitacora(){
    this.nombreFacultad = this.files.find(x=>x.id == this.IdFacultad).name;
    this.nombreProyecto = this.filesP.find(x=>x.id == this.IdProyecto).name;
    this.nombreMateria= this.filesM.find(x=>x.id == this.IdMateria).name;
    let periodo= this.form.get("periodo")?.value;
    this.nombreBitacora='Informe '+this.nombreMateria+" "+periodo;
    console.log("Generando bitacora")
    gapi.client.drive.files.list({
      "q": "name='"+this.nombreBitacora+"' and '"+this.IdMateria+"' in parents"
    })
      .then((response:any) => {
      // Handle the results here (response.result has the parsed body).
      if (response.result.files.length == 0){
        gapi.client.drive.files.list({
          "q": "'"+this.IdMateria+"' in parents and not name contains 'Informe' and mimeType = 'application/vnd.google-apps.document'"
        })
          .then((response:any) => {
            var filesId = response.result.files.sort((a: { id: number; }, b: { id: number; }) => {
              if(a.id > b.id) {
                return -1;
              } else if(a.id < b.id) {
                return 1;
              } else {
                return 0;
              }
            })
            this.fileMetadata = {
              'name': this.nombreBitacora,
              'mimeType': 'application/vnd.google-apps.document',
              'parents': [this.IdMateria]
            };
            gapi.client.drive.files.create({
              resource: this.fileMetadata,
              fields: 'id'
            })
              .then(async (response:any)=>{
                this.IdBitacora=response.result.id;
                console.log(filesId);
                var i=0;
                this.bodys=[];
                var request = [
                  {
                    "insertTable": {
                      "rows": 6,
                      "columns": 5,
                      "location": {
                        "index": 1
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
                  },
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
                      "text": "HERRAMIENTA:"
                    }
                  },
                  {
                    "insertText": {
                      "location": {
                        "index": 197
                      },
                      "text": "{{ANEXOS}}"
                    }
                  }
                ]
                console.log(filesId.length)
                do {
                  this.element = filesId[i];
                  await gapi.client.docs.documents.batchUpdate({
                    "documentId": this.IdBitacora, 
                    "resource": {
                      "requests": request
                    }
                  })
                  this.archivoActual= this.element.id;
                  var body:any=null;
                  console.log(this.archivoActual);
                  await gapi.client.docs.documents.get({
                    "documentId": this.archivoActual
                  }).then((response:any) => {
                    console.log(response.result.body);
                    body=response.result.body;
                  })
                  var request2:any=[];
                  request2=[
                    {
                      "replaceAllText": {
                        "replaceText": body.content[2].table.tableRows[0].tableCells[1].content[0].paragraph.elements[0].textRun.content,
                        "containsText": {
                          "text": "{{MATERIA}}"
                        }
                      }
                    },
                    {
                      "replaceAllText": {
                        "replaceText": body.content[2].table.tableRows[0].tableCells[4].content[0].paragraph.elements[0].textRun.content,
                        "containsText": {
                          "text": "{{Grupo}}"
                        }
                      }
                    },
                    {
                      "replaceAllText": {
                        "replaceText": body.content[2].table.tableRows[1].tableCells[1].content[0].paragraph.elements[0].textRun.content,
                        "containsText": {
                          "text": "{{FECHA}}"
                        }
                      }
                    },
                    {
                      "replaceAllText": {
                        "replaceText": body.content[2].table.tableRows[1].tableCells[3].content[0].paragraph.elements[0].textRun.content,
                        "containsText": {
                          "text": "{{HORARIO}}"
                        }
                      }
                    },
                    {
                      "replaceAllText": {
                        "replaceText": body.content[2].table.tableRows[3].tableCells[0].content[0].paragraph.elements[0].textRun.content,
                        "containsText": {
                          "text": "{{TEXTO}}"
                        }
                      }
                    },
                    {
                      "replaceAllText": {
                        "replaceText": body.content[2].table.tableRows[5].tableCells[0].content[0].paragraph.elements[0].textRun.content,
                        "containsText": {
                          "text": "{{ANEXOS}}"
                        }
                      }
                    }
                    ]
                  console.log(request2)
                  console.log(i)
                  await gapi.client.docs.documents.batchUpdate({
                  "documentId": this.IdBitacora, 
                  "resource": {
                    "requests": request2
                  }
                  })
                  await gapi.client.docs.documents.get({
                    "documentId": this.IdBitacora
                  })
                    .then(async (response:any)=>{
                      console.log("dando estilo")
                      this.body=response.result.body;
                      var request:any;
                      let request2:any;
                      request2=[
                        {
                          "updateTableCellStyle": {
                            "tableRange": {
                              "tableCellLocation": {
                                "columnIndex": 0,
                                "rowIndex": 0,
                                "tableStartLocation": {
                                  "index": this.body.content[2].startIndex
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
                                  "index": this.body.content[2].startIndex
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
                                  "index": this.body.content[2].startIndex
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
                                  "index": this.body.content[2].startIndex
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
                        "documentId": this.IdBitacora, 
                        "resource": {
                          "requests": request2
                        }
                      })  
                      
                          console.log(this.body)
                          let request3:any;
                          request3=[
                            {
                              "updateParagraphStyle": {
                                "fields": "alignment",
                                "paragraphStyle": {
                                  "alignment": "CENTER"
                                  
                                },
                                "range": {
                                  "startIndex": this.body.content[2].table.tableRows[0].tableCells[0].content[0].startIndex,
                                  "endIndex": this.body.content[2].table.tableRows[2].tableCells[0].content[0].endIndex
                                  
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
                                  "startIndex": this.body.content[2].table.tableRows[4].tableCells[0].content[0].startIndex,
                                  "endIndex": this.body.content[2].table.tableRows[4].tableCells[0].content[0].endIndex
                                  
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
                                  "startIndex": this.body.content[2].startIndex,
                                  "endIndex": this.body.content[2].endIndex
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
                                  "startIndex": this.body.content[2].table.tableRows[0].tableCells[0].content[0].startIndex,
                                  "endIndex": this.body.content[2].table.tableRows[0].tableCells[0].content[0].endIndex 
                                  
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
                                  "startIndex": this.body.content[2].table.tableRows[0].tableCells[3].content[0].startIndex,
                                  "endIndex": this.body.content[2].table.tableRows[0].tableCells[3].content[0].endIndex
                                  
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
                                  "startIndex": this.body.content[2].table.tableRows[1].tableCells[0].content[0].startIndex,
                                  "endIndex": this.body.content[2].table.tableRows[1].tableCells[0].content[0].endIndex 
                                  
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
                                  "startIndex": this.body.content[2].table.tableRows[1].tableCells[2].content[0].startIndex,
                                  "endIndex": this.body.content[2].table.tableRows[1].tableCells[2].content[0].endIndex
                                  
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
                                  "startIndex": this.body.content[2].table.tableRows[2].tableCells[0].content[0].startIndex,
                                  "endIndex": this.body.content[2].table.tableRows[2].tableCells[0].content[0].endIndex
                                  
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
                                  "startIndex": this.body.content[2].table.tableRows[4].tableCells[0].content[0].startIndex,
                                  "endIndex": this.body.content[2].table.tableRows[4].tableCells[0].content[0].endIndex
                                  
                                }
                              }
                              
                            },
                            
                          ]
                          await gapi.client.docs.documents.batchUpdate({
                            "documentId": this.IdBitacora, 
                            "resource": {
                            "requests": request3
                            }
                          })
                          await gapi.client.docs.documents.batchUpdate({
                            "documentId": this.IdBitacora, 
                            "resource": {
                            "requests": request4
                            }
                          })
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
                                  "index": this.body.content[2].startIndex
                                  
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
                                  "index": this.body.content[2].startIndex
                                  
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
                                  "index": this.body.content[2].startIndex
                                  
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
                                  "index": this.body.content[2].startIndex
                                  
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
                                  "index": this.body.content[2].startIndex
                                  
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
                                  "index": this.body.content[2].startIndex
                                  
                                }
                              },
                              "columnSpan": 5,
                              "rowSpan": 1
                            }
                            
                          }
                          
                        }
                      ]    
                      await gapi.client.docs.documents.batchUpdate({
                        "documentId": this.IdBitacora, 
                        "resource": {
                          "requests": request
                        }
                      })
                    })
                    i++;                
                  }while (i<filesId.length);
                console.log("actualizado")
                console.log("Bitacora generada exitosamente")
              }).then ((response:any)=>{
                this.completarBitacora();
                this.encabezadoBitacora();
                this.guardarArchivos();
                this.zone.run(() => {
                  this.router.navigate(['/menu']);
              });
              })
                
          })
      }
      })

  }

  async encabezadoBitacora(){
    let request:any=[];
    let request2:any=[];
    let header:any;
    request = [{
      "createHeader": {
        "type": "DEFAULT",
        "sectionBreakLocation": {
          "index": 0
        }
      }
    }]
    await gapi.client.docs.documents.batchUpdate({
      "documentId": this.IdBitacora, 
      "resource": {
      "requests": request
      }
    }).then(async (response:any)=>{
      header=response.result.replies[0].createHeader.headerId;
      console.log(header);
      request2 = [{
        "insertTable": {
          "location": {
            "segmentId": header,
            "index": 0
          },
          "columns": 2,
          "rows": 1
        }
      },
      {
        "updateTableColumnProperties": {
          "tableColumnProperties": {
            "width": {
              "unit": "PT",
              "magnitude": 90
            },
            "widthType": "FIXED_WIDTH"
          },
          "tableStartLocation": {
            "segmentId": header,
            "index": 1
          },
          "columnIndices": [
            0
          ],
          "fields": "*"
        }
      },
      {
        "updateTableCellStyle": {
          "tableStartLocation": {
            "segmentId": header,
            "index": 1
          },
          "fields": "*",
          "tableCellStyle": {
            "borderBottom": {
              "dashStyle": "SOLID",
              "width": {
                "unit": "PT",
                "magnitude": 0
              },
              "color": {
                "color": {
                  "rgbColor": {
                    "blue": 1,
                    "green": 1,
                    "red": 1
                  }
                }
              }
            },
            "borderLeft": {
              "width": {
                "unit": "PT",
                "magnitude": 0
              },
              "dashStyle": "SOLID",
              "color": {
                "color": {
                  "rgbColor": {
                    "blue": 1,
                    "green": 1,
                    "red": 1
                  }
                }
              }
            },
            "borderRight": {
              "width": {
                "unit": "PT",
                "magnitude": 0
              },
              "dashStyle": "SOLID",
              "color": {
                "color": {
                  "rgbColor": {
                    "blue": 1,
                    "green": 1,
                    "red": 1
                  }
                }
              }
            },
            "borderTop": {
              "width": {
                "unit": "PT",
                "magnitude": 0
              },
              "dashStyle": "SOLID",
              "color": {
                "color": {
                  "rgbColor": {
                    "blue": 1,
                    "green": 1,
                    "red": 1
                  }
                }
              }
            }
          }
        }
      },
      {
        "insertInlineImage": {
          "uri": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Escudo_UD.png/800px-Escudo_UD.png",
          "location": {
            "segmentId": header,
            "index": 4
          },
          "objectSize": {
            "height": {
              "unit": "PT",
              "magnitude": 72
            },
            "width": {
              "magnitude": 72,
              "unit": "PT"
            }
          }
        }
      },
      {
        "insertText": {
          "location": {
            "segmentId": header,
            "index": 7
          },
          "text": " UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS\n\n"+this.nombreFacultad+"\nProyecto Curricular en "+this.nombreProyecto+""
        }
      },
      ]
      
      await gapi.client.docs.documents.batchUpdate({
        "documentId": this.IdBitacora, 
        "resource": {
        "requests": request2
        }
      })
      await gapi.client.docs.documents.get({
        "documentId": this.IdBitacora
      }).then((response:any)=>{
        this.map=response.result.headers[header];
        console.log(this.map)
      })
      console.log("Header añadido")
    })
    var request3=[
      {
        "updateTextStyle": {
          "fields": "*",
          "textStyle": {
            "weightedFontFamily": {
              "fontFamily": "EB Garamond",
              "weight": 600
            },
            "fontSize": {
              "magnitude": 13,
              "unit": "PT"
            }
          },
          "range": {
            "segmentId": header,
            "startIndex": 0,
            "endIndex": this.map.content[1].endIndex
          }
        }
      }
    ]
    await gapi.client.docs.documents.batchUpdate({
      "documentId": this.IdBitacora, 
      "resource": {
      "requests": request3
      }
    })

  }

  async descargarBitacora(){
    let fileName = this.nombreBitacora;
    try {
      await gapi.client.drive.files.export({
        fileId: this.IdBitacora,
        mimeType: 'application/vnd.oasis.opendocument.text',
      })
          .then((response:any) => {
            console.log(response);
            var datatype="application/vnd.oasis.opendocument.text;data:text/plain;charset=ANSI";
            var binaryData=[];
            binaryData.push(response.body);

            var filePath = window.URL.createObjectURL(new Blob(binaryData, {type:datatype}));
            var downloadLink = document.createElement('a');
            downloadLink.href = filePath;
            console.log(downloadLink);
            downloadLink.setAttribute('download',fileName);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            }, (err:any) => { console.error("Execute error", err); })
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  async guardarArchivos(){
    let periodo= this.form.get("periodo")?.value;
    var folderId:any;
    var fileMetadata = {
      'name': periodo,
      'mimeType': 'application/vnd.google-apps.folder',
      'parents': [this.IdMateria]
    };
    await gapi.client.drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    }).then((response:any)=>{
      folderId=response.result.id;
      console.log(folderId);
    })
    await gapi.client.drive.files.list({
      "q": "'"+this.IdMateria+"' in parents and not name contains 'Informe' and mimeType = 'application/vnd.google-apps.document'"
    })
      .then(async (response:any) => {
        var filesId = response.result.files.sort((a: { id: number; }, b: { id: number; }) => {
          if(a.id > b.id) {
            return -1;
          } else if(a.id < b.id) {
            return 1;
          } else {
            return 0;
          }
        })
        var index=0;
        do{
          var fileId = filesId[index];
          console.log(fileId);
            // Retrieve the existing parents to remove
            var file = await gapi.client.drive.files.get({
              fileId: fileId.id,
              fields: 'parents',
            });
            console.log(file);
            // Move the file to the new folder
            var previousParents = file.result.parents.map(function(parent:any) {
              return parent.id;
            }).join(',');
            const files = await gapi.client.drive.files.update({
              fileId: fileId.id,
              addParents: folderId,
              removeParents: previousParents,
              fields: 'id, parents',
            });
            console.log(files.status);
            index++;          
        }while(index<filesId.length)
      })
  }
  
  /* async estiloBitacora(){
    var request:any;
    let request2:any;
    request2=[
      {
        "updateTableCellStyle": {
          "tableRange": {
            "tableCellLocation": {
              "columnIndex": 0,
              "rowIndex": 0,
              "tableStartLocation": {
                "index": this.body.content[2].table.tableRows[0].startIndex
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
                "index": this.body.content[2].table.tableRows[0].startIndex
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
                "index": this.body.content[2].table.tableRows[0].startIndex
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
                "index": this.body.content[2].table.tableRows[0].startIndex
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
      "documentId": this.IdBitacora, 
      "resource": {
        "requests": request2
      }
    })  
    
        console.log(this.body)
        let request3:any;
        request3=[
          {
            "updateParagraphStyle": {
              "fields": "alignment",
              "paragraphStyle": {
                "alignment": "CENTER"
                
              },
              "range": {
                "startIndex": this.body.content[2].table.tableRows[0].tableCells[0].content[0].startIndex,
                "endIndex": this.body.content[2].table.tableRows[2].tableCells[0].content[0].endIndex
                
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
                "startIndex": this.body.content[2].table.tableRows[4].tableCells[0].content[0].startIndex,
                "endIndex": this.body.content[2].table.tableRows[4].tableCells[0].content[0].endIndex
                
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
                "startIndex": this.body.content[2].startIndex,
                "endIndex": this.body.content[2].endIndex
              }
            }
          },
          {
            "updateTextStyle": {
              "fields": "*",
              "textStyle": {
                "bold": true
                
              },
              "range": {
                "startIndex": this.body.content[2].table.tableRows[0].tableCells[0].content[0].startIndex,
                "endIndex": this.body.content[2].table.tableRows[0].tableCells[0].content[0].endIndex 
                
              }
            }
            
          },
          {
            "updateTextStyle": {
              "fields": "*",
              "textStyle": {
                "bold": true
                
              },
              "range": {
                "startIndex": this.body.content[2].table.tableRows[0].tableCells[3].content[0].startIndex,
                "endIndex": this.body.content[2].table.tableRows[0].tableCells[3].content[0].endIndex
                
              }
            }
            
          },
          {
            "updateTextStyle": {
              "fields": "*",
              "textStyle": {
                "bold": true
                
              },
              "range": {
                "startIndex": this.body.content[2].table.tableRows[1].tableCells[0].content[0].startIndex,
                "endIndex": this.body.content[2].table.tableRows[1].tableCells[0].content[0].endIndex 
                
              }
            }
            
          },
          {
            "updateTextStyle": {
              "fields": "*",
              "textStyle": {
                "bold": true
                
              },
              "range": {
                "startIndex": this.body.content[2].table.tableRows[1].tableCells[2].content[0].startIndex,
                "endIndex": this.body.content[2].table.tableRows[1].tableCells[2].content[0].endIndex
                
              }
            }
            
          },
          {
            "updateTextStyle": {
              "fields": "*",
              "textStyle": {
                "bold": true
                
              },
              "range": {
                "startIndex": this.body.content[2].table.tableRows[2].tableCells[0].content[0].startIndex,
                "endIndex": this.body.content[2].table.tableRows[2].tableCells[0].content[0].endIndex
                
              }
            }
            
          },
          {
            "updateTextStyle": {
              "fields": "*",
              "textStyle": {
                "bold": true
                
              },
              "range": {
                "startIndex": this.body.content[2].table.tableRows[4].tableCells[0].content[0].startIndex,
                "endIndex": this.body.content[2].table.tableRows[4].tableCells[0].content[0].endIndex
                
              }
            }
            
          }
        ]
        await gapi.client.docs.documents.batchUpdate({
          "documentId": this.IdBitacora, 
          "resource": {
          "requests": request3
          }
        })
        await gapi.client.docs.documents.batchUpdate({
          "documentId": this.IdBitacora, 
          "resource": {
          "requests": request4
          }
        })
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
                "index": this.body.content[2].table.tableRows[0].startIndex
                
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
                "index": this.body.content[2].table.tableRows[0].startIndex
                
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
                "index": this.body.content[2].table.tableRows[0].startIndex
                
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
                "index": this.body.content[2].table.tableRows[0].startIndex
                
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
                "index": this.body.content[2].table.tableRows[0].startIndex
                
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
                "index": this.body.content[2].table.tableRows[0].startIndex
                
              }
            },
            "columnSpan": 5,
            "rowSpan": 1
          }
          
        }
        
      }
    ]    
    await gapi.client.docs.documents.batchUpdate({
      "documentId": this.IdBitacora, 
      "resource": {
        "requests": request
      }
    })
    
  } */
}
