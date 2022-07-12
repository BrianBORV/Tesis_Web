import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrototipoComponent } from './components/prototipo/prototipo.component';
import { MateriaComponent } from './components/materia/materia.component';
import { ClaseComponent } from './components/clase/clase.component';
import { BitacoraComponent } from './components/bitacora/bitacora.component';
import { FacultadComponent } from './components/facultad/facultad.component';
import { ProyectoCComponent } from './components/proyecto-c/proyecto-c.component';

@NgModule({
  declarations: [
    AppComponent,
    PrototipoComponent,
    MateriaComponent,
    ClaseComponent,
    BitacoraComponent,
    FacultadComponent,
    ProyectoCComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
