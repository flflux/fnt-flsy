import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './features/login/pages/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { OrganizationSwitchPageComponent } from './features/login/organization-switch-page/organization-switch-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    
  },

  {
    path: 'switchpage',
    component: OrganizationSwitchPageComponent,
    
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  
  
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'organizations',
        loadChildren: () =>
          import('./features/organizations/organizations.module').then(
            (m) => m.OrganizationsModule
          ),
      },
      {
        path: 'devices',
        loadChildren: () =>
          import('./features/devices/devices.module').then(
            (m) => m.DevicesModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/users/users.module').then(
            (m) => m.UsersModule
          ),
      },
      {
        path: 'sitegroups',
        loadChildren: () =>
          import('./features/sitegroups/sitegroups.module').then(
            (m) => m.SitegroupsModule
          ),
      },
      {
        path: 'sites',
        loadChildren: () =>
          import('./features/sites/sites.module').then((m) => m.SitesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
