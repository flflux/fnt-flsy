import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSitegroupsComponent } from './pages/list-sitegroups/list-sitegroups.component';
import { AddSitegroupComponent } from './pages/add-sitegroup/add-sitegroup.component';
import { EditSitegroupComponent } from './pages/edit-sitegroup/edit-sitegroup.component';
import { ViewSitegroupComponent } from './pages/view-sitegroup/view-sitegroup.component';
import { SitegroupsComponent } from './sitegroups.component';
//import { ViewOrganizationsComponent } from '../organizations/pages/view-organizations/view-organizations.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: '',
    component: SitegroupsComponent,
    children: [
      {
        path: '',
        component: ListSitegroupsComponent,
      },

      {
        path: 'add',
        component: AddSitegroupComponent,
      },

      {
        path: ':id',
        children:[
          {
            path: '',
            component: ViewSitegroupComponent
          },
          {
            path: 'edit', 
            component: EditSitegroupComponent
          }
        ]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SitegroupsRoutingModule {}
