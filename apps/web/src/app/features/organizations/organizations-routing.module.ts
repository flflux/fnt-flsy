import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddOrganizationComponent } from './pages/add-organization/add-organization.component';
import { ListOrganizationsComponent } from './pages/list-organizations/list-organizations.component';
import { OrganizationsComponent } from './organizations.component';
import { EditOrganizationComponent } from './pages/edit-organization/edit-organization.component';
import { ViewOrganizationsComponent } from './pages/view-organizations/view-organizations.component';

const routes: Routes = [

  {
    path: '',
    data: { breadcrumb: 'Organizations' },
    component: OrganizationsComponent,
    children: [
      {
        path: '',
        component: ListOrganizationsComponent,
      },
      {
        path: 'add',
        data: { breadcrumb: 'Add' },
        component: AddOrganizationComponent,
      },

      {
        path: ':id',
        data: { breadcrumb: { alias: 'ViewOrganization' } },
        children: [
          {
            path: '',
            component: ViewOrganizationsComponent,
          },
          {
            path: 'sitegroups', 
            loadChildren: () =>
              import('../sitegroups/sitegroups.module').then(
                (m) => m.SitegroupsModule
              ),
          },

          {
            path: 'edit',
            data: { breadcrumb: 'Edit' },
            component: EditOrganizationComponent,
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
export class OrganizationsRoutingModule {}
