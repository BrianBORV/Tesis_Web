import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrototipoComponent } from './components/prototipo/prototipo.component';
import { MateriaComponent } from './components/materia/materia.component';
import { ClaseComponent } from './components/clase/clase.component';
import { BitacoraComponent } from './components/bitacora/bitacora.component';
import { FacultadComponent } from './components/facultad/facultad.component';
import { ProyectoCComponent } from './components/proyecto-c/proyecto-c.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    PrototipoComponent,
    MateriaComponent,
    ClaseComponent,
    BitacoraComponent,
    FacultadComponent,
    ProyectoCComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
