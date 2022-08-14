import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BitacoraComponent } from './components/bitacora/bitacora.component';
import { ClaseComponent } from './components/clase/clase.component';
import { FacultadComponent } from './components/facultad/facultad.component';
import { LoginComponent } from './components/login/login.component';
import { MateriaComponent } from './components/materia/materia.component';
import { PrototipoComponent } from './components/prototipo/prototipo.component';
import { ProyectoCComponent } from './components/proyecto-c/proyecto-c.component';

const routes: Routes = [
    {
      path: 'index',
      component: LoginComponent,
    },
    {
      path: 'menu',
      component: PrototipoComponent,
    },
    {
      path: 'registrar_facultad',
      component: FacultadComponent,
    },
    {
      path: 'registrar_proyecto',
      component: ProyectoCComponent,
    },
    {
      path: 'registrar_materia',
      component: MateriaComponent,
    },
    {
      path: 'registrar_clase',
      component: ClaseComponent,
    },
    {
      path: 'generar_bitacora',
      component: BitacoraComponent,
    },
    {
      path: '', redirectTo: 'index', pathMatch: 'full',
    },
  ]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
