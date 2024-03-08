import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserDialogComponent } from './components/add-user-dialog/add-user-dialog.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { ViewUserComponent } from './components/view-user/view-user.component';
import { UsersComponent } from './users.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: 'list',
        component: ListUsersComponent,
      },

      {
        path: 'add',
        component: AddUserDialogComponent,
      },

      {
        path: ':id',
        children: [
          {
            path: '',
            component: ViewUserComponent,
          },
          {
            path: 'edit', 
            component: EditUserComponent,
          }
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
