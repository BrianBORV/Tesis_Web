import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var gapi: any;


@Component({
  selector: 'app-clase',
  templateUrl: './clase.component.html',
  styleUrls: ['./clase.component.scss']
})
export class ClaseComponent implements OnInit {
  fileMetadata: any;
  form: any;
  files: any[] = [];
  filesP: any[] = [];
  filesM: any[] = [];
  filesA: any[] = [];
  isFiles: boolean = false;
  isFilesP: boolean = false;
  IdFacultad: any = null;
  IdProyecto: any = null;
  IdMateria: any = null;
  IdClase: any = null;
  anexos: any = null;
  listaRec: string[] = [];
  alertaFormulario:string = "Por favor diligencie este campo";
  isLogin: boolean;
  vistaPrevia:any;

  constructor(private formBuilder: FormBuilder, private router: Router, private zone: NgZone) {
    this.form = this.formBuilder.group({
      materia: '',
      clase: '',
      inicio: '',
      fin: '',
      texto: '',
      anexos: '',
      nombreAnexo: ''
    });
    this.isLogin = Boolean(localStorage.getItem("isLogin"));
  }

  ngOnInit(): void {
    if (this.isLogin ==true) {
      if(localStorage.getItem("InfoC")!="1"){
        var info: any = document.getElementById("modal");
      info.click();
      localStorage.setItem("InfoC", "1");
      }
    var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;
    form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
    this.buscarFacultad();
    }else{
      this.zone.run(() => {
        this.router.navigate(['/index']);
      });
    }
    
  }

  onSelect(val: any) {
    this.IdFacultad = val;
    this.buscarProyecto();
  }

  onSelectP(valP: any) {
    this.IdProyecto = valP;
    this.buscarMateria();
  }

  onSelectM(valM: any) {
    this.IdMateria = valM;

  }

  onSelectA(valA: any) {
    this.anexos = valA;
  }


  async buscarFacultad() {
    try {
      await gapi.client.drive.files.list({
        "q": "mimeType='application/vnd.google-apps.folder' and '" + localStorage.getItem("IdBitacora") + "' in parents and name contains 'Facultad'"
      }).then((res: any) => {
        Array.prototype.push.apply(this.files, res.result.files);

        this.isFiles = true;
      });

    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  actualizarVista(){
    let clase:any = {
      nombre: "",
      inicio: "",
      fin: "",
      texto: "",
      anexos:""
    };
    clase.nombre = this.form.get("clase")?.value;
    clase.inicio = this.form.get("inicio")?.value;
    clase.fin = this.form.get("fin")?.value;
    clase.texto = this.form.get("texto")?.value;
    clase.anexos = this.form.get("anexos")?.value.toString();
    if (clase.nombre == null || clase.nombre == "" || this.IdFacultad==null || this.IdProyecto==null || this.IdMateria==null|| clase.inicio == null || clase.fin== null || clase.texto==null || clase.texto=="") {
      Swal.fire({
        title: 'Error',
        text: 'Verifique la información ingresada',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
    } else {
      gapi.client.drive.files.list({
        "q": "name='" + clase.nombre + "' and '" + this.IdMateria + "' in parents"
      })
        .then((response: any) => {
          // Handle the results here (response.result has the parsed body).
          if (response.result.files.length == 0) {
            this.registrarClase(clase);
          } else {
            Swal.fire({
              title: 'Confirmación',
              text: 'El registro de clase del día '+clase.nombre+' ya existe. ¿Desea sobreescribirlo?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Aceptar',
              cancelButtonText: 'Cancelar'
            }).then(async (res) => {
              if (res.value) {
                this.IdClase = response.result.files[0].id;
                gapi.client.drive.files.delete({
                  "fileId": this.IdClase
                }).then(() => {
                  this.registrarClase(clase);
                })
                Swal.fire({
                  title: 'Registro Creado',
                  text: 'El registro de clase se ha creado correctamente.',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                })
              }
            })
          }
      }, (err: any) => { console.error("Execute error", err); })

    }
  }

  registrarClase(clase:any) {
    Swal.fire({
      icon:'info',
      title: 'Por favor espere',
      html: `Registrando Clase`,
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
          Swal.showLoading()
        },
    });
    let requestTabla: any[] = [];
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
    let nombreMateria: any;
    let grupo: any;
    nombreMateria = this.filesM.find(x => x.id == this.IdMateria).name.substring(0, this.filesM.find(x => x.id == this.IdMateria).name.indexOf('-'));
    grupo = this.filesM.find(x => x.id == this.IdMateria).name.substring(this.filesM.find(x => x.id == this.IdMateria).name.indexOf('-') + 1);
    let request2: any;
    request2 = [
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
          "replaceText": clase.nombre,
          "containsText": {
            "text": "{{FECHA}}"
          }
        }
      },
      {
        "replaceAllText": {
          "replaceText": clase.inicio + " a " + clase.fin,
          "containsText": {
            "text": "{{HORARIO}}"
          }
        }
      },
      {
        "replaceAllText": {
          "replaceText": clase.texto,
          "containsText": {
            "text": "{{TEXTO}}"
          }
        }
      },
      {
        "replaceAllText": {
          "replaceText": clase.anexos,
          "containsText": {
            "text": "{{ANEXOS}}"
          }
        }
      }
    ]
    this.fileMetadata = {
      'name': clase.nombre,
      'mimeType': 'application/vnd.google-apps.document',
      'parents': [this.IdMateria]
    };
    gapi.client.drive.files.create({
      resource: this.fileMetadata,
      fields: 'id'
    }).then(async (response: any) => {
      this.IdClase = response.result.id;
      await gapi.client.docs.documents.batchUpdate({
        "documentId": response.result.id,
        "resource": {
          "requests": requestTabla
        }
      })
      await gapi.client.docs.documents.get({
        "documentId": this.IdClase
      })
        .then(async (response4: any) => {
          var body = response4.result.body;
          requestTextoT = [
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
                "text": "ANEXOS"
              }
            },
            {
              "insertText": {
                "location": {
                  "index": 191
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
          }).then((response4: any) => { console.log("base añadida") })
        })
      await gapi.client.docs.documents.batchUpdate({
        "documentId": this.IdClase,
        "resource": {
          "requests": request2
        }
      })
      await this.estiloClase();
      this.vistaPrev();
      Swal.fire({
        title: 'Registro Creado',
        text: 'El registro de la clase se ha realizado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
    });
  }

  async buscarProyecto() {
    try {
      this.filesP = [];
      await gapi.client.drive.files.list({
        "q": "mimeType='application/vnd.google-apps.folder' and '" + this.IdFacultad + "' in parents"
      }).then((res2: any) => {
        console.log("Buscando proyecto");
        Array.prototype.push.apply(this.filesP, res2.result.files);
        this.isFilesP = true;
      });

    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  async buscarMateria() {
    try {
      this.filesM = [];
      await gapi.client.drive.files.list({
        "q": "mimeType='application/vnd.google-apps.folder' and '" + this.IdProyecto + "' in parents"
      }).then((res2: any) => {
        console.log("Buscando materia");
        Array.prototype.push.apply(this.filesM, res2.result.files);
        this.isFilesP = true;
      });

    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  async estiloClase() {
    let request: any;
    request = [
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
    let request2: any;
    request2 = [
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
      .then(async (response: any) => {
        var body: any;
        body = response.result.body;
        let request3: any;
        request3 = [
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

        let request4: any;
        request4 = [
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

  async buscarAnexos() {
    this.filesA = [];
    try {
      await gapi.client.drive.files.list({
        "q": "name='Recursos Bitácoras'"
      }).then(async (response: any) => {
        console.log(response)
        await gapi.client.drive.files.list({
          "q": "'" + response.result.files[0].id + "' in parents"
        }).then(async (res: any) => {
          Array.prototype.push.apply(this.filesA, res.result.files);
        });


      })

    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  agregarAnexo() {
    let nombreAnexo = this.form.get("nombreAnexo")?.value;
    let value = "-" + nombreAnexo + ": https://drive.google.com/file/d/" + this.anexos + "/view?usp=drivesdk\n";
    this.listaRec.push(value);
    console.log(this.listaRec)
    this.form.controls['anexos'].setValue(this.listaRec.toString().replace(/,/g, ''));
    this.form.controls['nombreAnexo'].setValue();
    console.log(this.form.get("anexos")?.value);
  }

  limpiarAnexos() {
    this.listaRec = [];
    this.form.controls['anexos'].setValue();
  }

  navMenu(){
    this.zone.run(() => {
      this.router.navigate(['/menu']);
    });
  }

  navFacultad(){
    this.zone.run(() => {
      this.router.navigate(['/registrar_facultad']);
    });
  }

  navProyecto(){
    this.zone.run(() => {
      this.router.navigate(['/registrar_proyecto']);
    });
  }

  navMateria(){
    this.zone.run(() => {
      this.router.navigate(['/registrar_materia']);
    });
  }

  navClase(){
    this.zone.run(() => {
      this.router.navigate(['/registrar_clase']);
    });
  }
  
  navBitacora(){
    this.zone.run(() => {
      this.router.navigate(['/generar_bitacora']);
    });
  }

  vistaPrev(){
    this.vistaPrevia="https://drive.google.com/file/d/"+this.IdClase+"/preview";
    document.getElementById('vistaP')?.setAttribute("src", this.vistaPrevia);
    document.getElementById('botones')?.setAttribute("style","text-align: center; visibility: visible;" );
  }

  guardarYSalir(){
      Swal.fire({
        title: 'Guardado',
        text: 'El registro de la clase se ha guardado exitosamente',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      }).then(()=>{
        this.zone.run(() => {
          this.router.navigate(['/menu']);
        });
      })
  }

  salirSinGuardar(){
    Swal.fire({
      title: 'Saliendo...',
      text: '¿Está seguro que desea salir sin guardar los cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText:'Cancelar'
    }).then((res) => { 
      if (res.value) {
        gapi.client.drive.files.delete({
          "fileId": this.IdClase
        }).then(() => { 
          this.zone.run(() => {
            this.router.navigate(['/menu']);
          });
        })
      }
    })
  }

}
