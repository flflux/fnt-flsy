import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSitesComponent } from './pages/list-sites/list-sites.component';
import { AddSiteComponent } from './pages/add-site/add-site.component';
import { EditSiteComponent } from './pages/edit-site/edit-site.component';
import { ViewSiteComponent } from './pages/view-site/view-site.component';
import { SitesComponent } from './sites.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: '',
    component: SitesComponent,
    children: [
      {
        path: '',
        component: ListSitesComponent,
      },
      {
        path: 'add',
        component: AddSiteComponent,
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            component: ViewSiteComponent,
          },
          {
            path: 'edit',
            component: EditSiteComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SitesRoutingModule {}
