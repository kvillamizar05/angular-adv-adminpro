import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesaComponent } from './promesa/promesa.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
    { 
        path: 'dashboard',
        component: PagesComponent, 
        canActivate: [AuthGuard],
        children: [
          { path: '', component: DashboardComponent, data: { titulo: 'Dasboard'} },
          { path: 'progress', component: ProgressComponent, data: { titulo: 'Barra de progreso'} },
          { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Gráfica #1'} },
          { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes de sistema'} },
          { path: 'promise', component: PromesaComponent, data: { titulo: 'Promesas'} },
          { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs'} },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
